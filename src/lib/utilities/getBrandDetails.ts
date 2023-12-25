import Npm from "$lib/components/ExtraIcons/NPM.svelte";
import Discord from "$lib/components/ExtraIcons/Discord.svelte";
import Reddit from "$lib/components/ExtraIcons/Reddit.svelte";
import Twitch from "$lib/components/ExtraIcons/Twitch.svelte";

import { Github, Twitter, Youtube, Facebook, Instagram, Linkedin, Globe, Landmark } from "lucide-svelte";
import Fallstop from "$lib/components/ExtraIcons/Fallstop.svelte";
import Provida from "$lib/components/ExtraIcons/Provida.svelte";
import TerribleHack from "$lib/components/ExtraIcons/TerribleHack.svelte";

export function extractDomain(url: string) {
    try {
        return (new URL(url)).hostname;
    } catch {
        return "jmw.nz"
    }
}

interface BrandData {
    name: string;
    domain: string;
    icon: typeof Github;
    color: string;
}

export const DefaultBrandData: BrandData = {
    name: "Internet",
    domain: "*",
    icon: Globe,
    color: "#444",
}

export function getBrandDetails(url: string): BrandData {
    const domain = extractDomain(url);
    for (const key of Object.keys(brandingDetails)) {
        if (domain.includes(key)) {
            return brandingDetails[key];
        }
    }
    return DefaultBrandData;
}

export const brandingDetails: Record<string,BrandData> = {
    "github.com": {
        name: "GitHub",
        domain: "github.com",
        icon: Github,
        color: "#333333",
    },
    "twitter.com": {
        name: "Twitter",
        domain: "twitter.com",
        icon: Twitter,
        color: "#1d9bf0",
    },
    "npmjs.com": {
        name: "npm",
        domain: "npmjs.com",
        icon: Npm,
        color: "#cb3837",
    },
    "youtube.com": {
        name: "YouTube",
        domain: "youtube.com",
        icon: Youtube,
        color: "#ff0000",
    },
    "reddit.com": {
        name: "Reddit",
        domain: "reddit.com",
        icon: Reddit,
        color: "#ff4500",
    },
    "discord.com": {
        name: "Discord",
        domain: "discord.com",
        icon: Discord,
        color: "#7289da",
    },
    "twitch.tv": {
        name: "Twitch",
        domain: "twitch.tv",
        icon: Twitch,
        color: "#6441a5",
    },
    "facebook.com": {
        name: "Facebook",
        domain: "facebook.com",
        icon: Facebook,
        color: "#0866ff",
    },
    "instagram.com": {
        name: "Instagram",
        domain: "instagram.com",
        icon: Instagram,
        color: "#C13584",
    },
    "linkedin.com": {
        name: "LinkedIn",
        domain: "linkedin.com",
        icon: Linkedin,
        color: "#2867b2",
    },
    "jmw.nz": {
        name: "JMW",
        domain: "jmw.nz",
        icon: Fallstop,
        color: "#451952",
    },
    "provida.nz": {
        name: "Provida",
        domain: "provida.nz",
        icon: Provida,
        color: "#388a94",
    },
    "terriblehack.com": {
        name: "Terrible Idea's Hackathon",
        domain: "terriblehack.com",
        icon: TerribleHack,
        color: "#333",
    },
    "govhack.org": {
        name: "GovHack",
        domain: "govhack.org",
        icon: Landmark,
        color: "#ca1e56"
    }
}