import { type Actions, fail } from '@sveltejs/kit';
import { DISCORD_WEBHOOK, DISCORD_SPAM_WEBHOOK } from '$lib/server/env.js';
import { accentColor, hexColourToNumber, primaryColor } from '$lib/utilities/colour';

export const actions: Actions = {
    default: async ({ request, getClientAddress, fetch }) => {
        const formData = await request.formData();
        const { name, email, message, website } = Object.fromEntries(formData.entries());
        const IP = getClientAddress();

        // Honeypot: if a bot filled in the hidden "website" field, forward to spam webhook
        if (website) {
            if (DISCORD_SPAM_WEBHOOK) {
                const spamEmbed = {
                    title: 'Honeypot Triggered — Spam Blocked',
                    fields: [
                        { name: 'Name', value: String(name || '(empty)'), inline: true },
                        { name: 'Email', value: String(email || '(empty)'), inline: true },
                        { name: 'Honeypot Value', value: String(website), inline: true },
                        { name: 'Message', value: String(message || '(empty)') }
                    ],
                    color: hexColourToNumber('#ff4444'),
                    timestamp: new Date().toISOString(),
                    footer: { text: `IP Address ${IP}` }
                };
                await fetch(DISCORD_SPAM_WEBHOOK, {
                    method: 'POST',
                    body: JSON.stringify({ embeds: [spamEmbed] }),
                    headers: { 'Content-Type': 'application/json' }
                }).catch(() => {});
            }
            return { success: true };
        }

        if (!(name && email && message && typeof name === "string" && typeof message === "string" && typeof email === "string")) {
            return fail(400, { error: "Missing required fields." });
        }

        if (!DISCORD_WEBHOOK) {
            console.log("WARNING: No Discord webhook found.");
            return fail(500, { error: "No Discord webhook found." });
        }

        // I am very lazy.
        const messageEmbed = {
            title: 'New Contact Form Submission',
            fields: [
                { name: 'Name', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Message', value: message }
            ],
            color: hexColourToNumber(accentColor),
            timestamp: new Date().toISOString(),
            footer: { text: `IP Address ${IP}` }
        }

        try {
            const response = await fetch(DISCORD_WEBHOOK, {
                method: "POST",
                body: JSON.stringify({
                    embeds: [messageEmbed]
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error(`Discord webhook failed: ${response.status} ${response.statusText}`);
                return fail(500, { error: "Failed to send message. Please try again." });
            }
        } catch (e) {
            console.error("Discord webhook error:", e);
            return fail(500, { error: "Failed to send message. Please try again." });
        }

        return { success: true }
    }
};