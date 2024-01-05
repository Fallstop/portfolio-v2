
export function resolveThumbnailConfigs() {
    // we would like to reuse the existing directives as much as possible
    // const resizeTransform = resize({ w: config.customKeyword }, ctx)
    // const formatTransform = format({ format: 'webp' }, ctx)


    // return the transform function
    return function (config: Array<[string, string[]]>) {
        if (!config.find(([key]) => key === "thumbnail")) return undefined;

        // apply both transformations and return the result
        return [{
            "format": "webp",
            "quality": 60,
            "w": 800,
            "h": 800,
            "fit": "inside",
            "withoutEnlargement": true,
        }, {}]
    }

}

export function interceptDirectives() {
    return function (directives: URLSearchParams): URLSearchParams {
        if (!directives.has("thumbnail")) return directives;
        directives.append("as","metadata")
        return directives;
    }
}