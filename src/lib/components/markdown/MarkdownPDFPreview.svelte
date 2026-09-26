<script lang="ts">
    import type { PDFSlick } from "@pdfslick/core";
    import { onDestroy } from "svelte";

    import LiveCard from "../utilities/LiveCard.svelte";
    import { SquareArrowOutUpRight } from "@lucide/svelte";
    import type { PdfEmbed } from "$lib/types";

    interface Props {
        pdf: PdfEmbed | string;
        file_name?: string;
    }

    let { pdf, file_name }: Props = $props();

    const pdfURL = $derived(typeof pdf === "string" ? pdf : pdf.url);
    const preview = $derived(typeof pdf === "string" ? undefined : pdf.preview);
    const displayName = $derived(
        file_name ?? (typeof pdf === "string" ? decodeURIComponent(pdf.split("/").pop() ?? "document.pdf") : pdf.name)
    );

    let previewContainer: HTMLDivElement | undefined = $state();
    let container: HTMLDivElement | undefined = $state();

    let pdfSlick: PDFSlick | undefined;
    let viewerReady = $state(false);
    let unsubscribe: (() => void) | undefined;

    async function loadViewer() {
        // pdf.js is ~600KB, so it's only fetched once the preview is near the viewport
        const [{ create, PDFSlick }, { GlobalWorkerOptions }, { default: workerSrc }] = await Promise.all([
            import("@pdfslick/core"),
            import("pdfjs-dist"),
            import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
            import("@pdfslick/core/dist/pdf_viewer.css"),
        ]);
        // pdfslick bundles its own worker, which can drift from the installed pdf.js API version
        GlobalWorkerOptions.workerSrc = workerSrc;

        if (container === undefined) return;

        const store = create();
        pdfSlick = new PDFSlick({
            container,
            store,
            options: {
                scaleValue: "page-width",
            },
            // Leaves the preview image in place, with the "Open PDF" link still available
            onError: (err) => console.error(`Failed to load ${displayName}`, err),
        });

        pdfSlick.loadDocument(pdfURL);
        store.setState({ pdfSlick });

        unsubscribe = store.subscribe((s) => {
            if (s.numPages > 0) viewerReady = true;
        });
    }

    $effect(() => {
        if (!previewContainer) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                observer.disconnect();
                loadViewer();
            }
        }, { rootMargin: "400px" });
        observer.observe(previewContainer);

        return () => observer.disconnect();
    });

    onDestroy(() => {
        unsubscribe?.();
        pdfSlick?.document?.loadingTask.destroy();
    });
</script>

<div class="pdf-preview-container">
    <div class="top-bar">
        <div class="file_name">
            {displayName}
            {#if typeof pdf !== "string"}
                <span class="pages">· {pdf.pages} {pdf.pages === 1 ? "page" : "pages"}</span>
            {/if}
        </div>
        <LiveCard type="link" href={pdfURL} size="small" target="_blank">
            Open PDF <SquareArrowOutUpRight />
        </LiveCard>
    </div>
    <div class="pdf-preview pdfSlick" bind:this={previewContainer}>
        {#if preview && !viewerReady}
            <div class="first-page">
                <img
                    src={preview.src}
                    srcset={preview.srcset}
                    sizes="(min-width: 1200px) 850px, 100vw"
                    width={preview.width}
                    height={preview.height}
                    alt="First page of {displayName}"
                    loading="lazy"
                    decoding="async"
                />
            </div>
        {/if}
        <!-- PDF Slick renders into this container once loaded -->
        <div
            id="viewerContainer"
            class="pdfSlickContainer"
            class:hidden={!viewerReady && preview}
            bind:this={container}
        >
            <div id="viewer" class="pdfSlickViewer pdfViewer"></div>
        </div>
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

                .pages {
                    opacity: 0.7;
                }
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

        // Mirrors the pdf.js page-width layout, so the swap to the live viewer doesn't jump
        .first-page {
            position: absolute;
            inset: 0;
            overflow: hidden;
            padding: 9px;

            img {
                display: block;
                width: 100%;
                height: auto;
                box-shadow: 0 0 $space-sm $overlay-medium;
            }
        }

        .pdfSlickContainer#viewerContainer {
            position: absolute;
            inset: 0;
            overflow: scroll;

            &.hidden {
                visibility: hidden;
            }

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
