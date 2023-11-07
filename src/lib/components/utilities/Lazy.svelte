<script>
	let loadComponent;
	export { loadComponent as this };


	import {} from "lucide-svelte";

</script>

{#await loadComponent()}
	<slot name="loading" />
{:then { default: Component }}
	<slot name="component" {Component} />
{/await}
