import path, { basename, extname } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import {
    applyTransforms,
    builtins,
    builtinOutputFormats,
    extractEntries,
    generateTransforms,
    getMetadata,
    parseURL,
    urlFormat,
    resolveConfigs,
    type Logger,
    type OutputFormat,
    type ProcessedImageMetadata,
    type TransformFactory,
    type ImageConfig
} from 'imagetools-core'
import { createFilter, dataToEsm } from '@rollup/pluginutils'
import type { Metadata, Sharp } from 'sharp'
import { stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const defaultOptions: VitePluginOptions = {
    include: /^[^?]+\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)(\?.*)?$/,
    exclude: 'public/**/*',
    removeMetadata: true
}


export function imagetools(userOptions: Partial<VitePluginOptions> = {}): Plugin {
    const pluginOptions: VitePluginOptions = { ...defaultOptions, ...userOptions }

    const filter = createFilter(pluginOptions.include, pluginOptions.exclude)

    const transformFactories = pluginOptions.extendTransforms ? pluginOptions.extendTransforms(builtins) : builtins

    const outputFormats: Record<string, OutputFormat> = pluginOptions.extendOutputFormats
        ? pluginOptions.extendOutputFormats(builtinOutputFormats)
        : builtinOutputFormats

    let viteConfig: ResolvedConfig
    let basePath: string

    const generatedImages = new Map()

    return {
        name: 'imagetools',
        enforce: 'pre',
        configResolved(cfg) {
            viteConfig = cfg
            basePath = createBasePath(viteConfig.base)
        },
        async load(id) {
            if (!filter(id)) return null

            const srcURL = parseURL(id)

            // lazy loaders so that we can load the metadata in defaultDirectives if needed
            // but if there are no directives then we can just skip loading
            let lazyImg: Sharp
            const lazyLoadImage = () => {
                if (lazyImg) return lazyImg
                return (lazyImg = sharp(decodeURIComponent(srcURL.pathname)))
            }

            let lazyMetadata: Metadata
            const lazyLoadMetadata = async () => {
                if (lazyMetadata) return lazyMetadata
                return (lazyMetadata = await lazyLoadImage().metadata())
            }

            const defaultDirectives =
                typeof pluginOptions.defaultDirectives === 'function'
                    ? await pluginOptions.defaultDirectives(srcURL, lazyLoadMetadata)
                    : pluginOptions.defaultDirectives || new URLSearchParams()
            let directives = new URLSearchParams({
                ...Object.fromEntries(defaultDirectives),
                ...Object.fromEntries(srcURL.searchParams)
            })

            directives = pluginOptions.extendDirectives ? pluginOptions.extendDirectives(directives) : directives

            if (!directives.toString()) return null

            const img = lazyLoadImage()
            const widthParam = directives.get('w')
            const heightParam = directives.get('h')
            if (directives.get('allowUpscale') !== 'true' && (widthParam || heightParam)) {
                const metadata = await lazyLoadMetadata()
                const clamp = (s: string, intrinsic: number) =>
                    [...new Set(s.split(';').map((d): string => (parseInt(d) <= intrinsic ? d : intrinsic.toString())))].join(';')

                if (widthParam) {
                    const intrinsicWidth = metadata.width || 0
                    directives.set('w', clamp(widthParam, intrinsicWidth))
                }

                if (heightParam) {
                    const intrinsicHeight = metadata.height || 0
                    directives.set('h', clamp(heightParam, intrinsicHeight))
                }
            }

            const parameters = extractEntries(directives)
            const imageConfigs =
                pluginOptions.resolveConfigs?.(parameters, outputFormats) ?? resolveConfigs(parameters, outputFormats)

            const outputMetadatas: Array<ProcessedImageMetadata> = []

            const logger: Logger = {
                info: (msg) => viteConfig.logger.info(msg),
                warn: (msg) => this.warn(msg),
                error: (msg) => this.error(msg)
            }

            for (const config of imageConfigs) {
                const { transforms } = generateTransforms(config, transformFactories, srcURL.searchParams, logger)
                const { image, metadata } = await applyTransforms(transforms, img.clone(), pluginOptions.removeMetadata)

                if (viteConfig.command === 'serve') {
                    const id = await generateImageID(srcURL, config, image)
                    generatedImages.set(id, image)
                    metadata.src = basePath + id
                } else {
                    const fileHandle = this.emitFile({
                        name: basename(srcURL.pathname, extname(srcURL.pathname)) + `.${metadata.format}`,
                        source: await image.toBuffer(),
                        type: 'asset'
                    })

                    metadata.src = `__VITE_ASSET__${fileHandle}__`
                }

                metadata.image = image

                outputMetadatas.push(metadata as ProcessedImageMetadata)
            }

            let outputFormat = urlFormat()
            const asParam = directives.get('as')?.split(':')
            const as = asParam ? asParam[0] : undefined
            for (const [key, format] of Object.entries(outputFormats)) {
                if (as === key) {
                    
                    outputFormat = format(asParam && asParam[1] ? asParam[1].split(';') : undefined)
                    break
                }
            }


            const esmSettings = {
                namedExports: pluginOptions.namedExports ?? viteConfig.json?.namedExports ?? true,
                compact: !!viteConfig.build.minify,
                preferConst: true
            };

            const output = await outputFormat(outputMetadatas) as any[];

            return dataToEsm(output, esmSettings)
        },

        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.startsWith(basePath)) {
                    const [, id] = req.url.split(basePath)

                    const image = generatedImages.get(id)

                    if (!image)
                        throw new Error(`vite-imagetools cannot find image with id "${id}" this is likely an internal error`)

                    if (pluginOptions.removeMetadata === false) {
                        image.withMetadata()
                    }

                    res.setHeader('Content-Type', `image/${getMetadata(image, 'format')}`)
                    res.setHeader('Cache-Control', 'max-age=360000')
                    return image.clone().pipe(res)
                }

                next()
            })
        }
    }
}

export const createBasePath = (base?: string) => {
    return (base?.replace(/\/$/, '') || '') + '/@imagetools/'
}

export async function generateImageID(url: URL, config: ImageConfig, originalImage: Sharp) {
    if (url.host) {
        const baseURL = new URL(url.origin + url.pathname)
        const buffer = await originalImage.toBuffer()
        return hash([baseURL.href, JSON.stringify(config), buffer])
    }

    // baseURL isn't a valid URL, but just a string used for an identifier
    // use a relative path in the local case so that it's consistent across machines
    const baseURL = new URL(url.protocol + path.relative(process.cwd(), url.pathname))
    const { mtime } = await stat(path.resolve(process.cwd(), url.pathname))
    return hash([baseURL.href, JSON.stringify(config), mtime.getTime().toString()])
}

function hash(keyParts: Array<string | NodeJS.ArrayBufferView>) {
    let hash = createHash('sha1')
    for (const keyPart of keyParts) {
        hash = hash.update(keyPart)
    }
    return hash.digest('hex')
}

type MaybePromise<T> = T | Promise<T>

export type Include = Array<string | RegExp> | string | RegExp

export type Exclude = Array<string | RegExp> | string | RegExp

export type DefaultDirectives =
    | URLSearchParams
    | ((url: URL, metadata: () => MaybePromise<Metadata>) => MaybePromise<URLSearchParams>)

export type ExtendTransforms = (builtins: TransformFactory[]) => TransformFactory[]

export type ExtendOutputFormats = (builtins: Record<string, OutputFormat>) => Record<string, OutputFormat>

export type ResolveConfigs = typeof resolveConfigs

export interface VitePluginOptions {
    /**
     * Which paths to include when processing images.
     * @default '**\/*.\{heif,avif,jpeg,jpg,png,tiff,webp,gif\}?*'
     */
    include: Include
    /**
     * What paths to exclude when processing images.
     * This defaults to the public dir to mirror vites behavior.
     * @default 'public\/**\/*'
     */
    exclude: Exclude

    /**
     * This option allows you to specify directives that should be applied _by default_ to every image.
     * You can also provide a function, in which case the function gets passed the asset ID and should return an object of directives.
     * This can be used to define all sorts of shorthands or presets.
     *
     * @example
     * ```js
     * import { defineConfig } from 'vite'
     * import { imagetools } from 'vite-imagetools'
     *
     * export default defineConfig({
     *  plugins: [
     *    imagetools({
     *       defaultDirectives: (url) => {
     *        if (url.searchParams.has('spotify')) {
     *           return new URLSearchParams({
     *             tint: 'ffaa22'
     *           })
     *         }
     *         return new URLSearchParams()
     *       }
     *     })
     *    ]
     * })
     * ```
     */
    defaultDirectives?: DefaultDirectives

    /**
     * You can use this option to extend the builtin list of import transforms.
     * This list will be merged with the builtin transforms before applying them to the input image.
     * @default []
     */
    extendTransforms?: ExtendTransforms

    extendDirectives?: (directives: URLSearchParams) => URLSearchParams

    /**
     * You can use this option to extend the builtin list of output formats.
     * This list will be merged with the builtin output formats before determining the format to use.
     * @default []
     */
    extendOutputFormats?: ExtendOutputFormats

    /**
     * You can use this option to override the resolution of configs based on the url parameters
     * @default undefined
     */
    resolveConfigs?: ResolveConfigs

    /**
     * Whether to remove potentially private metadata from the image, such as exif tags etc.
     * @default true
     */
    removeMetadata: boolean

    /**
     * Whether to generate named exports.
     * Takes precedence over Vite's `json.namedExports`
     * @default undefined
     */
    namedExports?: boolean
}