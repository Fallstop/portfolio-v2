<script lang="ts">
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    export let data: import("./$types").PageData;
</script>

<PrimaryLayout fluid_sim_background>
    <div class="project-container">
        <h1>Projects</h1>
        <ul class="project-list">
            {#each data.posts as post}
                <a href={post.slug} class="post-wrapper">
                    <div
                        class="background"
                        style="--thumbnail-link: url({post.thumbnail}"
                    />
                    <li class="post">
                        <div class="post-metadata">
                            <h2 class="header">
                                <span>{post.title}</span>
                                <span class="date">{post.date}</span>
                            </h2>
                            <p class="description">{post.description}</p>
                        </div>
                    </li>
                </a>
            {/each}
        </ul>
    </div>
</PrimaryLayout>

<style lang="scss">
    @use "../../variables.scss" as *;
    @use "sass:color";
    @use "sass:math";
    $max-projects: 100;

    .project-container {
        .project-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-items: stretch;
            width: 100%;
            gap: 2rem;
            a {
                text-decoration: none;
                flex-grow: 1;
                flex-shrink: 1;
                min-width: 100px;
                display: table;
                width: 1%;
                border: 1px solid $text-color;
                position: relative;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 1rem;

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
                        font-weight: bold;
                        text-decoration: none;
                        color: $dark-text-color;
                        white-space: nowrap;
                        margin: 0;

                    }
                    .date {
                        font-size: 1.2rem;
                        color: $accent-color;
                        @include body-font;
                    }
                    .description {
                        font-size: 1.2rem;
                        color: $dark-text-color;
                        margin: 0.5rem 0;
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
                    transform: scale(1.1);

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
                        opacity: 0.7;
                        content: "";
                        filter: grayscale(50%);
                        transition: all 250ms ease-in-out;

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
                        transform: scale(1);

                        &::after {
                            filter: grayscale(0%);
                            opacity: 1;
                        }
                    }
                }
            }
            @for $i from 1 through 100 {
                .post-wrapper:nth-of-type(#{$i}) {
                    .background {
                        &::before {
                            $time-delay: random() * math.$pi + s;
                            animation-delay: calc($time-delay * -1);
                        }
                    }
                }
            }

            // @media screen and (max-width: $tablet-breakpoint) {
            //     a {
            //         flex-basis: 50%;
            //         max-width: 100vw;
            //     }
                
            // }
        }
    }
</style>
