<script lang="ts">
    import { getPersonDetails } from "$lib/utilities/getPeopleDetails";
    import LiveCard from "../utilities/LiveCard.svelte";

    interface Props {
        collaborators: string[];
        footer?: boolean;
    }

    let { collaborators, footer = false }: Props = $props();
</script>

{#if collaborators && collaborators.length > 0}
    <div class="collaborators" class:footer>
        <h3>Team</h3>
        <ul>
            {#each collaborators as collaborator}
                {@const authorData = getPersonDetails(collaborator)}
                <li>
                    {#if authorData.homepage}
                        <!-- <a class="name" href={authorData.homepage} target="_blank">
                            {authorData.name}
                        </a> -->
                        <LiveCard type="link" size="small" href={authorData.homepage} target="_blank" title={authorData.name} >
                                {authorData.name}
                        </LiveCard>
                    {:else}
                        <LiveCard type="none" size="small" title={authorData.name} >
                                {authorData.name}
                        </LiveCard>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style lang="scss">
    @use "../../../variables.scss" as *;
    .collaborators {
        h3 {
            margin: 0 0 $space-xs 0;
            font-size: $font-size-sm;
            font-weight: $font-weight-semibold;
            color: $hint-color;
            text-transform: uppercase;
            letter-spacing: $letter-spacing-wide;
        }

        ul {
            display: flex;
            flex-wrap: wrap;
            gap: $space-xs;
            padding: 0;
            margin: 0;
            li {
                margin: 0;
                padding: 0;
                list-style: none;
            }
        }

        &.footer {
            margin-top: $space-md;
            padding-top: $space-sm;
            border-top: 1px solid $mid-tone;
        }
    }
</style>
