<script lang="ts">
    import MarkdownGallery from "./MarkdownGallery.svelte";
    import MarkdownImage from "./MarkdownImage.svelte";
    import MarkdownVideo from "./MarkdownVideo.svelte";    

    export let src: string | object;

    let type: "image" | "video" | "gallery" = "image";
    console.log("Markdown Media Import",src)
    if (typeof src === "object") {
        type = "gallery";
    } else {
        let extension = src?.split('.').pop()?.toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(extension ?? "")) {
            type = "video";
        }
    }
</script>
{#if type=="gallery"}
    <MarkdownGallery {...$$props}/>
{:else if type=="video"}
    <MarkdownVideo {...$$props}/>
{:else if type=="image"}
    <MarkdownImage {...$$props}/>
{/if}