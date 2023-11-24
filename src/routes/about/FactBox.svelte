<script lang="ts">
    import LiveCard from "$lib/components/LiveCard.svelte";

    export let title: string = "";
    export let description: string = "";
</script>

<LiveCard>
    <span class="key">{title}</span>
    <span class="value">{description}</span>
</LiveCard>

<style lang="scss">
    .key {
        font-weight: bold;
        &::after {
            content: ":";
        }
    }
</style>
