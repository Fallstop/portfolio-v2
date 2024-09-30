<script lang="ts">
    import { getBrandDetails } from "$lib/utilities/getBrandDetails";
    import type { Globe } from "lucide-svelte";

    export let href: string;
    export let openInNewTab: boolean = true;
    export let icon: typeof Globe | null = null;
    export let color: string | null = null;
    export let size: "normal" | "small" | "large" = "normal";

    $: urlBrand = getBrandDetails(href);

</script>

<a class="{size}" {href} target={openInNewTab ? "_blank" : "_self"} style="--brand-color: {color || urlBrand.color}">
    <svelte:component this={icon || urlBrand.icon} />
    <slot/>
</a>

<style lang="scss">
    @use "../../../../variables.scss" as *;
    a {
        display: inline-block;
        text-decoration: none;
        color: $dark-text-color;
        margin: 0.5rem 0.5rem 0.5rem 0;
        
        padding: 0.5rem;
        background-color: var(--brand-color);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
        transition: box-shadow 0.2s ease-in-out;

        @include icon-inline;

        &:hover {
            box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
        }

        &.small {
            padding: 0.25rem;
            font-size: 0.75rem;
        }
        &.large {
            padding: 1rem;
            font-size: 1.5rem;
        }
}
</style>