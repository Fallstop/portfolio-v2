<script lang="ts">
    import YoutubeFacade from "$lib/components/utilities/YoutubeFacade.svelte";

    interface Props {
        videoID: string;
        shortMode?: boolean;
        rounded?: boolean;
    }

    let { videoID, shortMode = false, rounded = true }: Props = $props();
</script>

<YoutubeFacade videoId={videoID} {shortMode} {rounded} />

<style lang="scss">
    .youtubeWrapper {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;

        &.shortMode {
            width: min-content;
            height: 5rem;
            padding-right: 50%;
        }
    }
</style>
