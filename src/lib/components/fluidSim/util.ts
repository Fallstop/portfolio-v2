export const fluidSimContextKey = "fluidSimContext";


export const normalizeColor = (input: RGBColour) => ({
    r: input.r / 255,
    g: input.g / 255,
    b: input.b / 255
});

export function scaleByPixelRatio(input: number) {
    return Math.floor(input * (window.devicePixelRatio || 1) * 0.5);
} 

export function hashCode(s: string) {
    if (s.length == 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
