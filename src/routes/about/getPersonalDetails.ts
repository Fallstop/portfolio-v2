export const birthdate = '2005-08-12';

export function getAge() {
    const yearLengthMS = 24 * 3600 * 365.25 * 1000;
    let birthday = +new Date(birthdate);
    return ~~((Date.now() - birthday) / (yearLengthMS));  
}