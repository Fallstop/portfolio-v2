import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DISCORD_WEBHOOK, DISCORD_SPAM_WEBHOOK } from '$lib/server/env.js';
import { accentColor, hexColourToNumber } from '$lib/utilities/colour';
import { issueToken, verifyPoR } from '$lib/server/por.js';
import { scoreContent, type Signal } from '$lib/server/contentScore.js';

const AMBER = '#e0a23b';

/** Issue a fresh Proof-of-Render token for every page view. */
export const load: PageServerLoad = async () => {
    return { porToken: await issueToken() };
};

const clamp = (s: unknown, max: number) => String(s ?? '').slice(0, max);

function signalSummary(signals: Signal[]): string {
    const named = signals.filter((s) => s.name).map((s) => s.name);
    return named.length ? named.join(', ') : 'none';
}

async function postEmbed(webhook: string, embed: Record<string, unknown>, fetchFn: typeof fetch) {
    await fetchFn(webhook, {
        method: 'POST',
        body: JSON.stringify({ embeds: [embed] }),
        headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
}

export const actions: Actions = {
    default: async ({ request, getClientAddress, fetch }) => {
        const formData = await request.formData();
        const IP = getClientAddress();

        // Raw values exactly as submitted — the render proof is computed over
        // these byte-for-byte on both ends, so they must NOT be clamped before
        // verification. Clamping happens only when building Discord embeds.
        const name = String(formData.get('name') ?? '');
        const email = String(formData.get('email') ?? '');
        const message = String(formData.get('message') ?? '');
        // honeypots: both hidden, must stay empty
        const website = formData.get('website');
        const contactReason = formData.get('contact_reason');
        // PoR token + render proof + behavioral salt
        const por = formData.get('por');
        const porProof = formData.get('por_proof');
        const porIx = clamp(formData.get('por_ix'), 32);

        // --- silent-drop helper: bot never learns it was caught ---
        const routeToSpam = async (reason: string, extra: Record<string, unknown>[] = []) => {
            if (DISCORD_SPAM_WEBHOOK) {
                await postEmbed(
                    DISCORD_SPAM_WEBHOOK,
                    {
                        title: 'Spam Blocked',
                        fields: [
                            { name: 'Reason', value: reason, inline: true },
                            { name: 'Name', value: clamp(name || '(empty)', 256), inline: true },
                            { name: 'Email', value: clamp(email || '(empty)', 256), inline: true },
                            { name: 'Message', value: clamp(message || '(empty)', 1024) },
                            ...extra
                        ],
                        color: hexColourToNumber('#ff4444'),
                        timestamp: new Date().toISOString(),
                        footer: { text: `IP Address ${IP}` }
                    },
                    fetch
                );
            }
            // mirror the form's normal success path so the bot sees no difference
            return { success: true };
        };

        // ===== L0: structural honeypots (deterministic, hard drop) =====
        if (website || contactReason) {
            return routeToSpam('honeypot', [
                { name: 'Honeypot', value: clamp(website || contactReason, 256), inline: true }
            ]);
        }

        // ===== L1 + L2: Proof-of-Render (signature, dwell, render proof) =====
        const por_result = await verifyPoR({ por, proof: porProof, name, email, message });
        if (por_result.hard) {
            return routeToSpam(`por:${por_result.reason}`);
        }

        // Required-field validation (after the hard bot gates, before delivery).
        if (!(name && email && message)) {
            return fail(400, { error: 'Missing required fields.' });
        }

        if (!DISCORD_WEBHOOK) {
            console.log('WARNING: No Discord webhook found.');
            return fail(500, { error: 'No Discord webhook found.' });
        }

        // ===== L3: soft content scoring (never hard-drops a human) =====
        const score = scoreContent({ name, email, message, ip: IP, porSoft: por_result.soft, porIx });

        if (score.verdict === 'spam') {
            return routeToSpam('content-score', [
                { name: 'Score', value: String(score.score), inline: true },
                { name: 'Signals', value: signalSummary(score.signals), inline: true }
            ]);
        }

        const flagged = score.verdict === 'flag';
        const messageEmbed: Record<string, unknown> = {
            title: flagged ? 'New Contact Form Submission ⚠︎' : 'New Contact Form Submission',
            fields: [
                { name: 'Name', value: clamp(name, 256), inline: true },
                { name: 'Email', value: clamp(email, 256), inline: true },
                { name: 'Message', value: clamp(message, 1024) }
            ],
            color: hexColourToNumber(flagged ? AMBER : accentColor),
            timestamp: new Date().toISOString(),
            footer: {
                text: flagged
                    ? `IP Address ${IP} • possible spam (score ${score.score}: ${signalSummary(score.signals)})`
                    : `IP Address ${IP}`
            }
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                body: JSON.stringify({ embeds: [messageEmbed] }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                console.error(`Discord webhook failed: ${response.status} ${response.statusText}`);
                return fail(500, { error: 'Failed to send message. Please try again.' });
            }
        } catch (e) {
            console.error('Discord webhook error:', e);
            return fail(500, { error: 'Failed to send message. Please try again.' });
        }

        return { success: true };
    }
};
