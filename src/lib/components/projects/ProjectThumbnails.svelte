<script lang="ts">
    import type { Post } from "$lib/types";
    import { receive, send } from "$lib/utilities/sendTransition";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    export let posts: Post[];
</script>

{#each posts as post (post.slug)}
    <a
        href={post.slug}
        class="post-wrapper"
        in:send={{ key: post.slug}}
        animate:flip={{duration: 200}}
    >
    <!-- 
        
         -->
        <div
            class="background"
            style="--thumbnail-link: url({post.thumbnail}"
        />
        <li class="post">
            <div class="post-metadata">
                <span class="date">{post.date}</span>
                <h2 class="header">
                    {post.title}
                </h2>
                <p class="description">{post.description}</p>
            </div>
        </li>
    </a>
{/each}

<style lang="scss">
    @use "../../../variables.scss" as *;
    @use "sass:color";
    @use "sass:math";

    .post-wrapper {
        text-decoration: none;
        flex-grow: 1;
        flex-shrink: 1;
        min-width: 200px;
        display: table;
        width: 1%;
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
        border-radius: $border-radius;

        page-break-inside: avoid;
        break-inside: avoid;

        overflow: hidden;

        print-color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;

        .post {
            display: table-cell;
            vertical-align: bottom;
            .post-metadata {
                $feather-size: 3rem;
                padding: calc($feather-size/2 + 1rem) 1rem 1rem 1rem;
                // Gradient fading from transparent to black in padding
                background: linear-gradient(
                    transparent,
                    color.adjust($dark-background-color, $alpha: -0.5)
                        $feather-size
                );
            }
            .header {
                font-size: 2rem;
                color: $dark-text-color;
                white-space: nowrap;

                margin: 0;
            }
            .date {
                font-size: 1.2rem;
                font-weight: bold;
                color: $accent-color;
                @include body-font;
            }
            .description {
                font-size: 1.2rem;
                color: $dark-text-color;
                margin: 0.5rem 0;
            }
            @media screen and (min-width: $chonk-breakpoint) {
                .header {
                    margin-right: 1em;
                }
            }
            @media screen and (max-width: $tablet-breakpoint) {
                .header {
                    font-size: 1.5rem;
                }
                .description {
                    font-size: 1rem;
                }
            }
            @media screen and (max-width: $mobile-breakpoint) {
                .header {
                    white-space: unset;
                }
            }
            
            @media print {
                .header {
                    font-size: 1.5rem;
                }
                .description {
                    font-size: 0.9rem;
                    line-height: 1;
                }
            }
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            transition: all 250ms ease-in-out;
            filter: brightness(0.7);
            border-radius: $border-radius;
            overflow: hidden;

            &::after {
                background-image: var(--thumbnail-link);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.6;
                content: "";
                filter: grayscale(50%);
                transition: all 250ms ease-in-out;
                transform: scale(1.1);
            }
            &::before {
                position: absolute;
                content: "";
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    -45deg,
                    $primary-color,
                    $tint-color,
                    $secondary-color,
                    $accent-color
                );

                $time-delay: math.random() * math.$pi + s;
                animation-delay: calc($time-delay * -1);
                transform: scale(1.1);

                background-size: 400% 400%;
                animation: gradient 10s ease infinite;

                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

            }


        }

        &:hover {
            .background {
                &::before,
                &::after {
                    transform: scale(1);
                }
                &::after {
                    filter: grayscale(0%);
                    opacity: 1;
                }
            }
        }

        @media print {
            aspect-ratio: unset;
        }
    }

    @media screen and (max-width: $mobile-breakpoint) {
        .post-wrapper {
            width: 100%;
        }
    }
</style>
