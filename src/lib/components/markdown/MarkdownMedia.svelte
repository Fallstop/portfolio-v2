<script lang="ts">
    import MarkdownImage from "./MarkdownImage.svelte";
    import MarkdownVideo from "./MarkdownVideo.svelte";

    export let src: string;
    let extension = src.split('.').pop()?.toLowerCase();
    let isVideo = ['mp4', 'webm', 'ogg'].includes(extension ?? "");
</script>
{#if isVideo}
    <MarkdownVideo {...$$props}/>
{:else}
    <MarkdownImage {...$$props}/>
{/if}