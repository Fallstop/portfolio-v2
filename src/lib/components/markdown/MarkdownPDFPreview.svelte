<script lang="ts">
    import type { PDFSlick } from "@pdfslick/core";
    import { onMount, onDestroy } from "svelte";

    import "@pdfslick/core/dist/pdf_viewer.css";
    import LiveCard from "../LiveCard.svelte";
    import { SquareArrowOutUpRight } from "lucide-svelte";

    export let pdf_url: string;
    export let file_name: string =
        pdf_url?.split("/")?.pop() || `${pdf_url.length}.pdf`;

    let container: HTMLDivElement;

    /**
     * Reference to the pdfSlick instance
     */
    let pdfSlick: PDFSlick;

    /**
     * Keep PDF Slick state portions we're interested in using in your app
     */
    let pageNumber = 1;
    let numPages = 0;

    let unsubscribe: CallableFunction | undefined;

    onMount(async () => {
        /**
         * This is all happening on client side, so we'll make sure we only load it there
         */
        const { create, PDFSlick } = await import("@pdfslick/core");

        /**
         * Create the PDF Slick store
         */
        const store = create();

        pdfSlick = new PDFSlick({
            container,
            store,
            options: {
                scaleValue: "page-fit",
            },
        });

        /**
         * Load the PDF document
         */
        pdfSlick.loadDocument(pdf_url);
        store.setState({ pdfSlick });

        /**
         * Subscribe to state changes, and keep values of interest as reactive Svelte vars,
         * (or alternatively we could hook these or entire PDF state into a Svelte store)
         *
         * Also keep reference of the unsubscribe function we call on component destroy
         */
        unsubscribe = store.subscribe((s) => {
            pageNumber = s.pageNumber;
            numPages = s.numPages;
        });
    });

    onDestroy(() => unsubscribe && unsubscribe());
</script>

<div class="pdf-preview-container">
    <div class="top-bar">
        <div class="file_name">{file_name}</div>
        <LiveCard type="link" href={pdf_url} size="small" target="_blank">
            Open PDF <SquareArrowOutUpRight />
        </LiveCard>
    </div>
    <div class="pdf-preview pdfSlick">
        <div class="flex-1 relative h-full" id="container">
            <!--
                The important part —
                we use the reference to this `container` when creating PDF Slick instance above
                -->
            <div
                id="viewerContainer"
                class="pdfSlickContainer absolute inset-0"
                bind:this={container}
            >
                <div id="viewer" class="pdfSlickViewer pdfViewer" />
            </div>
        </div>

        <!-- ... -->

        <!-- Use `pdfSlick`, `pageNumber` and `numPages` to create PDF pagination -->
        <!-- <div class="flex justify-center">
            <button
            on:click={() => pdfSlick?.gotoPage(Math.max(pageNumber - 1, 1))}
            disabled={pageNumber <= 1}
            >
            Show Previous Page
            </button>
            <button
            on:click={() =>
            pdfSlick?.gotoPage(Math.min(pageNumber + 1, numPages))}
            disabled={pageNumber >= numPages}
            >
            Show Next Page
            </button>
            </div> -->
    </div>
</div>

<style lang="scss">
    // @use "";
    .pdf-preview-container {
        margin-top: 2rem;

        outline: black 1px solid;
        border-radius: $border-radius;
        overflow: hidden;
        background-color: rgba($primary-color,0.1);


        .top-bar {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            align-items: center;
            flex-wrap: wrap;

            .file_name {
                @include mono-font;
            }
        }
    }    
    .pdf-preview {
        position: relative;
        width: 100%;
        height: 40rem;
        border-radius: $border-radius;
        background-color: $background-color;



        :global(.page .canvasWrapper) {
            box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
        }

        // :global(.page) {
        //     position: relative;
        // }

        // :global(.textLayer) {
        //     position: absolute;
        //     top: 0;
        // }
        // :global(.textLayer > span) {
        //     position: absolute;
        // }

        .pdfSlickContainer#viewerContainer {

            #viewer {
                display: flex;
                align-items: center;
                gap: 2rem;
                width: 100%;
                flex-direction: column;
            }

        }
    }
</style>
