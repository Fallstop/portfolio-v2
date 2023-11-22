<script lang="ts">
    import { fluidSimFunctions } from "./layout/layoutDataStore";

    export let size: "small" | "medium" | "large" = "medium";
    export let highlighted: boolean = false;
    export let title: string | null = null;

    function onClick(e: PointerEvent) {
        // Create a "splat" in the fluid sim,
        // in the direction of the delta between the mouse and center of button
        if ($fluidSimFunctions) {
            const movementScaler = 100;

            if (e.detail === 0) {
                // Keyboard event detected!
                // Splat from center
                let rect = (e.target as HTMLElement).getBoundingClientRect();
            
                let xCenter = (rect.left + rect.right) / 2;
                let yCenter = (rect.top + rect.bottom) / 2;

                let xDirection = 2 * (Math.random() - 0.5) * movementScaler;
                let yDirection = 2 * (Math.random() - 0.5) * movementScaler;

                $fluidSimFunctions.splatPoint(xCenter, yCenter, xDirection, yDirection, undefined);
                return;
            } 

            // Mouse event, base splat for mouse position

            let x = e.clientX;
            let y = e.clientY;


            // Calculate ratio from center of button;
            let rect = (e.target as HTMLElement).getBoundingClientRect();
            
            let xRatio = (x - rect.left) / rect.width - 0.5;
            let yRatio = 0.5 - (y - rect.top) / rect.height;

            // Scale ratio using a quadratic function
            // https://www.desmos.com/calculator/n5okufbbxh

            let minRatio = 0.1;
            
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

<button class="fact-box {size}" on:click={onClick} on:click class:highlighted {title}>
    <slot />
</button>

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

        border: none;
        display: block;
        text-align: left;


        &:hover {
            background-color: adjust($primary-color, $alpha: -0.8);
        }

        &.small {
            padding: 0.25rem 0.5rem;
        }
        &.large {
            padding: 2rem;
        }
        &.highlighted {
            background-color: adjust($primary-color, $alpha: -0.3);
            color: white;
        }
    }
</style>
