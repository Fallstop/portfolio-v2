<script lang="ts">
    import { browser } from "$app/environment";
    import { randomHash } from "$lib/utilities/math";
    import { onDestroy, onMount } from "svelte";

    export let pdf_url: string;
    export let file_name: string = pdf_url?.split("/")?.pop() || "file.pdf";

    let src = pdf_url.startsWith("http") || !browser ? pdf_url : (origin || "")+pdf_url;

    let div_id = randomHash();

    function setupPDF() {
        if (typeof AdobeDC === "undefined" || !browser) {
            console.log("AdobeDC not found");
            return;
        }
        console.log("Setting up adobe", src);
        
        var adobeDCView = new AdobeDC.View({
            clientId: "1dd95e9483214ea9adbc52622e7bed5f",
            divId: div_id,
        });
        adobeDCView.previewFile(
            {
                content: {
                    location: {
                        url: src,
                    },
                },
                metaData: { fileName: file_name},
            },
            { embedMode: "SIZED_CONTAINER" },
        );
    }

    onMount(() => {
        if (!browser) {
            return;
        }
        setupPDF();
        document.addEventListener("adobe_dc_view_sdk.ready", setupPDF);
    });

    onDestroy(() => {
        if (!browser) {
            return;
        }
        document.removeEventListener("adobe_dc_view_sdk.ready", setupPDF);
    });
</script>

<svelte:head>
    <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js"></script>
</svelte:head>
<div class="pdf-preview" id="{div_id}" style="height: 100vh; width: 100%;"></div>

<style>
    .pdf-preview {
        position: relative;
        width: 100%;

    }
</style>
