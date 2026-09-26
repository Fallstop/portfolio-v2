<script lang="ts">
	import FluidCanvas from "$lib/components/fluidSim/FluidCanvas.svelte";
	import { onMount } from "svelte";

	let inital_splash = $state(1);

	onMount(() => {
		const splashTimer = setInterval(() => {
			inital_splash = 0.001;
			window.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '}));
		}, 3000);
		return () => clearInterval(splashTimer);
	});
</script>

<FluidCanvas
	INTERACTIVE
	DENSITY_DISSIPATION={0}
	SPLAT_FORCE={inital_splash}
	VELOCITY_DISSIPATION={0}
	RANDOM_SPLAT_FORCE={0.001}
	SIM_RESOLUTION={128}
/>

<style lang="scss">
	        :global(.mouse-follow) {
                display: none !important;
        }
</style>
