<script lang="ts">
    import { onMount } from "svelte";
    import { ENABLE_FLUID_SIM, FLUID_SIM_INTERACTIVE, NAVIGATION_CONFIG, NavigationOption, PERSONAL_HEADSHOT, SPLASH_BACKGROUND_ON_PRINT } from "./layoutDataStore";
    import type { SEODataI } from "./SEO.svelte";
    import Seo from "./SEO.svelte";
    // import Seo from "./SEO.svelte";

    // export let fluid_sim_background: boolean = true;
    // export let fluid_sim_interactive: boolean = false;
    // export let navigation_option: NavigationOption = NavigationOption.Home;
    // export let personal_headshot = false;
    // export let splash_on_print = false;

    // export let SEOProps: SEOProps;

    export type PrimaryLayoutProps = {
        fluid_sim_background?: boolean,
        fluid_sim_interactive?: boolean,
        navigation_option?: NavigationOption,
        personal_headshot?: boolean,
        splash_on_print?: boolean,
        SEOData: SEODataI
    }

    let {
        fluid_sim_background = true,
        fluid_sim_interactive = false,
        navigation_option = NavigationOption.Home,
        personal_headshot = false,
        splash_on_print = false,
        SEOData
    }: PrimaryLayoutProps = $props();

    onMount(()=>{
        ENABLE_FLUID_SIM.set(fluid_sim_background);
        FLUID_SIM_INTERACTIVE.set(fluid_sim_interactive);
        NAVIGATION_CONFIG.set(navigation_option);
        PERSONAL_HEADSHOT.set(personal_headshot);
        SPLASH_BACKGROUND_ON_PRINT.set(splash_on_print)
    })
</script>
<Seo {SEOData} />
<slot/>