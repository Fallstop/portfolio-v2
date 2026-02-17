import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

const KV_KEY = 'logi_haptic_downloads';
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours
const FETCH_TIMEOUT_MS = 5000;

interface CachedData {
	count: number;
	fetchedAt: number;
}

async function fetchUpstream(signal: AbortSignal): Promise<number | null> {
	try {
		const res = await fetch('https://marketplace.logi.com/api/downloads', { signal });
		if (!res.ok) return null;
		const data = await res.json();
		return data?.plugins?.HapticWeb?.downloads ?? null;
	} catch {
		return null;
	}
}

export const GET: RequestHandler = async ({ platform }) => {
	const kv = platform?.env?.KV;

	let cached: CachedData | null = null;
	if (kv) {
		const raw = await kv.get(KV_KEY);
		if (raw) {
			try {
				cached = JSON.parse(raw);
			} catch { /* ignore */ }
		}
	}

	// Return fresh cache immediately
	if (cached && Date.now() - cached.fetchedAt < CACHE_MAX_AGE_MS) {
		return json({ downloads: cached.count });
	}

	// Cache is stale or missing — fetch upstream
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	const count = await fetchUpstream(controller.signal);
	clearTimeout(timeout);

	if (count !== null) {
		const entry: CachedData = { count, fetchedAt: Date.now() };
		if (kv) {
			await kv.put(KV_KEY, JSON.stringify(entry));
		}
		return json({ downloads: count });
	}

	// Upstream failed — serve stale if available
	if (cached) {
		return json({ downloads: cached.count });
	}

	return json({ downloads: null });
};
