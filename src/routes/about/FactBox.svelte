<script lang="ts">
    import { fluidSimContextKey } from "$lib/components/fluidSim/util";
    import { fluidSimFunctions } from "$lib/components/layout/layoutDataStore";
    import { getContext } from "svelte";

    export let title: string = "";

    export let description: string = "";



    function onClick(e: MouseEvent) {
        // Create a "splat" in the fluid sim,
        // in the direction of the delta between the mouse and center of button
        if ($fluidSimFunctions) {
            console.log("splatting with", e)
            let x = e.clientX;
            let y = e.clientY;
            // Calculate ratio from center of button;
            let rect = (e.target as HTMLElement).getBoundingClientRect();
            let xRatio = ((x - rect.left) / rect.width) - 0.5;
            let yRatio = 0.5 - ((y - rect.top) / rect.height);
            console.log("Rations", xRatio, yRatio, e.target)
            
            // Scale ratio using a quadratic function
            // https://www.desmos.com/calculator/n5okufbbxh

            let minRatio = 0.1;
            let movementScaler = 100;
            let xScaled = (Math.pow(xRatio,2) + minRatio) * Math.sign(xRatio) * movementScaler;
            let yScaled = (Math.pow(yRatio,2) + minRatio) * Math.sign(yRatio) * movementScaler;

            $fluidSimFunctions.splatPoint(x,y,xScaled,yScaled,undefined);
        }
    }
</script>

<div class="fact-box" on:click={onClick}>
    <span class="key">{title}</span>
    <span class="value">{description}</span>
</div>

<style lang="scss">
    @use "../../variables.scss" as *;
    @use "sass:color" as *;

    .fact-box {
        background-color: adjust($background-color, $alpha: -0.2);
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        cursor: pointer;

        transition: background-color 0.2s ease-in-out;

        .key {
            font-weight: bold;
            color: var(--color-primary);
            &::after {
                content: ":";
            }
        }
        .value {
            color: var(--color-text);
        }

        &:hover {
            background-color: adjust($background-color, $alpha: -0.8);
        }
    }
</style>
