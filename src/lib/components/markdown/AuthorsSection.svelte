<script lang="ts">
    import { getPersonDetails } from "$lib/utilities/getPeopleDetails";

    export let authors: string[] = ["Jasper M-W"];
</script>
By
{#each authors as author, i}
    {@const authorData = getPersonDetails(author)}
    {@const namePunctuation = i===authors.length-1 ? "" : i===authors.length-2 ? ", and " : ", "}
    {#if authorData.homepage}
        <a href={authorData.homepage} target="_blank">{authorData.name}</a>{namePunctuation}
    {:else}
        {authorData.name}{namePunctuation}
    {/if}
{/each}