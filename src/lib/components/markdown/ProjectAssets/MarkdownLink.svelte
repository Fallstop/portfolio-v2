<script lang="ts">
    import { getBrandDetails } from "$lib/utilities/getBrandDetails";
    import type { Globe } from "lucide-svelte";

    export let href: string;
    export let openInNewTab: boolean = true;
    export let icon: typeof Globe | null = null;
    export let color: string | null = null;

    $: urlBrand = getBrandDetails(href);

</script>

<a {href} target={openInNewTab ? "_blank" : "_self"} style="--brand-color: {color || urlBrand.color}">
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

        :global(svg) {
            height: 1em;
            display: inline;
            vertical-align: middle;


        }
}
</style>