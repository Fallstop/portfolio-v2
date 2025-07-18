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
    .collaborators {
        margin-top: 2rem;
        padding-top: 1rem;

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
                padding-top: 0.5rem;
                padding-right: 0.5rem;

                a {
                    // background-color: $mid-tone;
                    box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
                    transition: box-shadow 0.2s ease-in-out;

                    font-weight: bold;
                    color: $text-color;
                    text-decoration: none;
                    color: $text-color;

                    :global(svg) {
                        height: 1.3em;
                        max-width: 1.3em;
                        display: inline;
                        vertical-align: text-top;
                    }
                    &:hover {
                        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
                    }
                }
                span {
                    border: 1px solid $mid-tone;
                }
            }
        }
    }
</style>
