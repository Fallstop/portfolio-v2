<script lang="ts">
    import MarkdownGallery from "./MarkdownGallery.svelte";
    import MarkdownImage from "./MarkdownImage.svelte";
    import MarkdownVideo from "./MarkdownVideo.svelte";    

    export let src: any;

    let type: "image" | "video" | "gallery" = "image";
    console.log("Markdown Media Import",src)
    if (Array.isArray(src)) {
        console.log("imagggggggs",src)
        type = "image"
    } else if (typeof src === "object") {
        type = "gallery";
    } else {
        let extension = src?.split('.').pop()?.toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(extension ?? "")) {
            type = "video";
        }
    }
</script>
{#if type=="gallery"}
    <MarkdownGallery {src} {...$$restProps}/>
{:else if type=="video"}
    <MarkdownVideo {src} {...$$restProps}/>
{:else if type=="image"}
    <MarkdownImage {src} {...$$restProps} />
{/if}