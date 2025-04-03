<script lang="ts">
    import type { ProcessedImageMetadata } from "imagetools-core";

    import { parseSettings } from "./parseMediaSettings";

    interface Props {
        src: [ProcessedImageMetadata, ProcessedImageMetadata] | string;
        alt?: string;
        width?: number | null;
        height?: number | null;
        sharedKey?: string;
        [key: string]: any
    }

    let {
        src,
        alt = "",
        width = null,
        height = null,
        sharedKey = "",
        ...rest
    }: Props = $props();

    interface ImageMetadata {
        small: ProcessedImageMetadata;
        large: ProcessedImageMetadata;
    } 


    let galleryData: ImageMetadata | undefined = $derived(typeof src !== "string" ? {
        small: src[0],
        large: src[1],
    } : undefined);

    
    

    let rawLink = $derived(typeof src === "string" ? src : undefined);

    const {classes, altText} = parseSettings(alt);
</script>


<a href={galleryData?.large?.src ?? rawLink} data-fancybox={sharedKey} class:center={classes.includes("center")}>
    {#if classes.includes("text")}
        <span class="text">{altText}</span>
    {:else}
        <img {...rest} src={galleryData?.small?.src ?? rawLink} width={galleryData?.small?.width} height={galleryData?.small?.height} class={classes} alt={altText} title={altText} loading="lazy" />

    {/if}
</a>

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
    }
</style>
