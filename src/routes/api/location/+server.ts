import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
    if (!platform?.env?.KV) {
        // Fallback for local dev if KV is not mocked or available
        return json({ location: 'Unknown Location' });
    }

    const location = await platform.env.KV.get('current_location');

    return json({ location: location || 'Unknown Location' });
};
