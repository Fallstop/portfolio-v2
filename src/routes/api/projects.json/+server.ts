import { getProjects } from '$lib/cms/loadProjects'
import { json } from '@sveltejs/kit'

export async function GET() {
	const projects = await getProjects()
	return json(projects)
}
