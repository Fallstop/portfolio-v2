<script lang="ts">
    import { parseSettings } from "./parseMediaSettings";

    export let alt = "";
    const {classes, altText} = parseSettings(alt);
</script>
<!-- svelte-ignore a11y-media-has-caption -->
<video {...$$restProps} controls class="{classes} border" aria-describedby={altText} title={altText}>
    Your browser does not support the video tag.
</video>

<style lang="scss">
    @use "./mediaSizes.scss" as *;
    video {
        @include media-sizes;
    }
</style>