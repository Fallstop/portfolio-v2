import { json, type Actions, fail } from '@sveltejs/kit';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { DISCORD_WEBHOOK } from '$lib/server/env.js';
import { accentColor, primaryColor } from '$lib/utilities/colour';


export const actions: Actions = {
	default: async ({request, getClientAddress}) => {
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
        
        const webhookClient = new WebhookClient({url: DISCORD_WEBHOOK});

        // I am very lazy.
        const messageEmbed = new EmbedBuilder()
            .setTitle("New Contact Form Submission")
            .addFields(
                { name: 'Name', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Message', value: message },
            )
            .setColor(accentColor)
            .setTimestamp()
            .setFooter({ text: `IP Address ${IP}`});

        await webhookClient.send({ embeds: [messageEmbed]});

        return { success: true}
	}
};