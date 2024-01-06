import type { Post } from '$lib/types';
import DefaultThumbnail from "/src/projects/default-thumbnail.webp";


function generateSummary(content: string): string {
    return content
}

export async function getProjects() {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/projects/**/*.md', { eager: true });
	const thumbnailPaths = import.meta.glob('/src/projects/**/thumbnail.webp', {
		 eager: true,
		 import: 'default',
		 query: {
			"normal": true,
			"url": true
			}
		});

	for (const path in paths) {
		const file: any = paths[path]
		const projectID = path.split('/').at(-1)?.replace('.md', '');

        if (!projectID) throw new Error(`Could not find projectID for ${path}`);

		const slug = `/projects/${projectID}`;

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>

			// Get the thumbnail
			let thumbnail = DefaultThumbnail;
			for (const thumbnailPath in thumbnailPaths) {
				if (thumbnailPath.includes(slug)) {
					thumbnail = `/api/projects/${projectID}/thumbnail.webp`;
					break;
				}
			}
		
			const post = { ...metadata, postID: projectID, highlight: metadata.highlight || false, thumbnail, slug, path, summary: generateSummary(file.content)} satisfies Post
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


export {DefaultThumbnail}