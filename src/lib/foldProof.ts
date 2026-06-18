/**
 * Proof-of-Render (PoR) — shared fold primitives.
 *
 * This module is *isomorphic*: it is imported by BOTH the browser (contact
 * form) and the Cloudflare edge (server verification). Keeping the byte-fold in
 * a single place is deliberate — two hand-kept copies would inevitably drift,
 * and any drift makes every legitimate submission fail the proof check. So the
 * one rule for this file: it must contain **no secrets and no platform-specific
 * APIs** — only Web Crypto (`crypto.subtle`) and `btoa`/`atob`, which exist
 * identically in the browser and in Workers.
 *
 * The "security by obscurity" lives in `TRANSFORMS`: a small table of custom,
 * deterministic byte operations. The server picks one per request (via an
 * HMAC of the token nonce) and the browser must apply the same one. A bot that
 * only round-trips the token without executing this code cannot produce the
 * matching proof. The table is cheap to rotate — reorder it (and bump the key
 * salt in `por.ts`) and every previously-harvested transform mapping is dead.
 */

export const FOLD_VERSION = 1;

const enc = /*#__PURE__*/ new TextEncoder();

export function utf8(s: string): Uint8Array {
	return enc.encode(s);
}

/** URL-safe base64 (no padding), works in both browser and Workers. */
export function bytesToB64url(bytes: Uint8Array): string {
	let bin = '';
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function b64urlToBytes(s: string): Uint8Array {
	let b = s.replace(/-/g, '+').replace(/_/g, '/');
	while (b.length % 4) b += '=';
	const bin = atob(b);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

export async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
	const digest = await crypto.subtle.digest('SHA-256', bytes as BufferSource);
	return new Uint8Array(digest);
}

/**
 * The obscured part. Each entry maps a byte array to another byte array,
 * deterministically. None of these need to be reversible — the result is fed
 * straight into SHA-256 — they only need to be identical on both ends and
 * non-trivial enough that you must actually run the code to reproduce them.
 */
export const TRANSFORMS: ReadonlyArray<(b: Uint8Array) => Uint8Array> = [
	// 0 — identity (still hashed; cheap "do nothing" slot)
	(b) => b,
	// 1 — reverse
	(b) => b.slice().reverse(),
	// 2 — add running index
	(b) => b.map((x, i) => (x + i) & 0xff),
	// 3 — rotate each byte left by 1 bit
	(b) => b.map((x) => ((x << 1) | (x >> 7)) & 0xff),
	// 4 — swap nibbles
	(b) => b.map((x) => ((x >> 4) | (x << 4)) & 0xff),
	// 5 — xor with a position-dependent pattern
	(b) => b.map((x, i) => x ^ (0xa5 ^ (i & 0xff))),
	// 6 — one's complement
	(b) => b.map((x) => ~x & 0xff),
	// 7 — pairwise byte swap
	(b) => {
		const o = b.slice();
		for (let i = 0; i + 1 < o.length; i += 2) {
			const t = o[i];
			o[i] = o[i + 1];
			o[i + 1] = t;
		}
		return o;
	}
];

export const TRANSFORM_COUNT = TRANSFORMS.length;

/**
 * Compute the render proof for a token + the exact submitted body.
 *
 * proof = b64url( sha256( TRANSFORMS[r]( payloadBytes XOR sha256(name|0|email|0|message) ) ) )
 *
 * Binding the proof to a hash of (name, email, message) is what makes a
 * harvested token single-body: the same token cannot be replayed with a
 * different message without re-running this in a real browser, which defeats
 * the "same identity, rotating one-line body" spam pattern for free.
 *
 * IMPORTANT: callers on both ends must pass the *raw* field values exactly as
 * submitted (no trimming / casing) so the content hash matches byte-for-byte.
 */
export async function computeProof(args: {
	payloadB64: string;
	name: string;
	email: string;
	message: string;
	r: number;
}): Promise<string> {
	const { payloadB64, name, email, message, r } = args;

	const nameB = utf8(name);
	const emailB = utf8(email);
	const messageB = utf8(message);
	const joined = new Uint8Array(nameB.length + emailB.length + messageB.length + 2);
	let o = 0;
	joined.set(nameB, o);
	o += nameB.length;
	joined[o++] = 0;
	joined.set(emailB, o);
	o += emailB.length;
	joined[o++] = 0;
	joined.set(messageB, o);

	const content = await sha256(joined);
	const payloadBytes = utf8(payloadB64);
	const material = payloadBytes.map((x, i) => x ^ content[i % content.length]);

	const transform = TRANSFORMS[((r % TRANSFORM_COUNT) + TRANSFORM_COUNT) % TRANSFORM_COUNT];
	const folded = transform(material);
	return bytesToB64url(await sha256(folded));
}
