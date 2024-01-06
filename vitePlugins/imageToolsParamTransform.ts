
type ImageConfig = Array<[string, string[]]>;

export function resolveThumbnailConfigs() {
    // we would like to reuse the existing directives as much as possible
    // const resizeTransform = resize({ w: config.customKeyword }, ctx)
    // const formatTransform = format({ format: 'webp' }, ctx)


    // return the transform function
    return function (config: ImageConfig) {
        if (config.find(([key]) => key === "normal")) {
            return undefined
            
        }

        // Lower Res on gallery mode
        const galleryMode = config.find(([key]) => key === "gallery");

        // apply both transformations and return the result
        return [{
            "format": "webp",
            "quality": 60,
            "w": galleryMode ? 800 : 1920,
            "h": galleryMode ? 800 : 1920,
            "fit": "inside",
            "withoutEnlargement": true,
        }, {}]
    }

}

export function interceptDirectives() {
    return function (directives: URLSearchParams): URLSearchParams {
        if (!directives.has("normal"))  {
            directives.delete("url")
            directives.append("as","metadata")
        }
        return directives;
    }
}