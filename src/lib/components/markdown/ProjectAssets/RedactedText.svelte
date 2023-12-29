<script lang="ts">
    import { randomFromList } from "$lib/utilities/math";
    import { onMount } from "svelte";

    const possibleSymbols = "!@#$%^&*";

    export let length = 1;
</script>
<code>
    {#each new Array(length) as i}
        {randomFromList(possibleSymbols)}
    {/each}
</code>
