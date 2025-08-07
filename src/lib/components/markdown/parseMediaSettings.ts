export const sizeOptions = ["raw", "none", "small", "medium", "large", "full", "text"]
export const classOptions = [...sizeOptions, "borderless", "center"];

export function parseSettings(settings: string) {
    let classes = [];

    // If the alt includes a class, it will be in the format "blah blah:size"
    for (let match of settings.matchAll(/\:([a-zA-Z]{3,})/g)) {
        let option = match[1]?.toLowerCase();
        if (classOptions.includes(option || "")) {
            classes.push(option);
        }
    }

    let altTextMatch = settings.match(/^[^:]*/);
    let altText = altTextMatch ? altTextMatch[0] : "";

    if (!classes.some((a)=>sizeOptions.includes(a))) {
        // Default size class
        classes.push("medium")
    }

    return {
        altText,
        classes: classes.join(" ")
    }

}