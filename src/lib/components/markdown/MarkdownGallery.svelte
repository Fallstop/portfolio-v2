<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import MarkdownImage from "./MarkdownImage.svelte";


    import type { ProcessedImageMetadata } from "imagetools-core";
    import { parseSettings } from "./parseMediaSettings";
    import { randomHash } from "$lib/utilities/math";

    export let src: any = {};
    export let alt = "";
    const { classes, altText } = parseSettings(alt);

    let imagesData: [ProcessedImageMetadata, ProcessedImageMetadata][];
    $: imagesData = Object.values(src).map((x: any) => x.default);




    let sharedKey = randomHash();
</script>

<div>
    <div class="image-gallery {classes}">
        {#each imagesData as imageMetadata}
            <MarkdownImage
                src={imageMetadata}
                alt=":none"
                {sharedKey}
            />
        {/each}
    </div>
</div>

<style lang="scss">
    .image-gallery {
        $grid-gap: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: $grid-gap;
        margin-bottom: $grid-gap;
        position: relative;
        & > :global(a) {
            flex: 1 1 auto;
            position: relative;
            height: 300px;
            & > :global(img) {
                height: 100%;
                width: 100%;
                vertical-align: middle;
                transition: all 0.25s ease-in-out;
                transform: scale(1);
                &:hover {
                    transform: scale(1.04);
                }
            }
        }
        &.full {
            & > :global(a) {
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
