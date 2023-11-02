<script lang="ts">
    import NavigationButton from "./NavigationButton.svelte";
    import { Code2, User, Sword, Mail } from "lucide-svelte";

    export let direction: "staggered" | "column";
</script>

<div
    class="desktop-container"
    class:staggered-buttons={direction === "staggered"}
    class:column={direction === "column"}
>
    {#if direction === "staggered"}
        <div class="empty" />
    {/if}
    <NavigationButton
        pageSlug="/projects"
        title="Projects"
        icon={Code2}
        primary
    />
    <NavigationButton pageSlug="/about" title="About" icon={User} />
    <NavigationButton pageSlug="/skills" title="Skills" icon={Sword} />
    <NavigationButton pageSlug="/contact" title="Contact" icon={Mail} />
    {#if direction === "staggered"}
        <div class="empty" />
    {/if}
</div>
{#if direction === "column"}
<div
    class="mobile-container">
    <NavigationButton
        pageSlug="/projects"
        title="More Projects"
        icon={Code2}
        primary
    />
</div>
{/if}
    


<style lang="scss">
    .desktop-container {
        grid-gap: 2rem;
        &.staggered-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
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
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr 1fr;
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
    }
    .mobile-container {
        display: none;
        @media screen and (max-width: $mobile-breakpoint) {
            display: block;
        }
    }
</style>
