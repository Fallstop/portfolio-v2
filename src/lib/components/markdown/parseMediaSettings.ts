export const sizeOptions = ["raw", "small", "medium", "large", "full"];

export function parseSettings(settings: string) {
    // If the alt includes a size, it will be in the format "blah blah:size"

    let hasSize = settings.includes(":");
    let altSizeText = hasSize ? settings.split(":").at(-1) : "";
    let altText = hasSize ? settings.split(":").slice(0, -1).join(":") : settings;


    let size = sizeOptions.includes(altSizeText || "") ? altSizeText : "medium";

    return {
        altText,
        size
    }

}