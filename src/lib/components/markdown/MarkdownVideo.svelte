<script lang="ts">
    import { parseSettings } from "./parseMediaSettings";

    interface Props {
        alt?: string;
        [key: string]: any
    }

    let { alt = "", ...rest }: Props = $props();
    const parsed = $derived(parseSettings(alt));
</script>
<div class:center={parsed.classes.includes("center")}>
    <!-- svelte-ignore a11y_media_has_caption -->
    <video {...rest} controls class="{parsed.classes} border" aria-describedby={parsed.altText} title={parsed.altText}>
        Your browser does not support the video tag.
    </video>
</div>

<style lang="scss">
    @use "./mediaSizes.scss" as *;

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    video {
        @include media-sizes;
    }
</style>