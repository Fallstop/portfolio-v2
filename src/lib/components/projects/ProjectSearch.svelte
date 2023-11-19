<script lang="ts">
    import type { Post } from "$lib/types";
    import { derived, writable, type Readable } from "svelte/store";
    import Fuse from "fuse.js";

    export let projectList: Post[];

    const fuse = new Fuse(projectList, {
        keys: [
            "title",
            "description",
            "date",
        ]
    });


    let textSearch = writable("");

    export const searchResult: Readable<Post[]> = derived(textSearch,(textSearch)=>{
        let filteredResult = projectList;
        // Start with fuzzy search
        if (textSearch) {
            filteredResult = fuse.search(textSearch).map((result) => result.item);
        }

        return filteredResult
    })


</script>

<div class="search-controller">
    <input bind:value={$textSearch} />
</div>

<style lang="scss">
    .search-controller {
        margin: 2rem 0;
        input {
            width: 100%;
            padding: 0.5rem
        }
    }
</style>