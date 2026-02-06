<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import MarkdownImage from "./MarkdownImage.svelte";

    import type { ProcessedImageMetadata } from "imagetools-core";
    import { parseSettings } from "./parseMediaSettings";
    import { randomHash } from "$lib/utilities/math";

    interface Props {
        src?: any;
        alt?: string;
    }

    let { src = {}, alt = "" }: Props = $props();
    const parsed = $derived(parseSettings(alt));
    const classes = $derived(parsed.classes);
    const altText = $derived(parsed.altText);

    let imagesData: [ProcessedImageMetadata, ProcessedImageMetadata][] =
        $derived(Object.values(src).map((x: any) => x.default));

    let sharedKey = randomHash();
</script>

<div
    class:center-outer={classes.includes("center")}
    class="image-gallery-container"
>
    <div class="image-gallery {classes}">
        {#each imagesData as imageMetadata}
            <MarkdownImage src={imageMetadata} alt=":none" {sharedKey} />
        {/each}
    </div>
</div>

<style lang="scss">
    .center-outer {
        display: flex;
        justify-content: center;
    }

    .image-gallery {
        display: grid;
        gap: $space-sm;
        margin-bottom: $space-sm;
        position: relative;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

        & > :global(a) {
            position: relative;
            height: 300px;
            border-radius: $border-radius;

            & > :global(img) {
                height: 100%;
                width: 100%;
                object-fit: cover;
                vertical-align: middle;
                transition: all $transition-base;
                transform: scale(1);
                &:hover {
                    transform: scale(1.04);
                }
            }
        }
        &.full {
            @media screen and (min-width: $mobile-breakpoint) {
                grid-template-columns: repeat(3, 1fr);
            }
            & > :global(a) {
                height: auto;
                aspect-ratio: 16/9;
            }
        }
        &.small {
            @media screen and (min-width: $mobile-breakpoint) {
                grid-template-columns: repeat(5, 1fr);
            }
            & > :global(a) {
                height: auto;
                aspect-ratio: 1;
            }
        }
    }

    // :global(.__customLightbox > .svelte-lightbox-body) {
    //     // Max height is 80vh
    //     --height-ratio: calc( var(--active-image-height) / min(var(--active-image-height), 80vh));
    //     height: var(--active-image-height) !important;
    //     width: calc(var(--active-image-width) * var(--height-ratio)) !important;
    // }
</style>
