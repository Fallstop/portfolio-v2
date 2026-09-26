import { getProjects } from '$lib/cms/loadProjects'
import { json } from '@sveltejs/kit'

// Built from the markdown at build time; keeps every compiled post out of the Worker bundle
export const prerender = true

export async function GET() {
	const projects = await getProjects()
	return json(projects)
}
