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
	hideTopTeam?: boolean
}
/** Output of an image imported with `?responsive` (see vitePlugins/responsiveImages.ts).
 * SVGs use the same shape with an empty srcset, since they scale themselves */
export type ResponsiveImage = {
	/** Largest AVIF thumbnail */
	src: string
	srcset: string
	width: number
	height: number
	/** Tiny inline WebP data URI, shown while the thumbnail loads. Absent for transparent images */
	placeholder?: string
	/** Lightbox-sized WebP */
	full: { src: string, width: number, height: number }
}

/** Output of a PDF imported with `?pdf` (see vitePlugins/pdfEmbed.ts) */
export type PdfEmbed = {
	url: string
	/** First page, rendered at build time */
	preview: ResponsiveImage
	pages: number
	/** Original file name */
	name: string
}
