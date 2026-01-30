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
        padding: $space-smd;
        margin: $space-sm 0;
        border-radius: $border-radius;

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
            font-size: $font-size-md;
            font-weight: $font-weight-bold;
            margin-bottom: $space-xs;
        }
    }
</style>