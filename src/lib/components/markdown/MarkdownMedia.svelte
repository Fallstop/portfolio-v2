<script lang="ts">
    import MarkdownGallery from "./MarkdownGallery.svelte";
    import MarkdownImage from "./MarkdownImage.svelte";
    import MarkdownPdfPreview from "./MarkdownPDFPreview.svelte";
    import MarkdownVideo from "./MarkdownVideo.svelte";    

    interface Props {
        src: any;
        alt: any;
        [key: string]: any
    }

    let { src, alt, ...rest }: Props = $props();

    let type: "image" | "video" | "gallery" | "pdf" = $state("image");
    if (Array.isArray(src)) {
        type = "image"
    } else if (typeof src === "object") {
        type = "gallery";
    } else {
        let extension = src?.split('.').pop()?.toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(extension ?? "")) {
            type = "video";
        }
        if (['pdf'].includes(extension ?? "")) {
            type = "pdf";
        }
    }
</script>
{#if type=="gallery"}
    <MarkdownGallery {src} {alt} {...rest}/>
{:else if type=="video"}
    <MarkdownVideo {src} {alt} {...rest}/>
{:else if type=="image"}
    <MarkdownImage {src} {alt} {...rest} />
{:else if type=="pdf"}
    <MarkdownPdfPreview pdf_url={src} file_name={alt} {...rest} /> 
{/if}