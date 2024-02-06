export function wrap(value: number, min: number, max: number) {
    const range = max - min;
    if (range == 0) return min;
    return ((value - min) % range) + min;
}

export function randomFromList<T>(value: T[] | string): T | string {
    return value[Math.floor(Math.random() * value.length)]
}

export function randomOrderList<T>(value: T[], randFn = Math.random): T[] {
    value.sort(()=>randFn()-0.5)
    return value
}

export function randomHash(): string {
    let r = (Math.random() + 1).toString(36).substring(2);
    return r;
}