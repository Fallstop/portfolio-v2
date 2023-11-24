import { type Actions, fail } from '@sveltejs/kit';
import { DISCORD_WEBHOOK } from '$lib/server/env.js';
import { accentColor, hexColourToNumber, primaryColor } from '$lib/utilities/colour';
import { EmbedBuilder } from "@discordjs/builders";

export const actions: Actions = {
	default: async ({request, getClientAddress, fetch}) => {
        const formData = await request.formData();
        const { name, email, message } = Object.fromEntries(formData.entries());
        const IP = getClientAddress();

        if (!(name && email && message && typeof name === "string" && typeof message === "string" && typeof email === "string")) {
            return fail(400, { error: "Missing required fields." });
        }
        
        if (!DISCORD_WEBHOOK) {
            console.log("WARNING: No Discord webhook found.");
            return fail(500, { error: "No Discord webhook found." });
        }
        
        // I am very lazy.
        const messageEmbed = new EmbedBuilder()
            .setTitle("New Contact Form Submission")
            .addFields(
                { name: 'Name', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Message', value: message },
            )
            .setColor(hexColourToNumber(accentColor))
            .setTimestamp()
            .setFooter({ text: `IP Address ${IP}`});

        fetch(DISCORD_WEBHOOK, {
            method: "POST",
            body: JSON.stringify({
                embeds: [messageEmbed.toJSON()]
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        return { success: true}
	}
};