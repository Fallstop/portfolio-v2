<script lang="ts">
  import { fly } from "svelte/transition";
  import { onMount, setContext } from "svelte";
  import NavigationLayout from "$lib/components/navigation/NavigationLayout.svelte";

  import {
    NavigationOption,
    type FluidSimFunctions,
    isNavigating,
  } from "$lib/components/layout/layoutDataStore";
  import { browser, dev } from "$app/environment";

  import Lazy from "$lib/components/utilities/Lazy.svelte";
  import type { Writable } from "svelte/store";

  interface Props {
    children?: import("svelte").Snippet;
    FLUID_SIM_INTERACTIVE: boolean;
    SPLASH_BACKGROUND_ON_PRINT: boolean;
    NAVIGATION_CONFIG: NavigationOption;
    PERSONAL_HEADSHOT: boolean;
    fluidSimFunctions: Writable<FluidSimFunctions | null>;
    ENABLE_FLUID_SIM: boolean;
  }

  let {
    children,
    FLUID_SIM_INTERACTIVE,
    SPLASH_BACKGROUND_ON_PRINT,
    NAVIGATION_CONFIG,
    PERSONAL_HEADSHOT,
    fluidSimFunctions,
    ENABLE_FLUID_SIM,
  }: Props = $props();

  let firstLoad = $state(false);

  let fluidFPS: number = $state(1);
  let fluidPaused: boolean = $state(false);

  // Pause fluid sim during navigations to prevent GPU contention with view transitions
  $effect(() => {
    fluidPaused = $isNavigating;
  });

  let fluidCanvas: any | null = $state();

  // Check for prefers-reduced-motion to skip fluid sim entirely for accessibility
  let prefersReducedMotion = $state(false);
  if (browser) {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function fluidCanvasLoaded(e: CustomEvent<FluidSimFunctions>) {
    console.log("Canvas Loaded", e);
    fluidSimFunctions.set(e.detail);
  }

  onMount(() => {
    firstLoad = true;
  });
</script>

<div
  class="landing-container"
  class:blog={NAVIGATION_CONFIG == NavigationOption.Blog}
  class:reverse-mobile={NAVIGATION_CONFIG == NavigationOption.Midpoint ||
    NAVIGATION_CONFIG == NavigationOption.Blog}
>
  <div class="content-container" style="view-transition-name: page-content;">
    {@render children?.()}
  </div>
  <div
    class="navigation-container"
    in:fly={{ x: 100, duration: firstLoad ? 500 : 0 }}
    draggable="true"
  >
    {#if NAVIGATION_CONFIG !== NavigationOption.Disabled}
      <NavigationLayout direction={NAVIGATION_CONFIG} />
    {/if}
  </div>

  {#if PERSONAL_HEADSHOT}
    <img
      in:fly={{ y: 100, duration: 500 }}
      src="/assets/photos/OnlyBelowChinMasked.webp"
      class="headshot-photo"
      alt="Personal Headshot"
    />
  {/if}
  {#if ENABLE_FLUID_SIM && !prefersReducedMotion}
    {#if dev}
      <div class="fps-counter">
        {Math.round(fluidFPS).toString().padStart(3, "0")} FPS
      </div>
    {/if}
    <div class="gradient-fallback"></div>
    <Lazy this={() => import("$lib/components/fluidSim/FluidCanvas.svelte")}>
      {#snippet component({ Component: FluidCanvas })}
        <FluidCanvas
          bind:this={fluidCanvas}
          bind:FPS={fluidFPS}
          bind:PAUSED={fluidPaused}
          on:loaded={fluidCanvasLoaded}
          INTERACTIVE={FLUID_SIM_INTERACTIVE}
          SPLASH_ON_PRINT={SPLASH_BACKGROUND_ON_PRINT}
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
      grid-template-columns: $blog-content-percent calc(
          100% - $blog-content-percent
        );
      max-width: $blog-size;
      margin: auto;
    }

    @media screen and (max-width: $tablet-breakpoint) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
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
      margin: 0;

      // Single drop-shadow is ~66% less GPU work than triple
      filter: drop-shadow(0 0 4rem rgba(255, 255, 255, 0.95));

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

    .gradient-fallback {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: -11;
      pointer-events: none;
      background: radial-gradient(
        ellipse at 30% 40%,
        rgba(174, 68, 90, 0.32) 0%,
        rgba(102, 37, 73, 0.22) 40%,
        rgba(69, 25, 82, 0.14) 70%,
        transparent 100%
      );

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
        margin-top: auto;
        padding-bottom: 2rem;
      }
    }
    @media print {
      grid-template-columns: 100% 0;
      .navigation-container {
        display: none;
      }
    }
  }
</style>
