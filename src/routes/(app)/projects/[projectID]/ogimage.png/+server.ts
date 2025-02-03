import { getProjects } from "$lib/cms/loadProjects";
import { generateImage } from "$lib/server/ogimage";
import type { RequestEvent } from "@sveltejs/kit";

export const prerender = true;

export async function GET(request: RequestEvent): Promise<Response> {
    return await generateImage(request);    
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
    const projects = await getProjects();

	return projects.map((x)=>({projectID: x.postID}))
}
