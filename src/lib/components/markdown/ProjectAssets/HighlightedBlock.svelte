<script lang="ts">
    interface Props {
        style?: "info" | "warning" | "danger";
        header?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let { style = "info", header, children }: Props = $props();
</script>

<div class="container {style}-style">
    <header>{@render header?.()}</header>
    <div class="content">{@render children?.()}</div>
</div>

<style lang="scss" >
    @use "../../../../variables.scss" as *;
    .container {
        padding: 1.5rem;

        &.info-style {
            background-color: $info-color;
        }

        &.warning-style {
            background-color: $warning-color;
        }

        &.danger-style {
            background-color: $danger-color;
        }

        header {
            font-size: 1.2rem;
            font-weight: bold;
        }
    }
</style>