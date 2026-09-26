import { writable, type Writable } from "svelte/store";

export enum NavigationOption {
    Home,
    Midpoint,
    Blog,
    Disabled
}
export interface FluidSimFunctions {
    splatPoint: (x: number, y: number, dx: number, dy: number, color: RGBColour | undefined) => void;
}

export let fluidSimFunctions: Writable<FluidSimFunctions | null> = writable(null);

export let isNavigating = writable(false);
