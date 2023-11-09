<script lang="ts">
    import { parseSettings } from "./parseMediaSettings";

    export let alt = "";
    export let width: number | null = null;
    export let height: number | null = null;
    const {size, altText} = parseSettings(alt);
</script>

<img {...$$restProps} {width} {height} class={size} alt={altText} title={altText} loading="lazy" />

<style lang="scss">
    @use "./mediaSizes.scss" as *;
    img {
        @include media-sizes;
    }
</style>
