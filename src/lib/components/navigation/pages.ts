import { Code2, User, Sword, Mail, Home } from "lucide-svelte";

// <NavigationButton
// pageSlug="/projects"
// title="Projects"
// icon={Code2}
// primary
// />
// <NavigationButton pageSlug="/about" title="About" icon={User} />
// <NavigationButton pageSlug="/skills" title="Skills" icon={Sword} />
// <NavigationButton pageSlug="/contact" title="Contact" icon={Mail} />

interface AvailablePage {
    pageSlug: PageSlug;
    title: string;
    icon: any;   
    primary: boolean;
}

export type PageSlug = "/projects" | "/about" | "/resume" | "/contact" | "/";

export const promotedPage: AvailablePage = {
    pageSlug: "/projects",
    title: "Projects",
    icon: Code2,
    primary: true
}

export const homePage: AvailablePage = {
    pageSlug: "/",
    title: "Home",
    icon: Home,
    primary: true
}

export const pages: AvailablePage[] = [
    promotedPage,
    {
        pageSlug: "/about",
        title: "About",
        icon: User,
        primary: false
    },
    {
        pageSlug: "/resume",
        title: "Resume",
        icon: Sword,
        primary: false
    },
    {
        pageSlug: "/contact",
        title: "Contact",
        icon: Mail,
        primary: false
    }
];