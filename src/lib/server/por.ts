/**
 * Proof-of-Render (PoR) — server side.
 *
 * Centerpiece anti-bot mechanism for the contact form. The contact route's
 * `load()` calls {@link issueToken} to mint a fresh, HMAC-signed token that is
 * embedded in a hidden field. On submit, {@link verifyPoR} re-derives and
 * re-checks everything statelessly on the edge:
 *
 *   L1  signature  — token must be signed by us (forgery => hard drop)
 *       dwell/TTL  — submitted too fast => bot (hard drop); very old => soft
 *   L2  render proof — browser must have folded the token with the message
 *       body using our shipped code. Wrong proof => bot (hard drop); absent
 *       proof => "no JS" => soft (a privacy/NoScript human, never dropped).
 *
 * Stateless by design: everything needed to verify a token is inside the
 * signed token itself, so it works on Cloudflare Workers with no KV/DB.
 *
 * The signing key is derived from an existing server secret (DISCORD_WEBHOOK)
 * plus a code-side salt, so no new environment variable is required. Rotate the
 * whole scheme by bumping {@link KEY_SALT} (kills all outstanding tokens) and/or
 * reordering the TRANSFORMS table in foldProof.ts.
 */

import { DISCORD_WEBHOOK } from '$lib/server/env.js';
import {
	FOLD_VERSION,
	TRANSFORM_COUNT,
	bytesToB64url,
	b64urlToBytes,
	computeProof,
	sha256,
	utf8
} from '$lib/foldProof.js';

/** Bump to invalidate every outstanding token and re-key the HMAC. */
const KEY_SALT = 'por-fold-v1';

/** A real human cannot read the page and submit the form this fast. */
const MIN_DWELL_MS = 1_200;
/** Beyond this, the token is "stale" — a *soft* signal, not a hard drop, so a
 *  slow composer or a re-opened tab is never silently lost. */
const MAX_DWELL_MS = 60 * 60 * 1000; // 1 hour
/** Tolerance for clock skew on a future-dated issue time. */
const CLOCK_SKEW_MS = 60 * 1000;

interface TokenPayload {
	v: number;
	n: string; // nonce
	t: number; // issued-at (ms epoch)
	r: number; // transform selector (server re-derives; never trusted from wire)
}

export interface PorResult {
	/** true => deterministic bot signal; caller silently drops to spam channel. */
	hard: boolean;
	/** reason for a hard drop (for the spam-channel annotation). */
	reason?: string;
	/** non-fatal signals to fold into content scoring (e.g. 'no-js', 'stale'). */
	soft: string[];
}

let _keyPromise: Promise<CryptoKey> | null = null;

async function signingKey(): Promise<CryptoKey> {
	// DISCORD_WEBHOOK is already required for the form to function and is high
	// entropy; deriving from it avoids forcing a new secret on the operator.
	const raw = await sha256(utf8(String(DISCORD_WEBHOOK ?? '') + '|' + KEY_SALT));
	return crypto.subtle.importKey('raw', raw as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, [
		'sign'
	]);
}

function key(): Promise<CryptoKey> {
	return (_keyPromise ??= signingKey());
}

async function hmac(msg: Uint8Array): Promise<Uint8Array> {
	const sig = await crypto.subtle.sign('HMAC', await key(), msg as BufferSource);
	return new Uint8Array(sig);
}

/** Constant-time string comparison (length leak is acceptable here). */
function ctEq(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

/** Mint a signed render token. Call from the contact route's `load()`. */
export async function issueToken(): Promise<string> {
	const nonce = crypto.randomUUID();
	const iat = Date.now();
	const r = (await hmac(utf8(nonce)))[0] % TRANSFORM_COUNT;
	const payload: TokenPayload = { v: FOLD_VERSION, n: nonce, t: iat, r };
	const payloadB64 = bytesToB64url(utf8(JSON.stringify(payload)));
	const sig = bytesToB64url(await hmac(utf8(payloadB64)));
	return payloadB64 + '.' + sig;
}

/**
 * Verify a submitted token + render proof against the exact body.
 *
 * Returns `{ hard: true, reason }` only for signals a real browser running our
 * own JS can never produce (forged signature, impossibly fast submit, a
 * present-but-wrong proof). Everything a legitimate human might plausibly do
 * (no JS, a stale tab, a missing token from a stale cache) comes back
 * `{ hard: false, soft: [...] }` and is left for the soft content scorer.
 */
export async function verifyPoR(input: {
	por: unknown;
	proof: unknown;
	name: string;
	email: string;
	message: string;
}): Promise<PorResult> {
	const soft: string[] = [];
	const por = input.por;

	// Missing/malformed token: could be a stale cached page (pre-deploy) or a
	// no-JS client — soft, not hard. (A *forged* token, below, is hard.)
	if (typeof por !== 'string' || !por.includes('.')) {
		return { hard: false, soft: ['no-token'] };
	}

	const dot = por.indexOf('.');
	const payloadB64 = por.slice(0, dot);
	const sig = por.slice(dot + 1);

	const expSig = bytesToB64url(await hmac(utf8(payloadB64)));
	if (!ctEq(sig, expSig)) return { hard: true, reason: 'forged-signature', soft };

	let p: TokenPayload;
	try {
		p = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
	} catch {
		return { hard: true, reason: 'bad-payload', soft };
	}
	if (typeof p.t !== 'number' || typeof p.n !== 'string') {
		return { hard: true, reason: 'bad-payload', soft };
	}

	const now = Date.now();
	const dwell = now - p.t;
	if (p.t > now + CLOCK_SKEW_MS) return { hard: true, reason: 'future-issued', soft };
	if (dwell < MIN_DWELL_MS) return { hard: true, reason: `too-fast(${dwell}ms)`, soft };
	if (dwell > MAX_DWELL_MS) soft.push('stale');

	// Re-derive the transform selector from the (signed) nonce — never trust the
	// `r` carried in the payload, even though it's covered by the signature.
	const r = (await hmac(utf8(p.n)))[0] % TRANSFORM_COUNT;

	const proof = input.proof;
	if (typeof proof !== 'string' || proof.length === 0) {
		// Token is authentic but no JS ran to produce a proof — treat as a
		// possible no-JS human. Soft signal; delivered (annotated) by the scorer.
		soft.push('no-js');
		return { hard: false, soft };
	}

	const expProof = await computeProof({
		payloadB64,
		name: input.name,
		email: input.email,
		message: input.message,
		r
	});
	if (!ctEq(proof, expProof)) return { hard: true, reason: 'wrong-proof', soft };

	return { hard: false, soft };
}
