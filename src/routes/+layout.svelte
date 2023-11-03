<script lang="ts">
    import {fly} from "svelte/transition";
    import { onMount } from "svelte";
    import FluidCanvas from "$lib/components/fluidSim/FluidCanvas.svelte";
    import NavigationLayout from "$lib/components/navigation/NavigationLayout.svelte";
    import "../app.scss";
    import { ENABLE_FLUID_SIM, FLUID_SIM_INTERACTIVE, NAVIGATION_CONFIG, NavigationOption } from "$lib/components/layout/layoutDataStore";
    import { dev } from "$app/environment";


    let firstLoad = false;

    
    let actions = { randomSplats: () => {}, captureScreenShot: () => {} };
    let fluidFPS: number = 1;

    onMount(()=>{
        firstLoad = true;
    });

</script>

<div class="landing-container" class:blog={ $NAVIGATION_CONFIG == NavigationOption.Blog} class:reverse-mobile={$NAVIGATION_CONFIG == NavigationOption.Midpoint ||$NAVIGATION_CONFIG == NavigationOption.Blog}>
    <div class="content-container">
        <slot/>
    </div>
    {#if firstLoad}
        <div class="navigation-container" in:fly={{x: 100, duration: 500}} draggable="true">
            {#if $NAVIGATION_CONFIG !== NavigationOption.Disabled}
                <NavigationLayout direction={$NAVIGATION_CONFIG}/>
            {/if}
        </div>
    {/if}

    {#if firstLoad && $NAVIGATION_CONFIG == NavigationOption.Home}
        <img in:fly={{y: 100, duration: 500}} src="/assets/photos/OnlyBelowChinProfileTransparent.webp" class="headshot-photo" alt="Personal Headshot"/>
    {/if}
    {#if $ENABLE_FLUID_SIM}
        {#if dev}
            <div class="fps-counter">{Math.round(fluidFPS).toString().padStart(3,"0")} FPS</div>
        {/if}
        <FluidCanvas bind:actions bind:FPS={fluidFPS} INTERACTIVE={$FLUID_SIM_INTERACTIVE}/>
    {/if}
</div>

<style lang="scss">
    .landing-container {
        padding: 0 calc(5rem - (100vw - 100%)) 0 5rem;
        min-height: 100%;

        color: $text-color;
        display: grid;
        grid-template-columns: 60% 40%;
        &.blog {
            grid-template-columns: 80% 20%;
            max-width: $blog-size;
            margin: auto;
        }

        @media screen and (max-width: $tablet-breakpoint) {
            grid-template-columns: 1fr;
            padding: 0;
            &.reverse-mobile {
                display: flex;
                flex-direction: column-reverse;
                
            }
        }

        // ::selection {
        //     background: $text-color; /* WebKit/Blink Browsers */
        //     color: $background-color;
        //     -webkit-text-fill-color: $background-color;
        // }
        // ::-moz-selection {
        //     background: #000; /* Gecko Browsers */
        // }

        .headshot-photo {
            height: 35vh;
            position: fixed;
            right: calc(-1 * (100vw - 100%));
            bottom: 0;
            z-index: -1;
            user-select: none;

            @media screen and (max-width: $tablet-breakpoint) {
                height: 15vh;
            }
            @media screen and (max-width: $mobile-breakpoint) {
                display: none;
            }
        }
        .content-container {
            margin: 5rem 5rem 5rem 0;
            @media screen and (max-width: $tablet-breakpoint) {
                margin: 0;
            }
        }
        .fps-counter {
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            font-size: 2rem;
            padding: 0.5rem;
            background-color: rgba(0,0,0,0.5);
            pointer-events: none;
            user-select: none;
            @include mono-font;
            @media screen and (max-width: $mobile-breakpoint) {
                font-size: 1rem;
                padding: 0.2rem
            }
        }


        .navigation-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: min(100%, 100vh);
            pointer-events: none;
            @media screen and (max-width: $tablet-breakpoint) {
                height: auto;
                justify-content: start;
            }
            -webkit-user-drag: none;
        }
    }
</style>
