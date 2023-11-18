<script lang="ts">
    import ProjectThumbnails from "$lib/components/projects/ProjectThumbnails.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import ProjectSearch from "$lib/components/projects/ProjectSearch.svelte";
    import type { Post } from "$lib/types";
    import type { Readable } from "svelte/store";
    import { receive, send } from "$lib/utilities/sendTransition";
    import { flip } from "svelte/animate";
    export let data: import("./$types").PageData;

    let projectSearchResult: Readable<Post[]>;
</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
>
    <div class="project-container">
        <h1 class="page-header">Projects</h1>
        <ProjectSearch projectList={data.posts} bind:searchResult={projectSearchResult} />
        <ul class="project-list">
            {#if $projectSearchResult}
                <ProjectThumbnails posts={$projectSearchResult}/>
            {/if}
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
