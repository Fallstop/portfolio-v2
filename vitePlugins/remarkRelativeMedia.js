// Turns relative media in markdown (`![alt](./photo.jpg)`, `![alt](./folder/)`) into imports,
// so Vite processes them. Raster images get the `?responsive` preset (see responsiveImages.ts),
// PDFs get a rendered preview (see pdfEmbed.ts);
// folders become galleries (see galleryImportTransform.ts); anything else imports as a URL.
// Based on mdsvex-relative-images, credit to pngwn:
// https://github.com/pngwn/MDsveX/discussions/246#discussioncomment-720947

import { visit } from "unist-util-visit";

const RE_SCRIPT_START =
    /<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/;
// SVGs get the preset too, which just adds their dimensions (see responsiveSvgs)
const RE_RASTER = /\.(avif|gif|heif|jpeg|jpg|png|tiff|webp|svg)$/i;
const RE_PDF = /\.pdf$/i;

export default function remarkRelativeMedia() {
    return function transformer(tree) {
        /** @type {Map<string, string>} import path -> identifier */
        const imports = new Map();
        /** Images that render as block elements (galleries, PDFs) */
        const blockImages = new Set();

        visit(tree, ["image", "definition"], (node) => {
            const url = decodeURIComponent(node.url);
            if (!url.startsWith(".")) return;

            // Link definitions (`[ref]: ./file.pdf`) need a plain URL, not processed media
            const isImage = node.type === "image";
            const importPath = isImage && RE_RASTER.test(url) ? `${url}?responsive`
                : isImage && RE_PDF.test(url) ? `${url}?pdf`
                : url;
            if (isImage && (url.endsWith("/") || RE_PDF.test(url))) {
                blockImages.add(node);
            }
            if (!imports.has(importPath)) {
                imports.set(importPath, `__media_${imports.size}`);
            }
            node.url = `{${imports.get(importPath)}}`;
        });

        if (imports.size === 0) return;

        // Block elements aren't valid inside the <p> markdown wraps images in, so split
        // paragraphs around galleries and PDFs, keeping any surrounding text in its own <p>
        visit(tree, "paragraph", (node, index, parent) => {
            if (!parent || index === undefined || !node.children.some((child) => blockImages.has(child))) return;

            const replacement = [];
            let inline = [];
            const flushInline = () => {
                if (inline.some((child) => child.type !== "text" || child.value.trim())) {
                    replacement.push({ type: "paragraph", children: inline });
                }
                inline = [];
            };
            for (const child of node.children) {
                if (blockImages.has(child)) {
                    flushInline();
                    replacement.push(child);
                } else {
                    inline.push(child);
                }
            }
            flushInline();

            parent.children.splice(index, 1, ...replacement);
            return index + replacement.length;
        });

        let scripts = "";
        for (const [path, id] of imports) {
            scripts += `import ${id} from ${JSON.stringify(path)};\n`;
        }

        let hasScript = false;
        visit(tree, "html", (node) => {
            if (!hasScript && RE_SCRIPT_START.test(node.value)) {
                hasScript = true;
                node.value = node.value.replace(RE_SCRIPT_START, (script) => `${script}\n${scripts}`);
            }
        });

        if (!hasScript) {
            tree.children.push({ type: "html", value: `<script>\n${scripts}</script>` });
        }
    };
}
