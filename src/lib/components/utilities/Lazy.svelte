<script lang="ts">
	type T = $$Generic;
	interface Props {
		loading?: import('svelte').Snippet;
		component?: import('svelte').Snippet<[{ Component: T }]>;
		this: ()=>Promise<{ default: T }>;
	}


	let { this: loadComponent, loading = undefined, component }: Props = $props();
</script>

{#await loadComponent()}
	{@render loading?.()}
{:then { default: Component }}
	{@render component?.({ Component, })}
{/await}
