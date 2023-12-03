<script lang="ts">
    import { liveCardEffect } from "$lib/effects/liveCardEffect";

    export let size: "small" | "medium" | "large" | "wrap" = "medium";
    export let style: "normal" | "error" = "normal";
    export let tabbable: boolean = false;
    export let highlighted: boolean = false;
    export let title: string | null = null;
</script>

<button class="fact-box {size} {style}" use:liveCardEffect on:click class:highlighted {title} type="button" tabindex={tabbable ? 0 : -1}>
    <slot />
</button>

<style lang="scss">
    @use "../../variables.scss" as *;
    @use "sass:color" as *;
    
    .fact-box {
        background-color: adjust($background-color, $alpha: -0.2);
        padding: 1rem;
        border-radius: $border-radius;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        cursor: pointer;

        page-break-inside: avoid;
        break-inside: avoid;
        
        transition: all 0.2s ease-in-out;

        border: none;
        display: block;
        text-align: left;


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
        }


        &.error {
            box-shadow: 0 0 1rem adjust($negative-color, $alpha: -0.4);
        }
    }
</style>
