<script lang="ts" module>
    import type { Post } from "$lib/types";
    import Fuse from "fuse.js";
    import { normaliseCase } from "$lib/utilities/string";

    /** Pure so the page can derive results during prerendering, not just after hydration */
    export function searchProjects(projectList: Post[], textSearch: string, selectedTag: string | null): Post[] {
        let filteredResult = projectList;

        // Start with fuzzy search
        if (textSearch) {
            const fuse = new Fuse(projectList, {
                keys: ["title", "description", "date"],
            });
            filteredResult = fuse.search(textSearch).map((result) => result.item);
        }

        if (selectedTag) {
            filteredResult = filteredResult.filter((post) => {
                return post.tags.map(normaliseCase).includes(selectedTag);
            });
        }

        return filteredResult;
    }
</script>

<script lang="ts">
    import LiveCard from "../utilities/LiveCard.svelte";
    import { toProperCase } from "$lib/utilities/string";
    import { tagCase } from "./tags";
    import { Search } from "@lucide/svelte";

    interface Props {
        projectList: Post[];
        textSearch?: string;
        selectedTag?: string | null;
    }

    let { projectList, textSearch = $bindable(""), selectedTag = $bindable(null) }: Props = $props();

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

    function toggleTag(tag: string) {
        if (selectedTag === tag) {
            selectedTag = null;
        } else {
            selectedTag = tag;
        }
    }

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
                color-scheme: light;
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
