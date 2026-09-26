<script lang="ts">
    import MarkdownImage from "./MarkdownImage.svelte";

    import type { ResponsiveImage } from "$lib/types";
    import { parseSettings } from "./parseMediaSettings";

    interface Props {
        /** Glob import of the gallery folder, see vitePlugins/galleryTemplate.txt */
        src?: Record<string, ResponsiveImage | string>;
        alt?: string;
    }

    let { src = {}, alt = "" }: Props = $props();
    const classes = $derived(parseSettings(alt).classes);

    // Target row height in px; must match --row-height below
    const rowHeight = $derived(classes.includes("full") ? 320 : classes.includes("small") ? 140 : 220);

    // Anything unprocessed (e.g. an SVG that couldn't be measured) is treated as square
    let images = $derived(Object.values(src).map((image) => ({
        image,
        aspect: typeof image === "string" ? 1 : image.width / image.height,
    })));
</script>

<div
    class:center-outer={classes.includes("center")}
    class="image-gallery-container"
>
    <div class="image-gallery {classes}">
        {#each images as { image, aspect }}
            <div class="tile" style:--aspect={aspect}>
                <MarkdownImage
                    src={image}
                    alt=":none"
                    inGallery
                    sizes={`min(100vw, ${Math.round(rowHeight * aspect * 1.5)}px)`}
                />
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .center-outer {
        display: flex;
        justify-content: center;
    }

    // Justified rows: every tile starts at the target row height and grows in proportion
    // to its aspect ratio, so each row fills the width while images keep their shape
    .image-gallery {
        --row-height: 220px;

        display: flex;
        flex-wrap: wrap;
        gap: $space-sm;
        margin-bottom: $space-sm;

        // Stops the last row stretching to fill the width
        &::after {
            content: "";
            flex-grow: 1000000;
        }

        &.full {
            --row-height: 320px;
        }
        &.small {
            --row-height: 140px;
        }
        @media screen and (max-width: $mobile-breakpoint) {
            --row-height: 160px;

            &.small {
                --row-height: 100px;
            }
        }

        .tile {
            flex-grow: calc(var(--aspect) * 100);
            flex-basis: calc(var(--row-height) * var(--aspect));
            aspect-ratio: var(--aspect);
            max-height: calc(var(--row-height) * 1.5);
            overflow: hidden;
            border-radius: $border-radius;

            & > :global(a) {
                display: block;
                height: 100%;
            }

            :global(img) {
                display: block;
                height: 100%;
                width: 100%;
                object-fit: cover;
                transition: transform $transition-base;

                &:hover {
                    transform: scale(1.04);
                }
            }
        }
    }
</style>
