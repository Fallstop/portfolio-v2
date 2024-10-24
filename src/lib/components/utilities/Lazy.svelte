<script>
	


	import {} from "lucide-svelte";
	let { this: loadComponent, loading, component } = $props();

</script>

{#await loadComponent()}
	{@render loading?.()}
{:then { default: Component }}
	{@render component?.({ Component, })}
{/await}
