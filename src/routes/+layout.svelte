<script lang="ts">
    import "../app.scss";
    import { Code2, User, Sword, Mail } from "lucide-svelte";
    import NavigationButton from "$lib/components/NavigationButton.svelte";

    import {fly} from "svelte/transition";
    import { onMount } from "svelte";
    import FluidCanvas from "$lib/components/fluidSim/FluidCanvas.svelte";

    let firstLoad = false;

    
    let actions = { randomSplats: () => {}, captureScreenShot: () => {} };
    let fluidFPS: number = 1;

    onMount(()=>{
        firstLoad = true;
    });

</script>

<div class="landing-container">
    <div class="content-container">
        <slot/>
    </div>
    {#if firstLoad}
        <div class="navigation-container" in:fly={{x: 100, duration: 500}}>
            <div class="staggered-buttons" >
                <div class="empty" />
                <NavigationButton
                    pageSlug="/projects"
                    title="Projects"
                    icon={Code2}
                    primary
                />
                <NavigationButton pageSlug="/about" title="About" icon={User} />
                <NavigationButton pageSlug="/skills" title="Skills" icon={Sword} />
                <NavigationButton pageSlug="/contact" title="Contact" icon={Mail} />
                <div class="empty"/>
            </div>
        </div>
    {/if}

    {#if firstLoad}
        <img in:fly={{y: 100, duration: 500}} src="/assets/photos/OnlyBelowChinProfileTransparent.webp" class="headshot-photo" alt="Personal Headshot"/>
    {/if}
    <div class="fps-counter">{Math.round(fluidFPS).toString().padStart(3,"0")} FPS</div>
    <FluidCanvas bind:actions bind:FPS={fluidFPS}/>
</div>

<style lang="scss">
    .landing-container {
        padding: 0 calc(5rem - (100vw - 100%)) 0 5rem;
        min-height: 100%;

        color: $text-color;
        display: grid;
        grid-template-columns: 60% 40%;

        @media screen and (max-width: $tablet-breakpoint) {
            grid-template-columns: 1fr;
            padding: 0;
        }

        ::selection {
            background: $text-color; /* WebKit/Blink Browsers */
            color: $background-color;
            -webkit-text-fill-color: $background-color;
        }
        ::-moz-selection {
            background: #000; /* Gecko Browsers */
        }

        .headshot-photo {
            height: 35vh;
            position: fixed;
            right: calc(-1 * (100vw - 100%));
            bottom: 0;
            z-index: -1;

            @media screen and (max-width: $tablet-breakpoint) {
                height: 15vh;
                
            }
        }
        .content-container {
            margin: 5rem 5rem 5rem 0;
            @media screen and (max-width: $tablet-breakpoint) {
                margin: 0;
            }
        }
        .fps-counter {
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            font-size: 2rem;
            padding: 0.5rem;
            background-color: rgba(0,0,0,0.5);
            pointer-events: none;
            user-select: none;
            @include mono-font;
            @media screen and (max-width: $mobile-breakpoint) {
                font-size: 1rem;
                padding: 0.2rem
            }
        }


        .navigation-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: left;
            height: min(100%, 100vh);
            pointer-events: none;
            .staggered-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                grid-gap: 2rem;
                padding: 2rem 0;
            }
            @media screen and (max-width: $tablet-breakpoint) {
                height: auto;
                justify-content: start;
                .staggered-buttons {
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    grid-gap: 1rem;
                    padding: 0 2rem 2rem 2rem;
                    .empty {
                        // Not needed in column layout
                        display: none;
                    }
                }
            }

            @media screen and (max-width: $mobile-breakpoint) {
                .staggered-buttons {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 2rem 2rem 2rem;
                    .empty {
                        // Not needed in column layout
                        display: none;
                    }
                }
            }
        }

    }
</style>
