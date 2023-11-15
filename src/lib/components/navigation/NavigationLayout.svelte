<script lang="ts">
    import { receive, send } from "$lib/utilities/sendTransition";
    import { flip } from "svelte/animate";
    import NavigationButton from "./NavigationButton.svelte";
    import { homePage, pages, promotedPage } from "./pages";
    import { NavigationOption } from "../layout/layoutDataStore";

    export let direction: NavigationOption;

    $: staggeredButtons = direction === NavigationOption.Home || direction === NavigationOption.Midpoint;
</script>

<div
    class="desktop-container"
    class:staggered-buttons={staggeredButtons}
    class:column={direction === NavigationOption.Blog}
    class:desktop-only={direction === NavigationOption.Blog || direction === NavigationOption.Midpoint}
>
    {#if staggeredButtons}
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
    {#if staggeredButtons}
        <div class="empty" />
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
            $number-of-columns: 3;
            $column-size: calc(calc(33% - #{$gap}) + calc(#{$gap} / #{$number-of-columns}) );
            display: grid;
            grid-template-columns: $column-size $column-size $column-size;
            grid-template-rows: 50% 50%;
            // padding: 2rem 0;
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
                grid-template-rows: 50% 50%;
                padding: 2rem;
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
            &.desktop-only {
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
