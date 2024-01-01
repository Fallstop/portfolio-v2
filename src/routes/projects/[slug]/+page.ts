import { getProjects } from '$lib/cms/loadProjects';
import type { Post } from '$lib/types';
import { error } from '@sveltejs/kit';
export const prerender = true;

export async function load({ params }) {
    console.log(params.slug, "test")
	try {
		const projects = await getProjects();
		const project = projects.find((project) => project.postID.toLowerCase() === params.slug.toLowerCase());

		if (!project) {
			console.log(`Could not find ${params.slug}`,projects)
			throw error(404, `Could not find ${params.slug}`)
		}


		const post = await import(`../../../projects/${project.postID}/${project.postID}.md`);

		return {
			content: post.default,
			meta: post.metadata as Post
		}
	} catch (e) {
		console.log(`Could not find ${params.slug}`, e)
		throw error(404, `Could not find ${params.slug}`)
	}
}
