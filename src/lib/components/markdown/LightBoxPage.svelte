<script lang="ts">
    import PhotoSwipeLightbox from "photoswipe/lightbox";
    import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin";
    import "photoswipe/style.css";
    import "photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css";

    import { afterNavigate } from "$app/navigation";
    import { onDestroy } from "svelte";

    let lightboxes: PhotoSwipeLightbox[] = [];

    function escapeHTML(text: string) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function createLightbox(gallery: string, children: string) {
        const lightbox = new PhotoSwipeLightbox({
            gallery,
            children,
            pswpModule: () => import("photoswipe"),
            bgOpacity: 0.9,
        });

        // SVGs and other unprocessed images have no known size, so fall back to the rendered one
        lightbox.addFilter("itemData", (itemData) => {
            const img = itemData.element?.querySelector("img");
            if (img && !itemData.width) {
                itemData.width = img.naturalWidth || img.width;
                itemData.height = img.naturalHeight || img.height;
            }
            return itemData;
        });

        new PhotoSwipeDynamicCaption(lightbox, {
            type: "auto",
            captionContent: (slide) => escapeHTML(slide.data.element?.querySelector("img")?.alt ?? ""),
        });

        lightbox.init();
        return lightbox;
    }

    function destroyAll() {
        lightboxes.forEach((lightbox) => lightbox.destroy());
        lightboxes = [];
    }

    // PhotoSwipe binds to the elements present at init, so rebind whenever the page content changes
    afterNavigate(() => {
        destroyAll();
        lightboxes = [
            // Each gallery is its own group
            createLightbox(".image-gallery", "a"),
            // Standalone images in the article are grouped together
            createLightbox(".prose", "a[data-lightbox-single]"),
        ];
    });

    onDestroy(destroyAll);
</script>

<!-- Dummy component -->
