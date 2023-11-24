<script lang="ts">
    import type { Post } from "$lib/types";
    import { derived, writable, type Readable } from "svelte/store";
    import Fuse from "fuse.js";
    import LiveCard from "../LiveCard.svelte";
    import { normaliseCase, toProperCase } from "$lib/utilities/string";

    export let projectList: Post[];

    // Find all tags, and count how many times they appear
    $: allTagReferences = projectList
        .flatMap((post) => post.tags.map(normaliseCase))
        .filter((tag) => tag)
        .reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {} as Record<string,number>);
    
    // Sort by most common
    $: allTags = Object.entries(allTagReferences)
        .sort((a, b) => b[1] - a[1])
        .map((tag) => tag[0]);

    let selectedTag = writable<string | null>(null);

    function toggleTag(tag: string) {
        if ($selectedTag === tag) {
            $selectedTag = null;
        } else {
            $selectedTag = tag;
        }
    }

    const fuse = new Fuse(projectList, {
        keys: [
            "title",
            "description",
            "date",
        ]
    });


    let textSearch = writable("");

    export const searchResult: Readable<Post[]> = derived([textSearch,selectedTag],([textSearch, selectedTag])=>{
        let filteredResult = projectList;

        // Start with fuzzy search
        if (textSearch) {
            filteredResult = fuse.search(textSearch).map((result) => result.item);
        }

        if (selectedTag) {
            filteredResult = filteredResult.filter((post) => {
                return post.tags.map(normaliseCase).includes(selectedTag);
            });
        }

        return filteredResult
    })


</script>

<div class="search-controller">
    <input bind:value={$textSearch} placeholder="Search" />
    <div class="tag-selector">
        {#each allTags as tag}
            <LiveCard tabbable size="small" on:click={()=>{toggleTag(tag)}} highlighted={$selectedTag === tag} title={`${allTagReferences[tag]}`}>
                {tag}
            </LiveCard>
        {/each}
    </div>
</div>

<style lang="scss">
    .search-controller {
        $spacing: 1rem;
        margin-bottom: $spacing * 2;
        input {
            width: 100%;
            padding: $spacing * 0.5;
        }

        .tag-selector {
            display: flex;
            flex-wrap: wrap;
            gap: $spacing * 0.5;
            margin-top: $spacing;
        }
    }
</style>