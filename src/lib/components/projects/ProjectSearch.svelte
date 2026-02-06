<script lang="ts">
    import type { Post } from "$lib/types";
    import Fuse from "fuse.js";
    import LiveCard from "../utilities/LiveCard.svelte";
    import { normaliseCase, toProperCase } from "$lib/utilities/string";
    import { tagCase } from "./tags";
    import { Search } from "lucide-svelte";

    interface Props {
        projectList: Post[];
        onSearchResult: (result: Post[]) => void;
    }

    let { projectList, onSearchResult }: Props = $props();

    const tagNumShownMobile = 10;

    // Find all tags, and count how many times they appear
    let allTagReferences = $derived(
        projectList
            .flatMap((post) => post.tags.map(normaliseCase))
            .filter((tag) => tag)
            .reduce(
                (cnt, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
                {} as Record<string, number>,
            ),
    );

    // Sort by most common
    let allTags = $derived(
        Object.entries(allTagReferences)
            .sort((a, b) => b[1] - a[1])
            .map((tag) => tag[0]),
    );

    let selectedTag = $state<string | null>(null);

    function toggleTag(tag: string) {
        if (selectedTag === tag) {
            selectedTag = null;
        } else {
            selectedTag = tag;
        }
    }

    const fuse = $derived(new Fuse(projectList, {
        keys: ["title", "description", "date"],
    }));

    let textSearch = $state("");

    

    const searchResult: Post[] = $derived.by(() => {
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
    });

    $effect(() => {
        onSearchResult(searchResult);
    });


    
</script>

<div class="search-controller">
    <div class="tag-selector">
        <div class="input-wrapper">
            <LiveCard size="wrap grow">
                <div class="input-container">
                    <Search size="1rem" />
                    <input bind:value={textSearch} placeholder="Search" />
                </div>
            </LiveCard>
        </div>
        {#each allTags as tag, i}
            <LiveCard
                tabbable
                size="small"
                hidden={i >= tagNumShownMobile ? "hidden-mobile" : "visible"}
                onClick={() => {
                    toggleTag(tag);
                }}
                highlighted={selectedTag === tag}
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
