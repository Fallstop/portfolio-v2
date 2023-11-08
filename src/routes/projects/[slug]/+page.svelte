<script lang="ts">
	import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
	import { NavigationOption } from "$lib/components/layout/layoutDataStore.js";

	export let data;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<PrimaryLayout
	navigation_option={NavigationOption.Blog}
	fluid_sim_background={false}
>
	<article>
		<!-- Title -->
		<hgroup>
			<h1>{data.meta.title}</h1>
			<p>
				{#if data.meta.authors}
				By
				{/if}
				{#each data.meta.authors ?? [] as author}
					{author}
					{#if author !== data.meta.authors[data.meta.authors.length - 1]}, {/if}
				{/each}
				Published at {data.meta.date}</p>
		</hgroup>

		<!-- Post -->
		<div class="prose">
			<svelte:component this={data.content} />
		</div>
	</article>
</PrimaryLayout>

<style lang="scss">
	@use "../../../variables.scss" as *;
	@media screen and (max-width: $tablet-breakpoint) {
		article {
			padding: 1.5rem 1rem;
		}
	}
</style>
