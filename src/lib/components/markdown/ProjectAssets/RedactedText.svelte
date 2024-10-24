<script lang="ts">
    import { randomFromList } from "$lib/utilities/math";
    import { onMount } from "svelte";

    const possibleSymbols = "!@#$%^&*";

    interface Props {
        length?: number;
    }

    let { length = 1 }: Props = $props();
</script>
<code>
    {#each new Array(length) as i}
        {randomFromList(possibleSymbols)}
    {/each}
</code>
