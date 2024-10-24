<script lang="ts">
    import { spring } from "svelte/motion";



    let mousePos = spring({x: 0, y: 0});
</script>
<svelte:window onmousemove={e => mousePos.set({x: e.clientX, y: e.clientY})}/>

<div class="mouse-follow" style="left: {$mousePos.x}px; top: {$mousePos.y}px"></div>

<style lang="scss">
    @use "../../../variables.scss" as *;

    .mouse-follow {
        position: fixed;
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        opacity: 0.2;
        background-color: $accent-color;
        mix-blend-mode: multiply;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
        will-change: transform;
        transition: transform 0.1s ease-out;
        z-index: -1;
        display: block;

        @media (hover: none) {
            display: none;
        }
    }
</style>