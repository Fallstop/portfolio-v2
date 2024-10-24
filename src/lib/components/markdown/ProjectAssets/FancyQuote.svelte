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
    blockquote {
        margin-bottom: 0;
    }
    .author {
        padding-left: 4rem;
        font-weight: bold;
        font-style: italic;
        font-size: 0.9rem;
    }
    .quote-mark {
        font-weight: bold;

    }
</style>