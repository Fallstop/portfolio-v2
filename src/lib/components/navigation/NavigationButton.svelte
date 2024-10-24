<script lang="ts">
    import type { Icon } from "lucide-svelte";

    import { page } from "$app/stores";
    import { homePage, type PageSlug } from "./pages";
    import { liveCardEffect } from "$lib/effects/liveCardEffect";
    interface Props {
        icon: typeof homePage.icon;
        pageSlug: PageSlug;
        title: string;
        primary?: boolean;
    }

    let {
        icon,
        pageSlug,
        title,
        primary = false
    }: Props = $props();

    let activePage = $derived($page.url.pathname == pageSlug);


    const SvelteComponent = $derived(activePage ? homePage.icon : icon);
</script>

<a href={activePage ? homePage.pageSlug : pageSlug} use:liveCardEffect={{movementScaler: 300}}>
    <div class="navigation-button" class:primary={primary || activePage}>
        <SvelteComponent size="0.9em" />
        <span class="button-title">
            {activePage ? homePage.title : title}
        </span>
    </div>
</a>

<style lang="scss">
    a {
        pointer-events: all;
        text-decoration: none;
        user-select: none;
        // display:block;
        
        .navigation-button {
            height: 100%;
            box-sizing: border-box;
            color: $text-color;
            padding: 0.8rem;
            font-size: 2rem;
            border: 1px solid $text-color;
            box-shadow: 0 0 0 0 black;
            background-color: rgba(255,255,255, 0.5);
            transition: all 250ms ease-in-out;
            &:hover {
                background-color: $tint-color;
                color: $background-color;
                border-color: transparent;
                box-shadow: 0.5rem 0.5rem 0 0.1rem black;
            }

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            span {
                margin-left: 0.3em;
            }

            @media screen and (max-width: $tablet-breakpoint) {
                font-size: 2rem;
            }
            @media screen and (max-width: $mobile-breakpoint) {
                font-size: 1.2rem;
            }
            @media screen and (min-width: $chonk-breakpoint) {
                padding: 1rem;
                font-size: 2.5rem;
            }
            &.primary {
                @media (hover: none) {
                    background-color: $secondary-color;
                    color: $background-color;
                    border-color: transparent;
                }
            }

        }
        &:nth-child(2n) .navigation-button {
            &:hover {
                background-color: $secondary-color;
            }
        }
    }
</style>
