import { normaliseCase } from "$lib/utilities/string"

const customTagCapitalisation = [
    "LoRa",
    "C/C++",
    "UoA",
    "COVID"
]

export function tagCase(normalisedTag: string): string {
    return customTagCapitalisation.find(customTag=>normaliseCase(customTag)==normalisedTag) || normalisedTag;
}