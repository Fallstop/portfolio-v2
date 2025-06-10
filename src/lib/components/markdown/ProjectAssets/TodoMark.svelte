<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<blockquote>
    <span class="todo-mark">TODO:</span> {@render children?.()}

</blockquote>
<style lang="scss">
    blockquote {
        background: rgba(255, 0, 0, 0.192);
        margin-bottom: 0;
        .todo-mark {
            font-weight: bolder;
        font-style: normal;
        }

        font-style: italic;
    }
</style>