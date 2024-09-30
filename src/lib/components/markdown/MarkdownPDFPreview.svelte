<script lang="ts">
    import { browser } from "$app/environment";
    import { randomHash } from "$lib/utilities/math";
    import { onDestroy, onMount } from "svelte";

    export let pdf_url: string;
    export let file_name: string = pdf_url?.split("/")?.pop() || `${pdf_url.length}.pdf`;

    // Must be consistent, but unique
    let div_id = `pdf_viewer_${file_name.replace(/[^a-zA-Z0-9]/g, '')}_id`;

    let adobeDCView: any = undefined;

    function setupPDF() {
        if (typeof AdobeDC === "undefined" || !browser) {
            console.log("AdobeDC not found");
            return;
        }
        let src = pdf_url.startsWith("http") || !browser ? pdf_url : (origin || "")+pdf_url;

        console.log("Setting up adobe", src);
        
        adobeDCView = new AdobeDC.View({
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
            { embedMode: "SIZED_CONTAINER", enableLinearization: true },
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
        if (typeof AdobeDC !== "undefined" && typeof adobeDCView !== "undefined" && browser) {
            console.log("AdobeDC found, unmounting");
            adobeDCView.unMountViewerNode();
        }

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
