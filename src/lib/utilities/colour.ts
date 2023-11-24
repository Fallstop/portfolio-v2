// TODO: Not repeat this from the SASS Styles, should always be the same
export const primaryColor="#451952";
export const tintColor="#662549";
export const secondaryColor="#AE445A";
export const accentColor="#F39F5A";
export const positiveColor="#13934f";


export function hexColourToNumber(colour: string): number {
    return parseInt(colour.replace("#", ""), 16);
}