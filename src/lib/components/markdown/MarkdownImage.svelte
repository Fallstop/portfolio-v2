<script lang="ts">
    import type { ResponsiveImage } from "$lib/types";

    import { parseSettings } from "./parseMediaSettings";

    interface Props {
        src: ResponsiveImage | string;
        alt?: string;
        /** Overrides the `sizes` attribute, which is otherwise derived from the size class */
        sizes?: string;
        /** Part of a gallery, so the gallery's lightbox handles it rather than the page's */
        inGallery?: boolean;
        [key: string]: any
    }

    let {
        src,
        alt = "",
        sizes,
        inGallery = false,
        ...rest
    }: Props = $props();

    // Approximate rendered width for each size class (see mediaSizes.scss),
    // with the prose column topping out around 850px on desktop
    const sizesByClass: Record<string, string> = {
        small: "(min-width: 1200px) 215px, 50vw",
        medium: "(min-width: 1200px) 425px, 75vw",
        large: "(min-width: 1200px) 640px, 100vw",
    };

    let image = $derived(typeof src === "string" ? undefined : src);
    let rawLink = $derived(typeof src === "string" ? src : undefined);

    const parsedSettings = $derived(parseSettings(alt));
    const classes = $derived(parsedSettings.classes);
    const altText = $derived(parsedSettings.altText);

    const resolvedSizes = $derived(
        sizes ?? Object.entries(sizesByClass).find(([c]) => classes.includes(c))?.[1] ?? "(min-width: 1200px) 850px, 100vw"
    );
</script>


{#if rawLink && /^https?:/.test(rawLink)}
    <!-- External images (e.g. badges) are usually wrapped in their own markdown link -->
    <img {...rest} src={rawLink} class={classes} alt={altText} title={altText} loading="lazy" />
{:else}
<a
    href={image?.full.src ?? rawLink}
    data-pswp-width={image?.full.width}
    data-pswp-height={image?.full.height}
    data-lightbox-single={inGallery ? undefined : ""}
    target="_blank"
    class:center={classes.includes("center")}
>
    {#if classes.includes("text")}
        <span class="text">{altText}</span>
    {:else if image}
        <img
            {...rest}
            src={image.src}
            srcset={image.srcset || undefined}
            sizes={image.srcset ? resolvedSizes : undefined}
            width={image.width}
            height={image.height}
            style:background-image={image.placeholder ? `url(${image.placeholder})` : undefined}
            class={classes}
            alt={altText}
            title={altText}
            loading="lazy"
            decoding="async"
        />
    {:else}
        <img {...rest} src={rawLink} class={classes} alt={altText} title={altText} loading="lazy" />
    {/if}
</a>
{/if}

<style lang="scss">
    @use "./mediaSizes.scss" as *;

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    img {
        @include media-sizes;
        background-size: cover;
        background-position: center;
    }
</style>
