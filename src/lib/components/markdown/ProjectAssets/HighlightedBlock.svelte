<script lang="ts">
    export let style: "info" | "warning" | "danger" = "info";
</script>

<div class="container {style}-style">
    <header><slot name="header"></slot></header>
    <div class="content"><slot/></div>
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