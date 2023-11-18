<script lang="ts">
    import type { Post } from "$lib/types";
    import { derived, writable, type Readable } from "svelte/store";

    export let projectList: Post[];


    let textSearch = writable("");

    export const searchResult: Readable<Post[]> = derived(textSearch,(textSearch)=>{
        let filteredResult = projectList;

        if (textSearch) {
            filteredResult = filteredResult.filter((x: Post)=>{
                let textBlurb = x.date+x.description+x.title+x.summary;
                return textBlurb.toLowerCase().includes(textSearch.toLowerCase())
            });
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