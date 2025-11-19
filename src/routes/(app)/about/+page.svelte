<script lang="ts">
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";

    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import { birthdate } from "./getPersonalDetails";
    import FactBox from "./FactBox.svelte";
    import { formatDate, getYearsFrom } from "$lib/utilities/dates";
    import ProjectThumbnails from "$lib/components/projects/ProjectThumbnails.svelte";
    import MoreProjectsThumbnail from "$lib/components/projects/MoreProjectsThumbnail.svelte";

    interface Props {
        data: import("./$types").PageData;
    }

    let { data }: Props = $props();
</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
    SEOData={{
        type: "profile",
        title: "Jasper M-W | About Me",
        description: `I'm a second-year Computer Systems Engineering student at University of Auckland, who's spent the last ${getYearsFrom("2019")} years building random projects in my spare time.`,
        slug: "/about",
    }}
>
    <div class="content">
        <h1 class="page-header">Kia ora, I'm Jasper&nbsp;M-W.</h1>
        <h3>
            I'm a second-year Computer Systems Engineering student at University
            of Auckland, who's spent the last {getYearsFrom("2019")} years building
            random projects in my spare time.
        </h3>
        <p>
            I work as a full-full stack developer, my projects range from
            creating custom circuit-boards to designing bespoke websites. I like
            to think of myself as a jack of all trades, master of <i>some</i>.
        </p>

        <div class="fact-container">
            <FactBox
                title="Unusable CV Booster"
                description="I was the 2023 Head Boy of Huanui College"
            />
            <FactBox
                title="Age"
                description={getYearsFrom(birthdate).toString()}
            />
            {#if Math.random() > 0.9}
                <FactBox
                    title="Current Location"
                    description="Inside of your walls"
                />
            {:else}
                <FactBox title="Location" description="Auckland, New Zealand" />
            {/if}
            <FactBox title="Best Frontend Framework" description="Sveltekit" />
            {#if data.github.lastUpdatedAboutDetails}
                <FactBox
                    title="Last Website Update"
                    description={formatDate(
                        data.github.lastUpdatedAboutDetails,
                    )}
                />
            {/if}
            <FactBox
                title="Favourite Programming Language"
                description="Rust"
            />
            <FactBox title="Servers in basement" description="5" />
            <FactBox title="Camera" description="Sony a 7II" />
            {#if data.github.totalRepoCount !== null}
                <FactBox
                    title="Github Repo Count"
                    description={data.github.totalRepoCount?.toString()}
                />
            {/if}
            {#if data.github.total_starred_repos !== null}
                <FactBox
                    title="Starred Repositories"
                    description={data.github.total_starred_repos?.toString()}
                />
            {/if}
            <FactBox
                title="Last poor financial decision"
                description={formatDate(new Date(Date.now() - 60 * 60 * 24))}
            />
            <FactBox title="BrainF*ck Interpreters Developed" description="8" />
            <FactBox
                title="Tasks Pointlessly Automated"
                description="Uncountable"
            />
            <FactBox title="Pronouns" description="He/Him" />
            <FactBox title="Rockets Fired" description="2" />

            <FactBox title="Books Published" description="1" />
        </div>

        <h2>Highlighted Projects</h2>
        <div class="project-marquee-container">
            <div class="project-marquee-inner large-scrollbar">
                <ProjectThumbnails posts={data.postsHighlighted} />
                <MoreProjectsThumbnail />
            </div>
            <div class="mask-overlay"></div>
        </div>
    </div>
</PrimaryLayout>

<style lang="scss">
    @use "../../../variables.scss" as *;
    .content {
        @media screen and (max-width: $tablet-breakpoint) {
            padding-left: $space-sm;
            padding-right: $space-sm;
            padding-bottom: calc(var(--headshot-height) + $space-md);
        }
        @media screen and (max-width: $mobile-breakpoint) {
            padding-left: $space-xs;
            padding-right: $space-xs;
        }
    }

    .fact-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: $space-sm;
        padding: $space-sm 0;
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
            }

            flex-direction: row;
            gap: $space-sm;
            // animation: tilesMarquee 5s linear infinite forwards;
            // width: calc(100% + 2em);

            padding: $space-sm;

            overflow-x: scroll;
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

    h2 {
        margin-top: $space-sm;
    }
</style>
