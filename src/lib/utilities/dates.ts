export type NormalisedDate = `${number}-${number}-${number}`;

export const formatDate = (date: Date): NormalisedDate =>
        date
            .toLocaleString("sv")
            .split(" ")[0] as NormalisedDate;