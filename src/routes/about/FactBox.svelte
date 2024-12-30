<script lang="ts">
    import LiveCard from "$lib/components/LiveCard.svelte";

    interface Props {
        title?: string;
        description?: string;
    }

    let { title = "", description = "" }: Props = $props();
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
