<script lang="ts">
    import { parseSettings } from "./parseMediaSettings";
    export let src: string = "";
    export let alt = "";
    export let width: number | null = null;
    export let height: number | null = null;

    const {classes, altText} = parseSettings(alt);
</script>

<img {...$$restProps} {src} {width} {height} class={classes} alt={altText} title={altText} loading="lazy" />

<style lang="scss">
    @use "./mediaSizes.scss" as *;
    img {
        @include media-sizes;
    }
</style>
