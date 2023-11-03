<script lang="ts">
    import { receive, send } from "$lib/utilities/sendTransition";
    import { flip } from "svelte/animate";
    import NavigationButton from "./NavigationButton.svelte";
    import { pages, promotedPage } from "./pages";
    import { NavigationOption } from "../layout/layoutDataStore";

    export let direction: NavigationOption;
</script>

<div
    class="desktop-container"
    class:staggered-buttons={direction === NavigationOption.Staggered}
    class:column={direction === NavigationOption.Blog}
>
    {#if direction === NavigationOption.Staggered}
        <div class="empty" />
    {/if}
    {#each pages as { pageSlug, title, icon, primary } (direction+pageSlug)}
        <div class="animation-container"
            in:send={{ key: pageSlug}}
            out:receive={{ key: pageSlug }}
            animate:flip
        >
            <NavigationButton {pageSlug} {title} {icon} {primary} />
        </div>
    {/each}
    {#if direction === NavigationOption.Staggered}
        <div class="empty" />
    {/if}
</div>
{#if direction === NavigationOption.Blog}
    <div class="mobile-container">
        <NavigationButton
            pageSlug={promotedPage.pageSlug}
            title={promotedPage.title}
            icon={promotedPage.icon}
            primary={promotedPage.primary}
        />
    </div>
{/if}

<style lang="scss">
    .desktop-container {
        grid-gap: 2rem;
        &.staggered-buttons {
            display: grid;
            grid-template-columns: 33% 33% 33%;
            grid-template-rows: 50% 50%;
            padding: 2rem 0;
        }
        &.column {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem 0;
        }
        @media screen and (max-width: $tablet-breakpoint) {
            grid-gap: 1rem;

            &.staggered-buttons {
                grid-template-columns: 50% 50%;
                grid-template-rows: 33% 33% 33%;
                padding: 0 2rem 2rem 2rem;
                .empty {
                    // Not needed in column layout
                    display: none;
                }
            }

            &.column {
                flex-direction: row;
                flex-wrap: wrap;
            }
        }
        @media screen and (max-width: $mobile-breakpoint) {
            &.staggered-buttons {
                display: flex;
                flex-direction: column;
                justify-content: center;
                .empty {
                    // Not needed in column layout
                    display: none;
                }
            }
            &.column {
                display: none;
            }
        }
        .animation-container {
            height: 100%;
        }
    }
    .mobile-container {
        display: none;
        @media screen and (max-width: $mobile-breakpoint) {
            display: block;
        }
    }
</style>
