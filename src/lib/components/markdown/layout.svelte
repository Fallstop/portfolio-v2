<script lang="ts">
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<script module lang="ts">
    import MarkdownMedia from "./MarkdownMedia.svelte";
    import "./markdown.scss";
    import "./prism-nord.scss";


    export {MarkdownMedia as img};
</script>

{@render children?.()}