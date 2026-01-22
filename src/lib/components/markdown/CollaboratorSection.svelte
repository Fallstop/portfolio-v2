<script lang="ts">
    import { getPersonDetails } from "$lib/utilities/getPeopleDetails";
  import LiveCard from "../utilities/LiveCard.svelte";

    interface Props {
        collaborators: string[];
    }

    let { collaborators }: Props = $props();
</script>

{#if collaborators && collaborators.length > 0}
    <div class="collaborators">
        <h2>Collaborators</h2>
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
        margin-top: $space-md;
        padding-top: $space-sm;

        h2 {
            margin-bottom: 0;
        }

        border-top: 1px solid $mid-tone;
        ul {
            display: block;
            padding: 0;
            margin: 0;
            li {
                margin: 0;
                padding: 0;
                list-style: none;
                display: inline-block;
                padding-top: $space-xs;
                padding-right: $space-xs;

                a {
                    box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
                    transition: box-shadow $transition-base;

                    font-weight: $font-weight-bold;
                    color: $text-color;
                    text-decoration: none;

                    @include icon-inline;

                    &:hover {
                        box-shadow: 0 0 $space-xs rgba(0, 0, 0, 0.5);
                    }
                }
                span {
                    border: 1px solid $mid-tone;
                }
            }
        }
    }
</style>
