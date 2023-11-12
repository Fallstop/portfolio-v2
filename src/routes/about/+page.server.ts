import { getGithubStats } from "$lib/server/stats/github";
import type { PageServerLoadEvent } from "./$types";

export async function load({ }: PageServerLoadEvent) {
	return {
		github: getGithubStats(),
	};
}

