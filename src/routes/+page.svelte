<script lang="ts">
    import Name from "$lib/assets/svg/Name.svelte"
    import FluidCanvas from "$lib/components/fluidSim/FluidCanvas.svelte";

    let actions = { randomSplats: () => {}, captureScreenShot: () => {} };
    let fluidFPS: number = 1;
</script>
<!-- <h1 class="name-title">{fluidFPS?.toPrecision(3)}</h1> -->
<div class="name-title" title="Jasper M-W">
    <Name/>
    <FluidCanvas bind:actions bind:FPS={fluidFPS}/>

</div>
<div class="fps-counter">{Math.round(fluidFPS).toString().padStart(3,"0")} FPS</div>
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

        @media screen and (max-width: $tablet-breakpoint) {
            width: 100%;
            padding: 2rem 2rem 0 2rem;
        }

    }
    .fps-counter {
        position: absolute;
        top: 0;
        right: 0;
        color: white;
        font-size: 2rem;
        padding: 0.5rem;
        background-color: rgba(0,0,0,0.5);
        @include mono-font;
        @media screen and (max-width: $mobile-breakpoint) {
            font-size: 1rem;
            padding: 0.2rem
        }
    }

</style>