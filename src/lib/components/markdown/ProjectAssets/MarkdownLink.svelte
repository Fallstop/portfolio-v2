<script lang="ts">
    import { getBrandDetails } from "$lib/utilities/getBrandDetails";
    import type { Globe } from "lucide-svelte";

    interface Props {
        href: string;
        openInNewTab?: boolean;
        icon?: typeof Globe | null;
        color?: string | null;
        size?: "normal" | "small" | "large";
        children?: import('svelte').Snippet;
    }

    let {
        href,
        openInNewTab = true,
        icon = null,
        color = null,
        size = "normal",
        children
    }: Props = $props();

    let urlBrand = $derived(getBrandDetails(href));


    const SvelteComponent = $derived(icon || urlBrand.icon);
</script>

<a class="{size}" {href} target={openInNewTab ? "_blank" : "_self"} style="--brand-color: {color || urlBrand.color}">
    <SvelteComponent class="" />
    {@render children?.()}
</a>

<style lang="scss">
    @use "../../../../variables.scss" as *;
    a {
        display: inline-block;
        text-decoration: none;
        color: $dark-text-color;
        margin: $space-xs $space-xs $space-xs 0;

        padding: $space-xs;
        background-color: var(--brand-color);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
        transition: box-shadow $transition-base;
        text-wrap: nowrap;
        overflow: hidden;
        max-width: 100%;

        box-sizing: border-box;

        @include icon-inline;

        text-overflow: ellipsis;
        &:hover {
            box-shadow: 0 0 $space-xs rgba(0, 0, 0, 0.5);
        }

        &.small {
            padding: calc($space-xs / 2);
            font-size: $font-size-xs;
        }
        &.large {
            padding: $space-sm;
            font-size: $font-size-lg;
        }
}
</style>