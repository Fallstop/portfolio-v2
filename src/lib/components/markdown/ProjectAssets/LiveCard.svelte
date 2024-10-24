<script lang="ts">
    import LiveCard from "$lib/components/LiveCard.svelte";
    interface Props {
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let { ...props }: Props = $props();
</script>

<LiveCard {...props}>{@render props.children?.()}</LiveCard>