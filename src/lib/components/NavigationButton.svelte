<script lang="ts">
    import type { Icon } from "lucide-svelte";
    import { Home } from "lucide-svelte";
    export let icon: typeof Home;
    export let pageSlug:
        | "/projects"
        | "/about"
        | "/skills"
        | "/contact"
        | "/home";
    export let title: string;

    import { page } from "$app/stores";
    $: activePage = $page.url.pathname == pageSlug;
</script>

<a href={activePage ? "/" : pageSlug}>
    <div class="navigation-button">
        <svelte:component this={activePage ? Home : icon} size="0.9em" />
        <span class="button-title">
            {activePage ? "Home" : title}
        </span>
    </div>
</a>

<style lang="scss">
    a {
        pointer-events: all;
        text-decoration: none;
        user-select: none;
        .navigation-button {
            color: $text-color;
            padding: 1rem;
            font-size: 3rem;
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
        }
        &:nth-child(2n) .navigation-button {
            &:hover {
                background-color: $secondary-color;
            }
        }
    }
</style>
