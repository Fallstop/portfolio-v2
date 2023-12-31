<script lang="ts">
    import type { Post } from "$lib/types";
    import { derived, writable, type Readable } from "svelte/store";
    import Fuse from "fuse.js";
    import LiveCard from "../LiveCard.svelte";
    import { normaliseCase, toProperCase } from "$lib/utilities/string";
    import { tagCase } from "./tags";
    import { Search } from "lucide-svelte";

    export let projectList: Post[];

    const tagNumShownMobile = 10;

    // Find all tags, and count how many times they appear
    $: allTagReferences = projectList
        .flatMap((post) => post.tags.map(normaliseCase))
        .filter((tag) => tag)
        .reduce(
            (cnt, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
            {} as Record<string, number>,
        );

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
        keys: ["title", "description", "date"],
    });

    let textSearch = writable("");

    export const searchResult: Readable<Post[]> = derived(
        [textSearch, selectedTag],
        ([textSearch, selectedTag]) => {
            let filteredResult = projectList;

            // Start with fuzzy search
            if (textSearch) {
                filteredResult = fuse
                    .search(textSearch)
                    .map((result) => result.item);
            }

            if (selectedTag) {
                filteredResult = filteredResult.filter((post) => {
                    return post.tags.map(normaliseCase).includes(selectedTag);
                });
            }

            return filteredResult;
        },
    );
</script>

<div class="search-controller">
    <div class="tag-selector">
        <div class="input-wrapper">
            <LiveCard size="wrap grow">
                <div class="input-container">
                    <Search size="1rem" />
                    <input bind:value={$textSearch} placeholder="Search" />
                </div>
            </LiveCard>
        </div>
        {#each allTags as tag, i}
            <LiveCard
                tabbable
                size="small"
                hidden={i>=tagNumShownMobile ? "hidden-mobile" : "visible"}
                on:click={() => {
                    toggleTag(tag);
                }}
                highlighted={$selectedTag === tag}
                title={`${allTagReferences[tag]}`}
            >
                {tagCase(tag)}
            </LiveCard>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "../../../variables.scss" as *;
    .search-controller {
        $spacing: 1rem;
        margin-bottom: $spacing * 2;
        .input-wrapper {
            width: 50%;
            @media screen and (max-width: $mobile-breakpoint) {
                width: 100%;
            }
        }

        .input-container {
            // border-radius: $border-radius;
            // border: black solid 1px;

            display: flex;
            align-items: center;

            // min-width: ;
            input {
                flex-grow: 1;
                border: none;
                padding: $spacing * 0.5;
                &:focus {
                    outline: none;
                }
                background: none;
            }
            // Search Icon
            :global(svg) {
                margin-left: $border-radius;
            }
        }

        .tag-selector {
            display: flex;
            flex-wrap: wrap;
            gap: $spacing * 0.5;
            margin-top: $spacing;
        }
    }
</style>
