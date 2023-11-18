export type NormalisedDate = `${number}-${number}-${number}`;

export const formatDate = (date: Date): NormalisedDate =>
    date
        .toLocaleString("sv")
        .split(" ")[0] as NormalisedDate;

export function getYearsFrom(date: string | Date) {
    const yearLengthMS = 24 * 3600 * 365.25 * 1000;
    let dateNorm = +new Date(date);
    return ~~((Date.now() - dateNorm) / (yearLengthMS));
}