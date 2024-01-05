<script lang="ts">
    import { parseSettings } from "./parseMediaSettings";
    export let src: string = "";
    export let alt = "";
    export let width: number | null = null;
    export let height: number | null = null;

    export let sharedKey = "";
    export let fullSizeSrc = src;

    const {classes, altText} = parseSettings(alt);
</script>

<a href={fullSizeSrc} data-fancybox={sharedKey}>
    <img {...$$restProps} {src} {width} {height} class={classes} alt={altText} title={altText} loading="lazy" />
</a>

<style lang="scss">
    @use "./mediaSizes.scss" as *;
    img {
        @include media-sizes;
    }
</style>
