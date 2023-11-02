import { writable } from "svelte/store";

export enum NavigationOption {
    Staggered,
    Blog,
    Disabled
}
export let ENABLE_FLUID_SIM = writable(true);
export let NAVIGATION_CONFIG = writable(NavigationOption.Staggered);
export let FLUID_SIM_INTERACTIVE = writable(false);