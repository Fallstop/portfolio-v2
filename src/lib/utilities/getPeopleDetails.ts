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
// <p>This is a proof of concept built for the Govhack 2024 Hackathon by <a class="text-inherit underline font-normal" href="https://jmw.nz">Jasper Miller-Waugh</a>, <a class="text-inherit underline font-normal" href="https://laspruca.nz">Connor Hare</a>, <a class="text-inherit underline font-normal" href="https://linktr.ee/haunanipao">Haunani Pao</a>, <a class="text-inherit underline font-normal" href="https://www.linkedin.com/in/debbietyl">Debbie Tan</a>, <a class="text-inherit underline font-normal" href="https://www.linkedin.com/in/steffanie-r/">Steffanie Relucio</a>, <a class="text-inherit underline font-normal" href="https://www.linkedin.com/in/elle-lum">Elle Lum</a>, <a class="text-inherit underline font-normal" href="https://www.linkedin.com/in/uxwithjade/">Jade Lim</a>, <a class="text-inherit underline font-normal" href="https://www.linkedin.com/in/johncaveishere/">John Cave</a>, <a class="text-inherit underline font-normal" href="https://walt.online">Walter Lim</a>.</p>

export const AuthorDetails: PeopleDetails[] = [
    {
        name: "Jasper M-W",
        homepage: "https://jmw.nz/about",
    },
    {
        name: "Connor Hare",
        homepage: "https://laspruca.nz/",
    },
    {
        name: "Taine Reader",
        homepage: "https://reader.nz/",
    },
    {
        name: "Jacob Read",
        homepage: "https://jacobtread.com/",
    },
    {
        name: "Zac M-W",
        homepage: "https://zac.nz/",
    },
    {
        name: "Ara Bartlett",
        homepage: "https://www.linkedin.com/in/ara-bartlett-197b82250",
    },
    {
        name: "Haunani Pao",
        homepage: "https://linktr.ee/haunanipao",
    },
    {
        name: "Debbie Tan",
        homepage: "https://www.linkedin.com/in/debbietyl",
    },
    {
        name: "Steffanie Relucio",
        homepage: "https://www.linkedin.com/in/steffanie-r/",
    },
    {
        name: "Elle Lum",
        homepage: "https://www.linkedin.com/in/elle-lum",
    },
    {
        name: "Jade Lim",
        homepage: "https://www.linkedin.com/in/uxwithjade/",
    },
    {
        name: "John Cave",
        homepage: "https://www.linkedin.com/in/johncaveishere/",
    },
    {
        name: "Walter Lim",
        homepage: "https://walt.online",
    },
    {
        name: "Anton Bennett",
        homepage: "https://www.linkedin.com/in/anton-bennett-098b20309/",
    },
    {
        name: "William Yang",
        homepage: "https://www.linkedin.com/in/william-yang629/",
    },
    {
        name: "Joel Mansor",
        homepage: "https://www.linkedin.com/in/joel-mansor-bb7654223/"
    },
    {
        name: "Mihir Ojas Rallapudi",
        homepage: "https://www.linkedin.com/in/mihir-ojas/"
    }
];