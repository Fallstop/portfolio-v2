<script lang="ts">
    import { liveCardEffect } from "$lib/effects/liveCardEffect";
    import { fluidSimFunctions } from "./layout/layoutDataStore";

    export let hidden: "hidden-mobile" | "hidden" | "visible" = "visible";
    export let size: "small" | "medium" | "large" | "wrap" | "wrap grow" = "medium";
    export let style: "normal" | "error" = "normal";
    export let tabbable: boolean = false;
    export let highlighted: boolean = false;
    export let title: string | null = null;
    export let type: "button" | "link" = "button";
    $: clickable = (!!$fluidSimFunctions) || type === "link";
</script>

{#if type === "button"}
    <button {...$$restProps} class="fact-box {size} {style} {hidden}" class:clickable={clickable} use:liveCardEffect on:click class:highlighted {title} tabindex={tabbable && clickable ? 0 : -1}><slot /></button>
{:else if type === "link"}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a {...$$restProps} class="fact-box {size} {style} {hidden}" class:clickable={clickable} use:liveCardEffect on:click class:highlighted {title} tabindex={tabbable && clickable ? 0 : -1}><slot /></a>
{/if}


<style lang="scss">
    @use "../../variables.scss" as *;
    @use "sass:color" as *;
    
    .fact-box {
        @include icon-inline;


        background-color: adjust($background-color, $alpha: -0.2);
        padding: 1rem;
        border-radius: $border-radius;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        cursor: initial;
        &.clickable {
            cursor: pointer;
        }

        page-break-inside: avoid;
        break-inside: avoid;
        
        transition: all 0.2s ease-in-out;

        border: none;
        display: block;
        text-align: left;
        
        color: $text-color;
        text-decoration: none;


        &:hover {
            background-color: adjust($primary-color, $alpha: -0.8);
        }

        &.small {
            padding: 0.25rem 0.5rem;
        }
        &.large {
            padding: 2rem;
        }
        &.highlighted {
            background-color: adjust($primary-color, $alpha: -0.3);
            color: white;
        }
        &.wrap {
            padding: 0;
            display: inline-block;
            &.grow {
                width: 100%;
            }
        }

        &.hidden {
            display: none;
        }

        @media screen and (max-width: $tablet-breakpoint) {
            &.hidden-mobile {
                display: none;
            }
        }
        


        &.error {
            box-shadow: 0 0 1rem adjust($negative-color, $alpha: -0.4);
        }
    }
</style>
