import { env } from '$env/dynamic/private';

// Only used while prerendering (GitHub stats on /about), where runtime env isn't available
export { GITHUB_AUTH_TOKEN } from '$env/static/private';

// Read per request from the Cloudflare Pages environment, so these stay out of the
// built Worker bundle and can be rotated in the dashboard without a rebuild
export const secrets = {
    get DISCORD_WEBHOOK() { return env.DISCORD_WEBHOOK; },
    get DISCORD_SPAM_WEBHOOK() { return env.DISCORD_SPAM_WEBHOOK; },
    get ULOGGER_USER() { return env.ULOGGER_USER; },
    get ULOGGER_PASS() { return env.ULOGGER_PASS; },
};
