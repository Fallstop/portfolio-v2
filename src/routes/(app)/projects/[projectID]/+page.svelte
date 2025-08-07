<script lang="ts">
	import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
	import { NavigationOption } from "$lib/components/layout/layoutDataStore.js";
    import AuthorsSection from "$lib/components/markdown/AuthorsSection.svelte";
    import CollaboratorSection from "$lib/components/markdown/CollaboratorSection.svelte";
    import LightBoxPage from "$lib/components/markdown/LightBoxPage.svelte";

	let { data } = $props();
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<LightBoxPage/>

<PrimaryLayout
	navigation_option={NavigationOption.Blog}
	fluid_sim_background={false}
	SEOData={{
		type: "post",
		post: data.meta
	}}
>
	<article>
		<!-- Title -->
		<hgroup>
			<h1 class="article-title">{data.meta.title}</h1>
			{#if data.meta.subtitle}
				<span class="subtitle">{data.meta.subtitle}</span>
			{/if}
			<p>
				<AuthorsSection authors={data.meta.authors} /> | 
				Published at {data.meta.date}</p>
		</hgroup>

		<!-- Post -->
		<div class="prose">
			<data.content />
		</div>

		<CollaboratorSection collaborators={data.meta.collaborators} />
	</article>
</PrimaryLayout>

<style lang="scss">
	@use "../../../../variables.scss" as *;

	hgroup {
		margin-bottom: 2rem;

		.article-title {
			margin: 0;
		}
		.subtitle {
			font-size: 1.5rem;
			font-weight: 300;
			color: $hint-color;
		}
	}

	@media screen and (max-width: $tablet-breakpoint) {
		article {
			padding: 1.5rem 1rem;
		}
	}

	@media screen and (max-width: $mobile-breakpoint) {
		article {
			padding: 1.5rem 0rem;
		}
	}
</style>
