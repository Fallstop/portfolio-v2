import { getProjects } from "$lib/cms/loadProjects";

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
    const projects = await getProjects();

	return projects.map((x)=>({projectID: x.postID}))
}
