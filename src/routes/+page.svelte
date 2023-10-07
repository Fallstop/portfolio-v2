<script lang="ts">
    import Name from "$lib/assets/svg/Name.svelte"
</script>
<!-- <h1 class="name-title">Jasper M-W</h1> -->
<div class="name-title" title="Jasper M-W">
    <Name/>

</div>
<style lang="scss">
    @use "../variables.scss" as *;
    .name-title {
        box-sizing: border-box;
        padding: 0;
        line-height: 1;
        // background: linear-gradient(-45deg, $primary-color, $tint-color, $secondary-color, $accent-color);
        // background-size: cover;
        // -webkit-background-clip: text;
        // background-clip: text;
        // -webkit-text-fill-color: transparent;
        // clip-path: url(#nameWow);

        :global(svg) {
            width: 100%;
        }
        width: 110%;
        height: 100%;

    }

</style>