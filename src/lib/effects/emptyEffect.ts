export function emptyEffect(...args: any[]) {
    return { destroy: () => {} };
}