<script lang="ts">
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";

    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import { getAge } from "./getPersonalDetails";
    import FactBox from "./FactBox.svelte";
    import { formatDate } from "$lib/utilities/dates";
    import ProjectThumbnail from "$lib/components/ProjectThumbnail.svelte";

    export let data: import("./$types").PageData;
</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
>
    <div class="content">
        <h1>Kia ora, I'm Jasper M-W.</h1>
        <h3>
            I'm a high schooler at Huanui College, who's spent the last 3 years
            building random projects in my spare time.
        </h3>
        <p>
            I work as a full-full stack developer, my projects range from
            creating custom circuit-boards to designing bespoke websites. I like
            to think of myself as a jack of all trades, master of <i>some</i>.
        </p>

        <div class="fact-container">
            <FactBox
                title="Unusable CV Booster"
                description="I'm the 2023 Head Boy of Huanui College"
            />
            <FactBox title="Age" description={getAge().toString()} />
            {#if Math.random() > 0.9}
                <FactBox
                    title="Current Location"
                    description="Inside of your walls"
                />
            {:else}
                <FactBox
                    title="Location"
                    description="Whangarei, New Zealand"
                />
            {/if}
            <FactBox title="Best frontend framework" description="Sveltekit" />
            {#if data.github.lastUpdatedAboutDetails}
                <FactBox
                    title="Last Update This Section"
                    description={formatDate(
                        data.github.lastUpdatedAboutDetails
                    )}
                />
            {/if}
            <FactBox
                title="Favourite Programming Language"
                description="Rust"
            />
            <FactBox title="Severs in basement" description="5" />
            <FactBox title="Camera" description="Sony a 7II" />
            <FactBox title="BrainF*ck Interpreters Developed" description="8" />
            <FactBox
                title="Tasks pointlessly automated"
                description="Uncountable"
            />
            <FactBox
                title="Github Repo Count"
                description={data.github.totalRepoCount.toString()}
            />
            <FactBox title="Books Published" description="1" />
        </div>

        <h2>Projects</h2>
        <div class="project-marquee-container">
            <div class="project-marquee-inner large-scrollbar">
                {#each data.postsHighlighted as post}
                    <ProjectThumbnail {post} />
                {/each}
                <a href="/projects" class="more-projects">
                    <span class="more-header">More Projects</span>
                </a>
            </div>
            <div class="mask-overlay" />
        </div>
    </div>
</PrimaryLayout>

<style lang="scss">
    @use "../../variables.scss" as *;
    .content {
        @media screen and (max-width: $tablet-breakpoint) {
            padding-left: 1rem;
            padding-right: 1rem;
            .project-list {
                gap: 1rem;
            }
        }
        @media screen and (max-width: $mobile-breakpoint) {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
        }
        padding-bottom: calc(var(--headshot-height) + 2rem);
    }
    h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }
    .fact-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
    }
    .project-marquee-container {
        position: relative;
        overflow: hidden;

        mask-image: linear-gradient(
                90deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(255, 255, 255, 0) calc(0% + 1em),
                rgba(255, 255, 255, 0) calc(100% - 1em),
                rgba(255, 255, 255, 1) 100%
            );
        -webkit-mask-image: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 1) calc(0% + 1em),
                rgba(255, 255, 255, 1) calc(100% - 1em),
                rgba(255, 255, 255, 0) 100%
            );


        .project-marquee-inner {
            display: flex;
            scroll-snap-type: x mandatory;
            scroll-padding: 50%;


            & > :global(*) {
                scroll-snap-align: center;
                aspect-ratio: unset;
                max-width: 60vw;
                :global(.post) {
                }
            }

            flex-direction: row;
            gap: 1rem;
            margin-top: 1rem;
            // animation: tilesMarquee 5s linear infinite forwards;
            // width: calc(100% + 2em);

            padding: 1rem;

            overflow-x: scroll;

            .more-projects {
                
                text-decoration: none;
                flex-grow: 1;
                flex-shrink: 1;
                min-width: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 4px dashed $mid-tone;
                border-radius: 1rem;
                color: $mid-tone;
                font-size: 2rem;
                font-weight: bold;
                text-align: center;
                text-transform: uppercase;
                transition: all 0.2s ease-in-out;
                &:hover {
                    border-color: $text-color;
                    color: $text-color;
                }
            }
        }

        @keyframes tilesMarquee {
            0% {
                transform: translateX(0%);
            }
            100% {
                transform: translateX(-100%);
            }
        }

        .mask-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            // background: linear-gradient(
            //     90deg,
            //     rgba(255, 255, 255, 1) 0%,
            //     rgba(255, 255, 255, 0) calc(0% + 1em),
            //     rgba(255, 255, 255, 0) calc(100% - 1em),
            //     rgba(255, 255, 255, 1) 100%
            // );
            pointer-events: none;
        }
    }
</style>
