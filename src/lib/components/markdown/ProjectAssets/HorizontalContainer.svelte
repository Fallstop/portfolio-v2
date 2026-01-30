<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<div class="horizontal-container">
    {@render children?.()}
</div>

<style lang="scss">
    @use "../../../../variables.scss" as *;
    .horizontal-container {
        display: flex;
        flex-direction: row;
        gap: $space-sm;
        margin-bottom: $space-sm;
    }
</style>