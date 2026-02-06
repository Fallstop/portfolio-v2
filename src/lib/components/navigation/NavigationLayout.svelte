<script lang="ts">
    import { receive, send } from "$lib/utilities/sendTransition";
    import { flip } from "svelte/animate";
    import NavigationButton from "./NavigationButton.svelte";
    import SocialLinks from "./SocialLinks.svelte";
    import { homePage, pages, promotedPage } from "./pages";
    import { NavigationOption } from "../layout/layoutDataStore";

    interface Props {
        direction: NavigationOption;
    }

    let { direction }: Props = $props();

    let staggeredButtons = $derived(direction === NavigationOption.Home || direction === NavigationOption.Midpoint);
</script>

<div
    class="desktop-container"
    class:staggered-buttons={staggeredButtons}
    class:column={direction === NavigationOption.Blog}
    class:desktop-only={direction === NavigationOption.Blog || direction === NavigationOption.Midpoint}
>
    {#each pages as { pageSlug, title, icon, primary } (direction+pageSlug)}
        <div class="animation-container">
            <NavigationButton {pageSlug} {title} {icon} primary={false} />
        </div>
    {/each}
    {#if staggeredButtons || direction === NavigationOption.Blog}
        <div class="animation-container social-links-cell">
            <SocialLinks />
        </div>
    {/if}
</div>
<div class="mobile-container">
    {#if direction === NavigationOption.Blog}
        <NavigationButton
            pageSlug={promotedPage.pageSlug}
            title={promotedPage.title}
            icon={promotedPage.icon}
            primary={promotedPage.primary}
        />
    {:else if direction===NavigationOption.Midpoint}
        <NavigationButton
            pageSlug={homePage.pageSlug}
            title={homePage.title}
            icon={homePage.icon}
            primary={homePage.primary}
        />
    {/if}
</div>

<style lang="scss">
    @use "../../../variables.scss" as *;
    .desktop-container {
        $gap: 2rem;
        grid-gap: $gap;

        &.staggered-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            align-items: center;
        }
        &.column {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2rem;
            padding: 2rem 0;
        }
        @media screen and (max-width: $tablet-breakpoint) {
            grid-gap: 1rem;

            &.staggered-buttons {
                grid-template-columns: 50% 50%;
                grid-template-rows: 1fr 1fr;
                padding: 2rem;
                .empty {
                    // Not needed in column layout
                    display: none;
                }
            }

            &.column {
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                gap: 0.5rem;
                padding: 1rem 0;
            }
        }
        @media screen and (max-width: $mobile-breakpoint) {
            &.staggered-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                grid-gap: 0.5rem;
                padding: 1rem;
                .empty {
                    // Not needed in column layout
                    display: none;
                }
            }
            &.desktop-only {
                display: none;
            }
        }
        .animation-container {
            height: 100%;
        }
    }
    .social-links-cell {
        pointer-events: all;
    }
    .mobile-container {
        display: none;
        @media screen and (max-width: $mobile-breakpoint) {
            display: block;
        }
    }
</style>
