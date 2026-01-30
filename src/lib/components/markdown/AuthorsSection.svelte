<script lang="ts">
    import { getPersonDetails } from "$lib/utilities/getPeopleDetails";

    interface Props {
        authors?: string[];
    }

    let { authors = ["Jasper M-W"] }: Props = $props();
</script>
{#each authors as author, i}
    {@const authorData = getPersonDetails(author)}
    {@const namePunctuation = i===authors.length-1 ? "" : i===authors.length-2 ? ", and " : ", "}
    {#if authorData.homepage}
        <a href={authorData.homepage} class="link" target="_blank">{authorData.name}</a>{namePunctuation}
    {:else}
        {authorData.name}{namePunctuation}
    {/if}
{/each}

<style lang="scss">
    @use "../../../variables.scss" as *;

    .link {
        color: $text-color
    }
</style>