import { getProjects } from "$lib/cms/loadProjects";

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
    const projects = await getProjects();

	return projects.map((x)=>({projectID: x.postID}))
}

import { error } from '@sveltejs/kit';
export const prerender = true;

export async function load({ params }) {
    console.log(params.projectID, "test")
	try {
		const projects = await getProjects();
		const project = projects.find((project) => project.postID.toLowerCase() === params.projectID.toLowerCase());

		if (!project) {
			console.log(`Could not find ${params.projectID}`,projects)
			throw error(404, `Could not find ${params.projectID}`)
		}


		return {
			meta: project
		}
	} catch (e) {
		console.log(`Could not find ${params.projectID}`, e)
		throw error(404, `Could not find ${params.projectID}`)
	}
}