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
