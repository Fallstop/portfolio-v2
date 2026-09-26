import sharp, { type Metadata } from "sharp";
import type { Plugin } from "vite";
import { resolveConfigs, type ImageConfig, type OutputFormat, type ProcessedImage } from "vite-imagetools";
import type { ResponsiveImage } from "../src/lib/types.ts";

// Opt-in preset: `import x from "./photo.jpg?responsive"` (or `?responsive=gallery`).
// Produces AVIF thumbnails for inline display, a capped WebP for the lightbox,
// and a tiny inline placeholder. Imports without the query are untouched.

const PRESET_KEY = "responsive";

const THUMBNAIL_WIDTHS = {
    gallery: [480, 960],
    inline: [640, 1280, 1920],
};
const THUMBNAIL_QUALITY = "55";
// Default effort (4) is ~7x slower to encode for only ~8% smaller files
const THUMBNAIL_EFFORT = "2";

const LIGHTBOX_MAX_SIZE = 2560;
const LIGHTBOX_QUALITY = "82";

const PLACEHOLDER_WIDTH = 16;

export function responsiveDefaultDirectives() {
    return async function (url: URL, metadata: () => Promise<Metadata> | Metadata) {
        if (!url.searchParams.has(PRESET_KEY)) return new URLSearchParams();

        const preset = url.searchParams.get(PRESET_KEY) === "gallery" ? "gallery" : "inline";
        const { width = 0, height = 0, orientation = 1 } = await metadata();
        // EXIF orientations 5-8 are rotated 90°, so the displayed width is the stored height
        const intrinsicWidth = orientation >= 5 ? height : width;

        // Only keep widths smaller than the source, then add the source-capped maximum,
        // so small images don't produce several identical files
        const presetWidths = THUMBNAIL_WIDTHS[preset];
        const widths = presetWidths.filter((w) => w < intrinsicWidth);
        widths.push(Math.min(intrinsicWidth, presetWidths.at(-1)!));

        return new URLSearchParams({
            as: PRESET_KEY,
            thumbnailWidths: [...new Set(widths)].join(";"),
        });
    };
}

export function responsiveResolveConfigs() {
    return function (entries: Array<[string, string[]]>, outputFormats: Record<string, OutputFormat>): ImageConfig[] {
        const directives = Object.fromEntries(entries);
        if (directives.as?.[0] !== PRESET_KEY) return resolveConfigs(entries, outputFormats);

        const thumbnails = (directives.thumbnailWidths ?? []).map((w) => ({
            w,
            format: "avif",
            quality: THUMBNAIL_QUALITY,
            effort: THUMBNAIL_EFFORT,
        }));
        const lightbox = {
            w: String(LIGHTBOX_MAX_SIZE),
            h: String(LIGHTBOX_MAX_SIZE),
            fit: "inside",
            format: "webp",
            quality: LIGHTBOX_QUALITY,
        };
        return [...thumbnails, lightbox];
    };
}

const responsiveFormat: OutputFormat = () => async (metadatas: ProcessedImage[]): Promise<ResponsiveImage> => {
    const thumbnails = metadatas
        .filter((m) => m.transforms.format === "avif")
        .sort((a, b) => a.info.width - b.info.width);
    const lightbox = metadatas.find((m) => m.transforms.format === "webp") ?? thumbnails.at(-1)!;
    const largest = thumbnails.at(-1)!;

    // Transparent images would show the placeholder through their transparent areas
    const placeholder = largest.sharpMetadata.hasAlpha ? undefined : await thumbnails[0].image.clone()
        .resize(PLACEHOLDER_WIDTH)
        .webp({ quality: 40 })
        .toBuffer()
        .then((buffer) => `data:image/webp;base64,${buffer.toString("base64")}`);

    return {
        src: largest.src,
        srcset: thumbnails.map((m) => `${m.src} ${m.info.width}w`).join(", "),
        width: largest.info.width,
        height: largest.info.height,
        placeholder,
        full: {
            src: lightbox.src,
            width: lightbox.info.width,
            height: lightbox.info.height,
        },
    };
};

/**
 * SVGs aren't raster-processed, but still need their dimensions in the HTML so the browser
 * can reserve space before they load. `./diagram.svg?responsive` gives the same shape as a
 * raster ResponsiveImage, with the SVG itself as every size.
 */
export function responsiveSvgs(): Plugin {
    return {
        name: "responsive-svgs",
        enforce: "pre",
        async load(id) {
            const [path, query] = id.split("?", 2);
            if (!path.endsWith(".svg") || !new URLSearchParams(query).has(PRESET_KEY)) return null;

            this.addWatchFile(path);
            const urlImport = `import src from ${JSON.stringify(`${path}?url`)};`;
            try {
                const { width, height } = await sharp(path).metadata();
                if (!width || !height) throw new Error("no intrinsic size");
                return `${urlImport}
export default { src, srcset: "", width: ${width}, height: ${height}, full: { src, width: ${width}, height: ${height} } };`;
            } catch (err) {
                this.warn(`Couldn't read SVG dimensions for ${path}, it will cause layout shift: ${err}`);
                return `${urlImport}\nexport default src;`;
            }
        },
    };
}

export function responsiveOutputFormats() {
    return (builtins: Record<string, OutputFormat>) => ({ ...builtins, [PRESET_KEY]: responsiveFormat });
}
