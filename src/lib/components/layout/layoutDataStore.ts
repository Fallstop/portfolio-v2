import { writable, type Writable } from "svelte/store";

export enum NavigationOption {
    Home,
    Midpoint,
    Blog,
    Disabled
}
export let ENABLE_FLUID_SIM = writable(true);
export let NAVIGATION_CONFIG = writable(NavigationOption.Home);
export let FLUID_SIM_INTERACTIVE = writable(false);

export let PERSONAL_HEADSHOT = writable(false);

export interface FluidSimFunctions {
    captureScreenshot: ()=>{},
    multipleSplats: (amount: number)=>{},
    randomSplats: ()=>{},
    splatPointer: (pointer: PointerInfo)=>{},
    splatPoint: (x: number, y: number, dx: number, dy: number, color: RGBColour | undefined)=>{},
}

export let fluidSimFunctions: Writable<FluidSimFunctions | null> = writable(null);

export let SPLASH_BACKGROUND_ON_PRINT = writable(false);