interface PeopleDetails {
    name: string;
    homepage?: string;
}

export function getPersonDetails(name: string): PeopleDetails {
    const normaliseName = (x: string)=>x.toLowerCase().replace(/[^a-z0-9]/g, '');

    let searchingName = normaliseName(name);

    for (const person of AuthorDetails) {
        if (normaliseName(person.name) === searchingName) {
            return person;
        }
    }

    return {
        name: name,
    };
}


export const AuthorDetails: PeopleDetails[] = [
    {
        name: "Jasper M-W",
        homepage: "https://jmw.nz/",
    },
    {
        name: "Nathan Hare",
        homepage: "https://laspruca.nz/",
    },
    {
        name: "Taine Reader",
        homepage: "https://invalidse.me/",
    },
    {
        name: "Jacob Read",
        homepage: "https://jacobtread.com/",
    },
    {
        name: "Zac M-W",
        homepage: "https://zac.nz/",
    }
];