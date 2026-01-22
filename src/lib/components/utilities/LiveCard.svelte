<script lang="ts">
    import { liveCardEffect } from "$lib/effects/liveCardEffect";
    import type { MouseEventHandler } from "svelte/elements";
    import { fluidSimFunctions } from "../layout/layoutDataStore";

    interface Props {
        hidden?: "hidden-mobile" | "hidden" | "visible";
        size?: "small" | "medium" | "large" | "wrap" | "wrap grow";
        style?: "normal" | "error";
        tabbable?: boolean;
        highlighted?: boolean;
        title?: string | null;
        type?: "button" | "link" | "none";
        children?: import('svelte').Snippet;
        [key: string]: any,
        onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    }

    let {
        hidden = "visible",
        size = "medium",
        style = "normal",
        tabbable = false,
        highlighted = false,
        title = null,
        type = "button",
        children,
        onClick,
        ...rest
    }: Props = $props();
    let clickable = $derived((!!$fluidSimFunctions) || type === "link");
</script>

{#if type === "button"}
    <button {...rest} class="fact-box interactive {size} {style} {hidden}" class:clickable={clickable} use:liveCardEffect onclick={onClick} class:highlighted {title} tabindex={tabbable && clickable ? 0 : -1}>{@render children?.()}</button>
{:else if type === "link"}
    <!-- svelte-ignore a11y_missing_attribute -->
    <a {...rest} role="link" class="fact-box interactive {size} {style} {hidden}" class:clickable={clickable} use:liveCardEffect onclick={onClick} class:highlighted {title} tabindex={tabbable && clickable ? 0 : -1}>{@render children?.()}</a>
{:else if type === "none"}
    <div {...rest} class="fact-box {size} {style} {hidden}" use:liveCardEffect class:highlighted {title} >{@render children?.()}</div>
{/if}


<style lang="scss">
    @use "../../../variables.scss" as *;
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
        
        transition: all $transition-base;

        border: none;
        display: block;
        text-align: left;
        
        color: $text-color;
        text-decoration: none;


        &.interactive:hover {
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
