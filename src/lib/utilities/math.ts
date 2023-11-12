export function wrap(value: number, min: number, max: number) {
    const range = max - min;
    if (range == 0) return min;
    return ((value - min) % range) + min;
}