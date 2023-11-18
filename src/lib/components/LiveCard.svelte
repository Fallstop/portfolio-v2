<script lang="ts">
    import { fluidSimFunctions } from "./layout/layoutDataStore";

    function onClick(e: MouseEvent) {
        // Create a "splat" in the fluid sim,
        // in the direction of the delta between the mouse and center of button
        if ($fluidSimFunctions) {
            console.log("splatting with", e);
            let x = e.clientX;
            let y = e.clientY;


            // Calculate ratio from center of button;
            let rect = (e.target as HTMLElement).getBoundingClientRect();
            
            let xRatio = (x - rect.left) / rect.width - 0.5;
            let yRatio = 0.5 - (y - rect.top) / rect.height;
            console.log("Rations", xRatio, yRatio, e.target);

            // Scale ratio using a quadratic function
            // https://www.desmos.com/calculator/n5okufbbxh

            let minRatio = 0.1;
            let movementScaler = 100;
            let xScaled =
                (Math.pow(xRatio, 2) + minRatio) *
                Math.sign(xRatio) *
                movementScaler;
            let yScaled =
                (Math.pow(yRatio, 2) + minRatio) *
                Math.sign(yRatio) *
                movementScaler;
            console.log("Y", yScaled, yRatio, y, movementScaler)

            $fluidSimFunctions.splatPoint(x, y, xScaled, yScaled, undefined);
        }
    }
</script>

<div class="fact-box" on:click={onClick}>
    <slot />
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

        page-break-inside: avoid;
        break-inside: avoid;
        
        transition: background-color 0.2s ease-in-out;


        &:hover {
            background-color: adjust($background-color, $alpha: -0.8);
        }
    }
</style>
