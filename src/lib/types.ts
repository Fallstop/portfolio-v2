export type Post = {
	title: string
	subtitle?: string
	slug: string
	postID: string
	description: string
	date: string
	summary: string
	path: string
	thumbnail: string
	highlight: boolean
	tags: string[]
	authors: string[]
	collaborators: string[]
}