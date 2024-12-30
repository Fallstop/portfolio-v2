import { fluidSimFunctions } from "$lib/components/layout/layoutDataStore";
import { get } from "svelte/store";

function addEventListener(node: HTMLElement, event: string, handler: any) {
    node.addEventListener(event, handler);
    return () => node.removeEventListener(event, handler);
}

export function liveCardEffect(
	node: HTMLElement,
	parameters: {
		movementScaler: number;
	} = { movementScaler: 100 }
): { destroy: () => void } {
    const { movementScaler } = parameters;

    function onClick(e: PointerEvent) {
        const fluidSim = get(fluidSimFunctions);
        // Create a "splat" in the fluid sim,
        // in the direction of the delta between the mouse and center of button
        if (fluidSim) {

            if (e.detail === 0) {
                // Keyboard event detected!
                // Splat from center
                let rect = (e.target as HTMLElement).getBoundingClientRect();
            
                let xCenter = (rect.left + rect.right) / 2;
                let yCenter = (rect.top + rect.bottom) / 2;

                let xDirection = 2 * (Math.random() - 0.5) * movementScaler;
                let yDirection = 2 * (Math.random() - 0.5) * movementScaler;

                fluidSim.splatPoint(xCenter, yCenter, xDirection, yDirection, undefined);
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

            fluidSim.splatPoint(x, y, xScaled, yScaled, undefined);
        }
    }

    const desubClick = addEventListener(node, 'click', onClick)
    return {
        destroy: () => {
            desubClick();
        }
    };
}
