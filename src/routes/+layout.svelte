<script lang="ts">
    import "../app.scss";
    import { Code2, User, Sword, Mail } from "lucide-svelte";
    import NavigationButton from "$lib/components/NavigationButton.svelte";

    import {fly} from "svelte/transition";
    import { onMount } from "svelte";

    let firstLoad = false;

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
                <div />
                <NavigationButton
                    pageSlug="/projects"
                    title="Projects"
                    icon={Code2}
                />
                <NavigationButton pageSlug="/about" title="About" icon={User} />
                <NavigationButton pageSlug="/skills" title="Skills" icon={Sword} />
                <NavigationButton pageSlug="/contact" title="Contact" icon={Mail} />
                <div />
            </div>
        </div>
    {/if}

    {#if firstLoad}
        <img in:fly={{y: 100, duration: 500}} src="/assets/photos/OnlyBelowChinSMALLL.webp" class="headshot-photo" alt="Personal Headshot"/>
    {/if}
</div>

<style lang="scss">
    .landing-container {
        padding: 0 calc(5rem - (100vw - 100%)) 0 5rem;
        min-height: 100vh;

        color: $text-color;
        display: grid;
        grid-template-columns: 60% 40%;

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
        }
        .content-container {
            margin: 5rem 5rem 5rem 0;
        }
        .navigation-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: left;
            height: 100vh;
        }

        .staggered-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-gap: 2rem;
            padding: 2rem 0;
        }
    }
</style>
