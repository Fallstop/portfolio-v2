<script lang="ts">
    import { Linkedin, Github, Mail, Check, Send, Home } from "lucide-svelte";
    import { page } from "$app/stores";
    import CopyAction from "$lib/components/utilities/CopyAction.svelte";
    import { liveCardEffect } from "$lib/effects/liveCardEffect";

    let onContactPage = $derived($page.url.pathname === "/contact");
</script>

<div class="social-links">
    <a href="https://www.linkedin.com/in/jasper-mw/" target="_blank" rel="noopener noreferrer" use:liveCardEffect={{movementScaler: 200}}>
        <div class="social-pill">
            <Linkedin size="0.9em" strokeWidth="1.25" />
            <span>LinkedIn</span>
        </div>
    </a>
    <a href="https://github.com/fallstop/" target="_blank" rel="noopener noreferrer" use:liveCardEffect={{movementScaler: 200}}>
        <div class="social-pill">
            <Github size="0.9em" strokeWidth="1.25" />
            <span>GitHub</span>
        </div>
    </a>
    <CopyAction data="contact@jmw.nz">
        {#snippet copyIcon(copied)}
            <div class="social-pill-wrapper" use:liveCardEffect={{movementScaler: 200}}>
                <div class="social-pill email-pill" class:copied>
                    <span class="email-state" class:visible={!copied}>
                        <Mail size="0.9em" strokeWidth="1.25" />
                        <span>Email</span>
                    </span>
                    <span class="email-state" class:visible={copied}>
                        <Check size="0.9em" strokeWidth="1.25" />
                        <span>Copied!</span>
                    </span>
                </div>
            </div>
        {/snippet}
    </CopyAction>
    <a href={onContactPage ? "/" : "/contact"} use:liveCardEffect={{movementScaler: 200}}>
        <div class="social-pill" class:active={onContactPage}>
            {#if onContactPage}
                <Home size="0.9em" strokeWidth="1.25" />
                <span>Home</span>
            {:else}
                <Send size="0.9em" strokeWidth="1.25" />
                <span>Contact</span>
            {/if}
        </div>
    </a>
</div>

<style lang="scss">
    @use "../../../variables.scss" as *;

    .social-links {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    a, .social-pill-wrapper {
        pointer-events: all;
        text-decoration: none;
        user-select: none;
    }

    .social-pill {
        box-sizing: border-box;
        color: $text-color;
        padding: 0.4rem 0.8rem;
        font-size: $font-size-md;
        border: 1px solid $text-color;
        box-shadow: 0 0 0 0 black;
        background-color: rgba(255, 255, 255, 0.5);
        transition: color $transition-base, border-color $transition-base, box-shadow $transition-base;
        font-weight: lighter;
        cursor: pointer;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        &:hover {
            background-color: $tint-color;
            color: $background-color;
            border-color: transparent;
            box-shadow: 0.3rem 0.3rem 0 0.05rem black;
        }

        &.copied {
            background-color: $positive-color;
            color: $background-color;
            border-color: transparent;
        }

        &.active {
            @media (hover: none) {
                background-color: $secondary-color;
                color: $background-color;
                border-color: transparent;
            }
        }

        span {
            margin-left: 0.3em;
        }

        &.email-pill {
            display: grid;

            .email-state {
                grid-area: 1 / 1;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity $transition-base;

                &.visible {
                    opacity: 1;
                }
            }
        }

        @media screen and (max-width: $tablet-breakpoint) {
            font-size: $font-size-base;
        }
        @media screen and (max-width: $mobile-breakpoint) {
            font-size: $font-size-sm;
            padding: 0.35rem 0.6rem;
        }
    }
</style>
