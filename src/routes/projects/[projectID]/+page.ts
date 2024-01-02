import { getProjects } from '$lib/cms/loadProjects';
import type { Post } from '$lib/types';
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


		const post = await import(`../../../projects/${project.postID}/${project.postID}.md`);

		return {
			content: post.default,
			meta: post.metadata as Post
		}
	} catch (e) {
		console.log(`Could not find ${params.projectID}`, e)
		throw error(404, `Could not find ${params.projectID}`)
	}
}
