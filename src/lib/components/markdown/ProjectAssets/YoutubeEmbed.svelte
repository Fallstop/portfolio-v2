<script lang="ts">
  import YoutubeFacade from "$lib/components/utilities/YoutubeFacade.svelte";

    interface Props {
        videoID: string;
        shortMode?: boolean;
    }

    let { videoID, shortMode = false }: Props = $props();
</script>


<YoutubeFacade
videoId={videoID}
shortMode={shortMode}
/>

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