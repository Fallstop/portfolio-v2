<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { ENABLE_FLUID_SIM, FLUID_SIM_INTERACTIVE, NAVIGATION_CONFIG, NavigationOption, PERSONAL_HEADSHOT, SPLASH_BACKGROUND_ON_PRINT, fluidSimFunctions } from "./layoutDataStore";
    import type { SEODataI } from "./SEO.svelte";
    import Seo from "./SEO.svelte";
  import MultiLayout from "./MultiLayout.svelte";
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
        SEOData: SEODataI,
        children: Snippet
    }

    let {
        fluid_sim_background = true,
        fluid_sim_interactive = false,
        navigation_option = NavigationOption.Home,
        personal_headshot = false,
        splash_on_print = false,
        SEOData,
        children
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
<MultiLayout
    FLUID_SIM_INTERACTIVE={fluid_sim_interactive}
    NAVIGATION_CONFIG={navigation_option}
    PERSONAL_HEADSHOT={personal_headshot}
    SPLASH_BACKGROUND_ON_PRINT={splash_on_print}
    ENABLE_FLUID_SIM={fluid_sim_background}
    fluidSimFunctions={fluidSimFunctions}
    {children}
/>
