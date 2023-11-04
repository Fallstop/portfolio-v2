<script>

	let loadComponent;
	export { loadComponent as this }
</script>


  {#await loadComponent()}
		<slot name="loading"></slot>
	{:then { default: Component }}
		<slot name="component" {Component} />
	{/await}
