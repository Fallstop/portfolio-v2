import { dev } from '$app/environment';
import { text, type Handle } from '@sveltejs/kit';

// The ulogger app posts forms without an Origin header, so SvelteKit's CSRF check is
// disabled in svelte.config.js and reimplemented here for everything except that endpoint
const CSRF_EXEMPT_PATHS = ['/client/index.php'];
const FORM_CONTENT_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];

function isCrossSiteFormSubmission(request: Request, url: URL) {
    const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() ?? '';
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
        && FORM_CONTENT_TYPES.includes(contentType)
        && request.headers.get('origin') !== url.origin;
}

export const handle: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url;

    if (!dev && !CSRF_EXEMPT_PATHS.includes(pathname) && isCrossSiteFormSubmission(event.request, event.url)) {
        return text('Cross-site form submissions are forbidden', { status: 403 });
    }

    if (pathname.startsWith('/relay-VNY1')) {
        // Determine target hostname based on static or dynamic ingestion
        const hostname = pathname.startsWith('/relay-VNY1/static/')
            ? 'us-assets.i.posthog.com' // change us to eu for EU Cloud
            : 'us.i.posthog.com';  // change us to eu for EU Cloud

        // Build external URL
        const url = new URL(event.request.url);
        url.protocol = 'https:';
        url.hostname = hostname;
        url.port = '443';
        url.pathname = pathname.replace('/relay-VNY1/', '');

        // Clone and adjust headers. Cookies are for this site, not PostHog, and PostHog
        // needs the visitor's IP (not Cloudflare's) for GeoIP
        const headers = new Headers(event.request.headers);
        headers.set('host', hostname);
        headers.delete('cookie');
        const clientIP = event.request.headers.get('cf-connecting-ip');
        if (clientIP) headers.set('x-forwarded-for', clientIP);

        // Proxy the request to the external host
        const response = await fetch(url.toString(), {
            method: event.request.method,
            headers,
            body: event.request.body,
            duplex: "half"
        } as RequestInit & {duplex: string});

        return response;
    }

    const response = await resolve(event);
    return response;
};