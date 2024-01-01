import { getProjects } from "$lib/cms/loadProjects";

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
    console.log("testr")
    const projects = await getProjects();
    console.log("What",projects)

	return projects.map((x)=>({slug: x.slug}))
}
