<script lang="ts">
    import { parseSettings } from "./parseMediaSettings";
    export let src: string = "";
    export let alt = "";
    export let width: number | null = null;
    export let height: number | null = null;
    $: showBorder = !(src?.split(".")?.pop()?.toLowerCase().startsWith("svg"))

    const {size, altText} = parseSettings(alt);
</script>

<img {...$$restProps} class:border={showBorder} {src} {width} {height} class={size} alt={altText} title={altText} loading="lazy" />

<style lang="scss">
    @use "./mediaSizes.scss" as *;
    img {
        @include media-sizes;
    }
</style>
