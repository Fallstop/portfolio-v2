<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     * @property {import('svelte').Snippet} [author]
     */

    /** @type {Props} */
    let { children, author } = $props();
</script>

<blockquote>
    <span class="quote-mark">“</span>{@render children?.()}<span class="quote-mark">”</span>

</blockquote>
<div class="author">
    - {@render author?.()}
</div>
<style lang="scss">
    @use "../../../../variables.scss" as *;
    blockquote {
        margin-bottom: 0;
    }
    .author {
        padding-left: $space-lg;
        font-weight: $font-weight-bold;
        font-style: italic;
        font-size: $font-size-sm;
    }
    .quote-mark {
        font-weight: $font-weight-bold;
    }
</style>