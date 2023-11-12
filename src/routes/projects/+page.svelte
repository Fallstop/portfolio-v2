<script lang="ts">
    import ProjectThumbnail from "$lib/components/ProjectThumbnail.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    export let data: import("./$types").PageData;
</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
>
    <div class="project-container">
        <h1 class="page-header">Projects</h1>
        <ul class="project-list">
            {#each data.posts as post}
                <ProjectThumbnail {post} />
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
            max-width: 100vw;
            gap: 2rem;
            box-sizing: border-box;
        }
        @media screen and (max-width: $tablet-breakpoint) {
            padding: 1rem;
            .project-list {
                gap: 1rem;
            }
        }
        @media screen and (max-width: $mobile-breakpoint) {
            padding: 0.5rem;
            .project-list {
                gap: 0.5rem;
                flex-direction: column;
            }
        }
    }
</style>
