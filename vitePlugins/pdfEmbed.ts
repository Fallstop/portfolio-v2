import { createHash } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizePath, type Plugin } from "vite";
import { createCanvas } from "@napi-rs/canvas";

// `import report from "./report.pdf?pdf"` gives a PdfEmbed (see src/lib/types.ts):
// the PDF's URL plus a first-page preview rendered at build time, which goes through
// the `?responsive` image preset so it's shown instantly while pdf.js lazy-loads.

const PDF_QUERY = /\.pdf\?pdf$/;
const PREVIEW_WIDTH = 1600;
const cacheDir = path.resolve("node_modules/.cache/pdf-previews");

async function renderFirstPage(pdfPath: string, outputPath: string) {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = getDocument({ data: new Uint8Array(await readFile(pdfPath)), verbosity: 0 });
    try {
        const doc = await loadingTask.promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: PREVIEW_WIDTH / page.getViewport({ scale: 1 }).width });
        const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
        // pdf.js expects DOM canvas types, which @napi-rs/canvas implements closely enough
        await page.render({ canvasContext: canvas.getContext("2d") as any, canvas: canvas as any, viewport }).promise;
        await writeFile(outputPath, await canvas.encode("png"));
        return doc.numPages;
    } finally {
        await loadingTask.destroy();
    }
}

export default function pdfEmbed(): Plugin {
    return {
        name: "pdf-embed",
        enforce: "pre",
        async load(id) {
            if (!PDF_QUERY.test(id)) return null;

            const pdfPath = id.slice(0, -"?pdf".length);
            this.addWatchFile(pdfPath);

            const hash = createHash("sha1").update(await readFile(pdfPath)).digest("hex");
            const previewPath = path.join(cacheDir, `${hash}.png`);
            const pagesPath = path.join(cacheDir, `${hash}.pages`);

            let pages: number;
            if (existsSync(previewPath) && existsSync(pagesPath)) {
                pages = Number(await readFile(pagesPath, "utf8"));
            } else {
                mkdirSync(cacheDir, { recursive: true });
                pages = await renderFirstPage(pdfPath, previewPath);
                await writeFile(pagesPath, String(pages));
            }

            return [
                `import url from ${JSON.stringify(`${pdfPath}?url`)};`,
                `import preview from ${JSON.stringify(`${normalizePath(previewPath)}?responsive`)};`,
                `export default { url, preview, pages: ${pages}, name: ${JSON.stringify(path.basename(pdfPath))} };`,
            ].join("\n");
        },
    };
}
