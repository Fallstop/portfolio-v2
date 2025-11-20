/**
 * Fake ulogger Server Implementation
 * 
 * This endpoint mimics the ulogger server API (https://github.com/bfabiszewski/ulogger-server)
 * to receive location updates from the ulogger mobile app.
 * 
 * Instead of a full database implementation, we:
 * 1. Authenticate using a secure session mechanism (UUID + SHA-256 hash stored in KV).
 * 2. Accept 'addpos' actions to receive latitude/longitude.
 * 3. Reverse geocode the coordinates using OpenStreetMap's Nominatim API.
 * 4. Store the simplified location string (e.g., "Auckland, NZ") in Cloudflare KV.
 * 
 * This is all to update the "Current Location" about tag lmao
 */
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ULOGGER_USER, ULOGGER_PASS } from '$env/static/private';

export const POST: RequestHandler = async ({ request, platform }) => {
    const formData = await request.formData();
    const action = formData.get('action');

    if (!platform?.env?.KV) {
        return json({ error: true, message: 'KV not configured' });
    }

    // Authentication Helper
    const checkAuth = () => {
        const user = formData.get('user') as string;
        const pass = formData.get('pass') as string;

        if (!user || !pass) return false;

        const userMatch = user === ULOGGER_USER;

        // Use crypto.subtle.timingSafeEqual for password
        const encoder = new TextEncoder();
        const a = encoder.encode(pass);
        const b = encoder.encode(ULOGGER_PASS);

        if (a.byteLength !== b.byteLength) {
            return false;
        }

        const passMatch = (crypto.subtle as any).timingSafeEqual(a, b);

        return userMatch && passMatch;
    };

    // Handle Authentication
    if (action === 'auth') {
        if (checkAuth()) {
            // Generate a random session ID (UUID)
            const sessionId = crypto.randomUUID();

            // Hash the session ID
            const encoder = new TextEncoder();
            const data = encoder.encode(sessionId);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Store hash in KV with TTL (1 year)
            await platform.env.KV.put(`session:${hashHex}`, 'valid', { expirationTtl: 31536000 });

            return json({ error: false }, {
                headers: {
                    'Set-Cookie': `ulogger=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000` // 1 year
                }
            });
        } else {
            return json({ error: true, message: 'Unauthorized' });
        }
    }

    // For other actions, check auth first (but parameters might be different for addpos/addtrack)

    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.headers.get('Cookie');
    let authenticated = false;

    // Check Cookie
    if (cookieHeader) {
        const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
        if (cookies.ulogger) {
            const sessionId = cookies.ulogger;

            // Hash the session ID to verify
            const encoder = new TextEncoder();
            const data = encoder.encode(sessionId);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Check if hash exists in KV
            const sessionValid = await platform.env.KV.get(`session:${hashHex}`);
            if (sessionValid) {
                authenticated = true;
            }
        }
    }

    if (!authenticated && authHeader) {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = atob(base64Credentials).split(':');
        const username = credentials[0];
        const password = credentials[1];

        const userMatch = username === ULOGGER_USER;

        const encoder = new TextEncoder();
        const a = encoder.encode(password);
        const b = encoder.encode(ULOGGER_PASS);

        let passMatch = false;
        if (a.byteLength === b.byteLength) {
            passMatch = (crypto.subtle as any).timingSafeEqual(a, b);
        }

        if (userMatch && passMatch) {
            authenticated = true;
        }
    }

    if (!authenticated) {
        // Fallback to checking body params if sent
        if (checkAuth()) {
            authenticated = true;
        }
    }

    if (!authenticated) {
        return json({ error: true, message: 'Unauthorized' });
    }

    switch (action) {
        case 'addtrack':
            // Return a dummy track ID
            return json({ error: false, trackid: 1 });

        case 'addpos':
            const lat = parseFloat(formData.get('lat') as string);
            const lon = parseFloat(formData.get('lon') as string);

            if (isNaN(lat) || isNaN(lon)) {
                return json({ error: true, message: 'Missing required parameter' });
            }

            // Validate coordinates range
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                return json({ error: true, message: 'Invalid coordinates' });
            }

            try {
                // Reverse Geocoding using Nominatim
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
                    {
                        headers: {
                            'User-Agent': 'Portfolio-V2-Location-Tracker/1.0 (contact@jmw.nz)' // If you're finding my email here, congrats
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Nominatim API failed');
                }

                const data = await response.json();
                const address = data.address;

                // Construct location string: "State, CountryCode" or "Region, CountryCode"
                let locationString = '';

                if (address.state) {
                    locationString = `${address.state}`;
                } else if (address.county) {
                    locationString = `${address.county}`;
                } else if (address.region) {
                    locationString = `${address.region}`;
                } else {
                    locationString = `Wilderness`;
                }

                if (address.country_code) {
                    locationString += `, ${address.country_code.toUpperCase()}`;
                }

                // Store in KV
                await platform.env.KV.put('current_location', locationString);

                return json({ error: false });
            } catch (err) {
                console.error('Error processing location:', err);
                // Don't fail the request to the client, just log it.
                // Or maybe we should return error? ulogger might retry.
                // Let's return success to stop retries if it's a server side issue that won't be fixed by retrying same data.
                return json({ error: false, message: 'Location received but processing failed' });
            }

        default:
            return json({ error: true, message: 'Unknown command' });
    }
};
