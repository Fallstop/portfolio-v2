import type { Post } from '$lib/types';
import { json } from '@sveltejs/kit'

function generateSummary(content: string): string {
    return content
}

async function getProjects() {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/projects/**/*.md', { eager: true });

	for (const path in paths) {
		const file: any = paths[path]
		const slug = `/projects/${path.split('/').at(-1)?.replace('.md', '')}`
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post = { ...metadata, slug, path, summary: generateSummary(file.content)} satisfies Post
			posts.push(post)
		} else if (!('metadata' in file)) {
            console.log("WARNING: No metadata found in", path)
        }
	}

	posts = posts.sort((first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	// Check the folder name is the same as the slug
	for (const post of posts) {
		let folderName = post.path.split('/').at(-2);
		let fileName = post.path.split('/').at(-1)?.replace('.md', '');
		if (folderName !== fileName) {
			console.log(`WARNING: Slug ${fileName} does not match folder name ${folderName}`)
		}
	}

	return posts
}

export async function GET() {
	const projects = await getProjects()
	return json(projects)
}
