<script lang="ts">
    import LandingInfoBoxes from "$lib/components/LandingInfoBoxes.svelte";
import {Code2, User, Sword, Mail } from "lucide-svelte";
</script>

<div class="landing-container">
    <h1 class="name-title">Jasper M-W</h1>
    <div class="navigation-container">
        <div class="staggered-buttons">
            <div></div>
            <a href="#projects">
                <div class="navigation-button">
                    <Code2 size="0.9em"/>
                    <span class="button-title">
                        Projects
                    </span>
                </div>
            </a>
            <a href="#aboutme">
                <div class="navigation-button">
                    <User size="0.9em"/>
                    <span class="button-title">
                        About
                    </span>
                </div>
            </a>
            <a href="#skills">
                <div class="navigation-button">
                    <Sword size="0.9em"/>
                    <span class="button-title">
                        Skills
                    </span>
                </div>
            </a>
            <a href="#contact">
                <div class="navigation-button">
                    <Mail size="0.9em"/>
                    <span class="button-title">
                        Contact
                    </span>
                </div>
            </a>
            <div></div>
        </div>    
    </div>
    <!-- <img src="/assets/photos/OnlyBelowChin.webp" class="headshot-photo" alt="Personal Headshot"/> -->
</div>
<div class="dark-container">
    <LandingInfoBoxes/>
</div>

<style lang="scss">
    @use "../variables.scss" as *;
    .landing-container {
        padding: 0 5rem;
        box-sizing: border-box;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        color: $light-text-color;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        ::selection {
            background: $light-text-color; /* WebKit/Blink Browsers */
            color: $light-background-color;
            -webkit-text-fill-color: $light-background-color;
        }
        ::-moz-selection {
            background: #000; /* Gecko Browsers */
        }

        

        &::before, &::after {
            content: "";
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }
        &::before {
            background-color: $light-background-color;
            z-index: -1;
        }
        &::after {
            background: url("/assets/photos/OnlyBelowChin.webp") no-repeat right bottom fixed;
            background-size: 40vh;
            z-index: -1;
        }

        .headshot-photo {
            height: 40vh;
            position: absolute;
            right: 0;
            bottom: 0;
        }
        .name-title {
            font-size: 25rem;
            line-height: 1;
            width: min-content;
            margin: 0;
            padding: 0;
            background: linear-gradient(-45deg, $primary-color, $tint-color, $secondary-color, $accent-color);
            background-size: cover;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .navigation-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .staggered-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-gap: 2rem;
            padding: 2rem 0;
            a {
                text-decoration: none;
                .navigation-button {
                    color: $light-text-color;
                    padding: 1rem;
                    font-size: 3rem;
                    border: 1px solid $light-text-color;
                    box-shadow: 0 0 0 0 black;
                    transition: all 250ms ease-in-out;
                    &:hover {
                        background-color: $tint-color;
                        color: $text-color;
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
        }
    }
    .dark-container {
        background-color: $background-color;
    }
</style>