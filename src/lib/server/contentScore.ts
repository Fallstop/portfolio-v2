/**
 * Soft spam scoring for the contact form.
 *
 * This layer NEVER hard-drops — every signal here is something a real human
 * could plausibly trip (a terse "what's your price", a pasted portfolio link, a
 * caps-locked word, a gmail handle with digits). Hard silent-drops are reserved
 * for the deterministic PoR / honeypot layers. Here we only decide which
 * Discord channel a submission lands in, and whether to annotate it:
 *
 *   score  < 3  -> accept : real inbox, normal embed
 *   3 <= score < 6 -> flag : real inbox, amber embed + score/signals footer
 *   score >= 6  -> spam   : spam channel, client still sees success
 *
 * Reaching 6 requires several independent clusters (e.g. shortener + financial
 * + shouting), which a genuine inquiry cannot realistically stack. Weights and
 * detections come from a corpus analysis of real spam that got through; the
 * guiding rule is that the *cost of a false positive is high*, so the model is
 * deliberately conservative and additive.
 */

const OWN_DOMAIN = 'jmw.nz';

/** Known datacenter / VPN / bulletproof ranges seen in the spam corpus. Used
 *  ONLY as a capped multiplier, never as a standalone basis. */
const DATACENTER_CIDRS: ReadonlyArray<[string, number]> = [
	['45.91.23.0', 24],
	['80.94.95.0', 24],
	['77.90.0.0', 16],
	['141.98.0.0', 16],
	['158.173.0.0', 16],
	['196.196.0.0', 16],
	['193.124.0.0', 16],
	['193.29.0.0', 16],
	['161.115.0.0', 16],
	['191.96.0.0', 16]
];

export interface Signal {
	name: string;
	weight: number;
}

export interface ContentScore {
	score: number;
	signals: Signal[];
	verdict: 'accept' | 'flag' | 'spam';
}

function ipToInt(ip: string): number | null {
	const parts = ip.split('.');
	if (parts.length !== 4) return null;
	let n = 0;
	for (const part of parts) {
		const o = Number(part);
		if (!Number.isInteger(o) || o < 0 || o > 255) return null;
		n = (n << 8) | o;
	}
	return n >>> 0;
}

function isDatacenterIp(ip: string): boolean {
	const addr = ipToInt(ip);
	if (addr === null) return false;
	for (const [base, bits] of DATACENTER_CIDRS) {
		const baseInt = ipToInt(base);
		if (baseInt === null) continue;
		const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
		if ((addr & mask) === (baseInt & mask)) return true;
	}
	return false;
}

function urlMatches(message: string): string[] {
	return message.match(/(?:https?:\/\/|www\.)[^\s<>"')]+/gi) ?? [];
}

function letterStats(s: string): { letters: number; upper: number } {
	let letters = 0;
	let upper = 0;
	for (const ch of s) {
		if (/\p{L}/u.test(ch)) {
			letters++;
			if (ch !== ch.toLowerCase() && ch === ch.toUpperCase()) upper++;
		}
	}
	return { letters, upper };
}

/** Cheap gibberish heuristic over the longest "word" in a string.
 *  URLs/emails are stripped first — their consonant clusters (e.g. "https")
 *  are not gibberish and are scored by the URL/domain signals instead. */
function looksLikeGibberish(s: string): boolean {
	const cleaned = s.replace(/(?:https?:\/\/|www\.)[^\s]+/gi, ' ').replace(/\S+@\S+/g, ' ');
	const tokens = cleaned.split(/\s+/).filter((t) => t.length > 8);
	for (const tok of tokens) {
		if (/[.:/@\\]/.test(tok)) continue; // url/domain/path/email-ish — handled elsewhere
		const ascii = tok.replace(/[^A-Za-z]/g, '');
		if (ascii.length < 8) {
			// long token that's mostly non-letters with a digit run (e.g. "178096NEYHRTGE")
			if (/[0-9]{4,}/.test(tok) && /[A-Z]{4,}/.test(tok)) return true;
			continue;
		}
		const vowels = (ascii.match(/[aeiouAEIOU]/g) ?? []).length;
		const vowelRatio = vowels / ascii.length;
		const longConsonantRun = /[^aeiouAEIOU]{7,}/.test(ascii);
		const { letters, upper } = letterStats(tok);
		const upperRatio = letters ? upper / letters : 0;
		if (vowelRatio < 0.2) return true;
		if (longConsonantRun) return true;
		if (upperRatio > 0.7 && /[0-9]/.test(tok)) return true;
	}
	return false;
}

export interface ScoreInput {
	name: string;
	email: string;
	message: string;
	ip: string;
	/** soft signals from PoR verification, e.g. ['no-js'], ['stale'], ['no-token']. */
	porSoft: string[];
	/** raw value of the por_ix field: "<flag><ms>" where flag is 'p' (paste) or 'n'. */
	porIx?: string;
}

export function scoreContent(input: ScoreInput): ContentScore {
	const signals: Signal[] = [];
	const add = (name: string, weight: number) => {
		if (weight > 0) signals.push({ name, weight });
	};

	// Hard length caps before any regex runs — a real submission is tiny (the
	// form limits the message to 1024). This bounds every regex below to linear
	// cost over a small input, neutralising ReDoS via an oversized field. Caps
	// affect scoring only; the full raw message is still delivered to Discord.
	const name = (input.name ?? '').slice(0, 512);
	const message = (input.message ?? '').slice(0, 8192);
	const email = (input.email ?? '').trim().slice(0, 320);
	const lcMessage = message.toLowerCase();
	const emailDomain = email.includes('@') ? email.split('@')[1]?.toLowerCase() ?? '' : '';
	const emailLocal = email.includes('@') ? email.split('@')[0] ?? '' : '';

	// --- shortener / redirect domain (w4) ---
	const urls = urlMatches(message);
	const shortenerRe =
		/\b(bit\.ly|t\.me|telegra\.ph|tinyurl|cutt\.ly|rb\.gy|is\.gd|lnk[a-z]*\.[a-z]{2,3}|bpl\.[a-z]{2,3}|[a-z0-9]{3,8}\.(?:kr|at|link|pro|click|xyz|top|icu))\b/i;
	const disposableHostRe = /\.(?:netlify|pages|vercel)\.app\b/i;
	if (shortenerRe.test(message) || disposableHostRe.test(message)) add('shortener-domain', 4);

	// --- bare URLs beyond the first (w1.5, first ~free) ---
	if (urls.length >= 2) add('multiple-urls', Math.min(urls.length - 1, 3) * 1.5);

	// --- sender domain spoofs our own domain / noreply (w5) ---
	if (
		emailDomain === OWN_DOMAIN ||
		emailDomain.endsWith('.' + OWN_DOMAIN) ||
		/^(?:no-?reply|donotreply|mailer-daemon|postmaster)$/i.test(emailLocal)
	) {
		add('sender-domain-spoof', 5);
	}

	// --- machine-generated email local part (w2, discounted if it echoes the name) ---
	if (emailLocal) {
		const digits = (emailLocal.match(/[0-9]/g) ?? []).length;
		const digitRatio = digits / emailLocal.length;
		// Linear, anchored checks (avoid the backtracking-prone [a-z]{4,}[0-9]{3,}$).
		const wordThenDigits = /[0-9]{3,}$/.test(emailLocal) && /^[a-z]{4,}/i.test(emailLocal);
		const machine = (digitRatio > 0.3 && emailLocal.length >= 6) || wordThenDigits;
		const nameTokens = name.toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 3);
		const echoesName = nameTokens.some((t) => emailLocal.toLowerCase().includes(t));
		if (machine) add('machine-email', echoesName ? 1 : 2);
	}

	// --- bot-name morphology (w2.5) ---
	const trimmedName = name.trim();
	const nameNoSpace = !/\s/.test(trimmedName);
	const mashedCamel = /^[A-Z][a-z]+[A-Z][a-z]+/.test(trimmedName) && nameNoSpace;
	const internalCaps = (trimmedName.match(/[a-z][A-Z]/g) ?? []).length >= 2;
	const nameStats = letterStats(trimmedName);
	const nameUpperRatio = nameStats.letters ? nameStats.upper / nameStats.letters : 0;
	if (
		mashedCamel ||
		internalCaps ||
		(nameUpperRatio > 0.6 && trimmedName.length > 8) ||
		/[0-9]{3,}/.test(trimmedName)
	) {
		add('bot-name', 2.5);
	}

	// --- high-entropy gibberish in name or message (w4) ---
	if (looksLikeGibberish(name) || looksLikeGibberish(message)) add('gibberish', 4);

	// --- financial scam / urgency ---
	// Split into STRONG (unambiguous scam fingerprints) and WEAK (benign on their
	// own — a real client may say "do you take crypto?" or "budget $20,000"). Weak
	// categories alone can never reach the spam line; only a strong fingerprint
	// (a "1.3426 BTC" decimal amount, or jackpot/lottery/inheritance) drives spam.
	const strongFinancial =
		(/\b\d+\.\d{2,}\s*(?:btc|eth)\b/i.test(message) ? 1 : 0) +
		(/\b(jackpot|payout|inheritance|prince|lottery)\b/i.test(message) ? 1 : 0);
	const weakFinancial =
		(/\b(btc|bitcoin|eth|ethereum|usdt|crypto)\b/i.test(message) ? 1 : 0) +
		(/\b(withdraw(?:al)?|claim your|act now|urgent)\b/i.test(message) ? 1 : 0) +
		(/\$\s?\d[\d,]{5,}/.test(message) ? 1 : 0);
	const financial = Math.min(strongFinancial * 3 + weakFinancial * 1.5, 9);
	if (financial > 0) add('financial-urgency', financial);

	// --- shouting caps (w1.5, needs length) ---
	{
		const { letters, upper } = letterStats(message);
		if (message.length > 20 && letters > 0) {
			const ratio = upper / letters;
			if (ratio > 0.5) add('shouting-caps', 1.5 * Math.min(ratio / 0.5, 2));
		}
	}

	// --- unsolicited outreach lexicon (graduated; needs >=2 distinct groups) ---
	const groupA = /\b(review(ed|ing)?|looked at|visited|came across|checked out|noticed)\b[^.]{0,60}\b(web)?site\b/i.test(
		message
	);
	const groupB =
		/\b(seo|search ranking|first page|google ranking|increase (your )?traffic|more (leads|customers|inquiries)|online (presence|visibility))\b/i.test(
			message
		);
	const groupC =
		/\b(web (design|development)|redesign|build (you )?a website|our (agency|team|company)|i work with businesses|digital (growth|marketing))\b/i.test(
			message
		);
	const groupD =
		/\b(proposal|quote|pricing|packages|free (audit|tool|trial|consultation)|no obligation|10[–-]15 minute)\b/i.test(
			message
		);
	const groups = [groupA, groupB, groupC, groupD].filter(Boolean).length;
	if (groups >= 2) add('outreach-template', 2.5 + (groups - 2) * 1.5); // 2->2.5, 3->4, 4->5.5

	// --- free-tool / traffic SEO spam lexicon (graduated: dense stacking = spammier) ---
	const seoPhrases = [
		/\bfree tool\b/i,
		/\bboost your (?:traffic|ranking)\b/i,
		/\bsubmit your site\b/i,
		/\bbacklinks?\b/i,
		/\bclassified submit/i,
		/\bdirectory submission\b/i,
		/\bguaranteed traffic\b/i,
		/\bmore exposure\b/i,
		/\btraffic (?:booster|resources?)\b/i,
		/\bfree traffic\b/i
	];
	const seoHits = seoPhrases.filter((re) => re.test(message)).length;
	if (seoHits > 0) add('seo-spam-lexicon', Math.min(2 + (seoHits - 1), 4));

	// --- terse, low-specificity price ask (w1) ---
	if (
		message.trim().length < 40 &&
		/\b(price|cost|quote|how much|rate)\b/i.test(message) &&
		!/\b(project|website|app|haptic|svelte|portfolio|design|page|resume)\b/i.test(message)
	) {
		add('terse-price-ask', 1);
	}

	// --- soft signals folded from the PoR layer ---
	if (input.porSoft.includes('no-js')) add('no-js', 3);
	if (input.porSoft.includes('no-token')) add('no-token', 3);
	if (input.porSoft.includes('stale')) add('stale-token', 2);

	// --- por_ix derived behavioral soft signals (corroborating only) ---
	if (input.porIx) {
		if (input.porIx[0] === 'p') add('paste-all', 1);
		const ms = Number(input.porIx.slice(1));
		if (Number.isFinite(ms) && ms >= 0 && ms < 400) add('instant-fill', 1);
	}

	// --- assemble ---
	// Soft PoR signals (no-JS, stale tab, paste) are environmental, not spam
	// content. They may *flag* a message but must NEVER, alone or with a single
	// content cluster, route a human to the spam channel. So the spam verdict is
	// gated on CONTENT score only; soft signals only ever lift accept -> flag.
	const SOFT = new Set(['no-js', 'no-token', 'stale-token', 'paste-all', 'instant-fill']);
	let content = 0;
	let soft = 0;
	for (const s of signals) (SOFT.has(s.name) ? (soft += s.weight) : (content += s.weight));

	const ipMultiplier = isDatacenterIp(input.ip) ? 1.25 : 1;
	if (ipMultiplier !== 1 && content > 0) {
		content *= ipMultiplier; // multiplier applies to content only, never soft signals
		signals.push({ name: 'datacenter-ip(x1.25)', weight: 0 });
	}

	const contentScore = Math.round(content * 100) / 100;
	const total = Math.round((content + soft) * 100) / 100;
	const verdict: ContentScore['verdict'] =
		contentScore >= 6 ? 'spam' : total >= 3 ? 'flag' : 'accept';
	return { score: total, signals, verdict };
}
