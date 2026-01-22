<script lang="ts">
    import type { PDFSlick } from "@pdfslick/core";
    import { onMount, onDestroy } from "svelte";

    import "@pdfslick/core/dist/pdf_viewer.css";
    import LiveCard from "../utilities/LiveCard.svelte";
    import { SquareArrowOutUpRight } from "lucide-svelte";

    interface Props {
        pdf_url: string;
        file_name?: string;
    }

    let { pdf_url, file_name = decodeURIComponent(pdf_url?.split("/")?.pop() || `${pdf_url.length}.pdf`) }: Props = $props();

    let container: HTMLDivElement | undefined = $state();

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

        if (container === undefined) {
            throw new Error("PDF Container element is not defined");
        }

        pdfSlick = new PDFSlick({
            container,
            store,
            options: {
                scaleValue: "page-width",
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
                class="pdfSlickContainer"
                bind:this={container}
            >
                <div id="viewer" class="pdfSlickViewer pdfViewer"></div>
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
    @use "../../../variables.scss" as *;
    .pdf-preview-container {
        margin-top: $space-md;

        outline: black 1px solid;
        border-radius: $border-radius;
        overflow: hidden;
        background-color: rgba($primary-color,0.1);


        .top-bar {
            display: flex;
            justify-content: space-between;
            padding: $space-sm;
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
            box-shadow: 0 0 $space-sm $overlay-medium;
        }

        .pdfSlickContainer#viewerContainer {
            position: absolute;
            inset: 0;
            overflow: scroll;

            #viewer {
                display: flex;
                align-items: center;
                gap: $space-md;
                width: 100%;
                flex-direction: column;
            }

        }
    }
</style>
