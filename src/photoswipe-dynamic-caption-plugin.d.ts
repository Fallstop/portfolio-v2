declare module "photoswipe-dynamic-caption-plugin" {
	import type PhotoSwipeLightbox from "photoswipe/lightbox";
	import type { Slide } from "photoswipe";

	export default class PhotoSwipeDynamicCaption {
		constructor(lightbox: PhotoSwipeLightbox, options?: {
			type?: "auto" | "below" | "aside";
			captionContent?: string | ((slide: Slide) => string);
			mobileLayoutBreakpoint?: number | ((this: PhotoSwipeDynamicCaption) => boolean);
			horizontalEdgeThreshold?: number;
			mobileCaptionOverlapRatio?: number;
			verticallyCenterImage?: boolean;
		});
	}
}
