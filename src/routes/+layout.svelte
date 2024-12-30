<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount, setContext } from "svelte";
    import NavigationLayout from "$lib/components/navigation/NavigationLayout.svelte";
    import "../app.scss";
    import {
        ENABLE_FLUID_SIM,
        FLUID_SIM_INTERACTIVE,
        NAVIGATION_CONFIG,
        NavigationOption,
        PERSONAL_HEADSHOT,
        fluidSimFunctions,
        type FluidSimFunctions,
        SPLASH_BACKGROUND_ON_PRINT,
    } from "$lib/components/layout/layoutDataStore";
    import { dev } from "$app/environment";

    import Lazy from "$lib/components/utilities/Lazy.svelte";
    import { fluidSimContextKey } from "$lib/components/fluidSim/util";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    let firstLoad = $state(false);

    let fluidFPS: number = $state(1);

    let fluidCanvas: any | null = $state();

    function fluidCanvasLoaded(e: CustomEvent<FluidSimFunctions>) {
        console.log("Canvas Loaded",e)
        fluidSimFunctions.set(e.detail);
    }

    onMount(() => {
        firstLoad = true;
    });
</script>

<div
    class="landing-container"
    class:blog={$NAVIGATION_CONFIG == NavigationOption.Blog}
    class:reverse-mobile={$NAVIGATION_CONFIG == NavigationOption.Midpoint ||
        $NAVIGATION_CONFIG == NavigationOption.Blog}
>
    <div class="content-container">
        {@render children?.()}
    </div>
    {#if firstLoad}
        <div
            class="navigation-container"
            in:fly={{ x: 100, duration: 500 }}
            draggable="true"
        >
            {#if $NAVIGATION_CONFIG !== NavigationOption.Disabled}
                <NavigationLayout direction={$NAVIGATION_CONFIG} />
            {/if}
        </div>
    {/if}

    {#if $PERSONAL_HEADSHOT}
        <img
            in:fly={{ y: 100, duration: 500 }}
            src="/assets/photos/OnlyBelowChinMasked.webp"
            class="headshot-photo"
            alt="Personal Headshot"
        />
    {/if}
    {#if $ENABLE_FLUID_SIM}
        {#if dev}
            <div class="fps-counter">
                {Math.round(fluidFPS).toString().padStart(3, "0")} FPS
            </div>
        {/if}
        <Lazy
            this={() => import("$lib/components/fluidSim/FluidCanvas.svelte")}
        >
            {#snippet component({ Component: FluidCanvas })}
                    <FluidCanvas
                        bind:this={fluidCanvas}
                        bind:FPS={fluidFPS}
                        on:loaded={fluidCanvasLoaded}
                        INTERACTIVE={$FLUID_SIM_INTERACTIVE}
                        SPLASH_ON_PRINT={$SPLASH_BACKGROUND_ON_PRINT}
                    />
                
            {/snippet}
        </Lazy>
    {/if}
</div>

<style lang="scss">
    .landing-container {
        padding: 0 calc(5rem - (100vw - 100%)) 0 5rem;
        min-height: 100%;

        color: $text-color;
        display: grid;
        grid-template-columns: 60% 40%;

        position: relative;
        &.blog {
            grid-template-columns: $blog-content-percent calc(100% - $blog-content-percent);
            max-width: $blog-size;
            margin: auto;
        }

        @media screen and (max-width: $tablet-breakpoint) {
            grid-template-columns: 1fr;
            padding: 0;
            &.reverse-mobile {
                display: flex;
                flex-direction: column-reverse;
                justify-content: start;
            }
        }

        @media print {
            padding: calc($print-page-padding/2) $print-page-padding;
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
            height: var(--headshot-height);
            position: fixed;
            right: calc(-1 * (100vw - 100%));
            bottom: 0;
            z-index: -2;
            user-select: none;

            filter: drop-shadow(0 0 5rem #fff) drop-shadow(0 0 5rem #fff) drop-shadow(0 0 5rem #fff);

            @media print {
                height: $print-page-padding;
            }
        }
        .content-container {
            padding: 5rem 5rem 5rem 0;

            @media print {
                margin: 0;
                padding: 0;
            }
            @media screen and (max-width: $mobile-breakpoint) {
                padding: 0.5rem;
            }
            @media screen and (max-width: $tablet-breakpoint) {   
                padding: 1rem;
            }

        }
        .fps-counter {
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            font-size: 2rem;
            padding: 0.5rem;
            background-color: rgba(0, 0, 0, 0.5);
            pointer-events: none;
            user-select: none;
            @include mono-font;
            @media screen and (max-width: $mobile-breakpoint) {
                font-size: 1rem;
                padding: 0.2rem;
            }
            @media print {
                display: none;
            }
        }

        .navigation-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100vh;
            pointer-events: none;
            -webkit-user-drag: none;
            
            @media screen and (max-width: $tablet-breakpoint) {
                height: auto;
                justify-content: start;
            }
        }
        @media print {
            grid-template-columns: 100% 0;
            .navigation-container {
                display: none
            }
        }
    }
</style>
