<script lang="ts">
    import { spring } from "svelte/motion";



    let mousePos = spring({x: 0, y: 0});
</script>
<svelte:window onmousemove={e => mousePos.set({x: e.clientX, y: e.clientY})}/>

<div class="mouse-follow" style="transform: translate(calc({$mousePos.x}px - 50%), calc({$mousePos.y}px - 50%))"></div>

<style lang="scss">
    @use "../../../variables.scss" as *;

    .mouse-follow {
        position: fixed;
        left: 0;
        top: 0;
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        opacity: 0.2;
        background-color: $accent-color;
        mix-blend-mode: multiply;
        pointer-events: none;
        will-change: transform;
        z-index: -1;
        display: block;

        @media (hover: none) {
            display: none;
        }
    }
</style>