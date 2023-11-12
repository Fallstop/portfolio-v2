import { getGithubStats } from "$lib/server/stats/github";
import type { Post } from "$lib/types";
import type { PageServerLoadEvent } from "./$types";

export async function load({fetch}: PageServerLoadEvent) {
	const response = await fetch('/api/projects.json')
	const posts: Post[] = await response.json()

	return {
		github: getGithubStats(),
		postsHighlighted: posts.filter((post) => post.highlight),
	};
}

