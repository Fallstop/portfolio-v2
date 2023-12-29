import type { Post } from '$lib/types';
import { error } from '@sveltejs/kit';
export const prerender = true;

export async function load({ params }) {
    console.log(params.slug)
	try {
		const post = await import(`../../../projects/${params.slug}/${params.slug}.md`);

		return {
			content: post.default,
			meta: post.metadata as Post
		}
	} catch (e) {
		console.log(`Could not find ${params.slug}`, e)
		throw error(404, `Could not find ${params.slug}`)
	}
}
