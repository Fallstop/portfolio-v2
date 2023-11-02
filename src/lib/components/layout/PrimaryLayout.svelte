<script lang="ts">
    import { onMount } from "svelte";
    import { ENABLE_FLUID_SIM, FLUID_SIM_INTERACTIVE, NAVIGATION_CONFIG, NavigationOption } from "./layoutDataStore";

    export let fluid_sim_background: boolean = true;
    export let fluid_sim_interactive: boolean = false;
    export let navigation_option: NavigationOption = NavigationOption.Staggered;

    onMount(()=>{
        ENABLE_FLUID_SIM.set(fluid_sim_background);
        FLUID_SIM_INTERACTIVE.set(fluid_sim_interactive);
        NAVIGATION_CONFIG.set(navigation_option);
    })
</script>
<slot/>