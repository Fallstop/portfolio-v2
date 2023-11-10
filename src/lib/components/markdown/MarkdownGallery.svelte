<script lang="ts">
    import { onMount } from "svelte";
    import MarkdownImage from "./MarkdownImage.svelte";

    import {
        Lightbox,
        LightboxGallery,
        GalleryThumbnail,
        GalleryImage,
    } from "svelte-lightbox";
    import type { ProcessedImageMetadata } from "imagetools-core";
    import { parseSettings } from "./parseMediaSettings";

    export let src: object = {};
    export let alt = "";
    const { size, altText } = parseSettings(alt);

    let imagesData: [ProcessedImageMetadata, ProcessedImageMetadata][];
    $: imagesData = Object.values(src).map((x) => x.default);

    interface ImageMetadata {
        id: number;
        small: ProcessedImageMetadata;
        large: ProcessedImageMetadata;

    }

    let galleryData: ImageMetadata[];
    $: galleryData = imagesData.map((x, i) => ({
        id: i,
        small: x[0],
        large: x[1],
    }));

    let activeImage: number;
    function getImageMeta(imageID: number | undefined, galleryData: ImageMetadata[]): ProcessedImageMetadata {
        if (activeImage === undefined) return galleryData[0].large;
        const { width, height } = galleryData[activeImage].large;
        return galleryData[activeImage].large;
    }

    $: ({ width: activeImageWidth, height: activeImageHeight} = getImageMeta(activeImage, galleryData));
</script>
<div >

<LightboxGallery
    arrowsConfig={{ color: "#fff", enableKeyboardControl: true, character: "hide" }}
    bind:activeImage
    imagePreset="fullscreen"
    >

    <!-- customization={{ lightboxProps: {
        class: "__customLightbox",
        style: `--active-image-height: ${activeImageHeight}px; --active-image-width: ${activeImageWidth}px;`
    } }} -->

    <div class="image-gallery {size}" slot="thumbnail">
        {#each galleryData as imageMetadata}
            {@const { id, small, large } = imageMetadata}
            <GalleryThumbnail {id}>
                <MarkdownImage
                    width={small.width}
                    height={small.height}
                    src={small.src}
                    alt=":none"
                />
            </GalleryThumbnail>
            <!-- <div class="image">
                </div> -->
        {/each}
    </div>

    {#each galleryData as imageMetadata}
        {@const { id, small, large } = imageMetadata}
        <GalleryImage {id}>
            <MarkdownImage
                width={large.width}
                height={large.height}
                src={large.src}
                alt=":raw"
            />
        </GalleryImage>
    {/each}
</LightboxGallery>
</div>

<style lang="scss">
    .image-gallery {
        $grid-gap: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: $grid-gap;
        margin-bottom: $grid-gap;
        position: relative;
        & > :global(div) {
            flex: 1 1 auto;
            position: relative;
            height: 300px;
            & > :global(img) {
                height: 100%;
                width: 100%;
                vertical-align: middle;
            }
        }
        &.full {
            & > :global(div) {
                $row-size: 3;
                // flex: 1 1 100%;
                max-width: 100%;
                height: unset;
                max-width: calc(
                    ($max-blog-space-available - (($row-size - 1) * $grid-gap)) /
                        $row-size
                );
            }
        }


        &::after {
            content: "";
            flex-grow: 999;
        }
    }

    // :global(.__customLightbox > .svelte-lightbox-body) {
    //     // Max height is 80vh
    //     --height-ratio: calc( var(--active-image-height) / min(var(--active-image-height), 80vh));
    //     height: var(--active-image-height) !important;
    //     width: calc(var(--active-image-width) * var(--height-ratio)) !important;
    // }
</style>
