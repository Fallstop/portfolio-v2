<script lang="ts">
	import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
	import { NavigationOption } from "$lib/components/layout/layoutDataStore.js";
    import AuthorsSection from "$lib/components/markdown/AuthorsSection.svelte";
    import CollaboratorSection from "$lib/components/markdown/CollaboratorSection.svelte";
    import LightBoxPage from "$lib/components/markdown/LightBoxPage.svelte";
    import { getPersonDetails } from "$lib/utilities/getPeopleDetails";

	let { data } = $props();
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	{#if data.meta.authors}
		{#each data.meta.authors as author}
			{@const authorData = getPersonDetails(author)}
			<meta property="article:author" content={authorData.homepage ?? authorData.name} />
		{/each}
	{/if}
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
		</hgroup>

		<!-- Project Metadata -->
		<div class="project-meta">
			<div class="meta-group">
				<div class="meta-section">
					<h3>Date</h3>
					<p>{data.meta.date}</p>
				</div>
				<div class="meta-section">
					<h3>Written by</h3>
					<p><AuthorsSection authors={data.meta.authors} /></p>
				</div>
			</div>
			{#if !data.meta.hideTopTeam}
				<CollaboratorSection collaborators={data.meta.collaborators} />
			{/if}
		</div>

		<!-- Post -->
		<div class="prose">
			<data.content />
		</div>

		<!-- Team at bottom too -->
		<CollaboratorSection collaborators={data.meta.collaborators} footer />
	</article>
</PrimaryLayout>

<style lang="scss">
	@use "../../../../variables.scss" as *;

	hgroup {
		margin-bottom: $space-xs;

		.article-title {
			margin: 0;
		}
		.subtitle {
			font-size: $font-size-lg;
			font-weight: 300;
			color: $hint-color;
		}
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		margin-bottom: $space-md;
		padding-bottom: $space-sm;
		border-bottom: 1px solid $mid-tone;

		.meta-group {
			display: flex;
			flex-wrap: wrap;
			gap: $space-sm $space-lg;
		}

		.meta-section {
			h3 {
				margin: 0 0 $space-xs 0;
				font-size: $font-size-sm;
				font-weight: $font-weight-semibold;
				color: $hint-color;
				text-transform: uppercase;
				letter-spacing: $letter-spacing-wide;
			}

			p {
				margin: 0;
			}
		}
	}

	@media screen and (max-width: $tablet-breakpoint) {
		article {
			padding: $space-smd $space-sm;
		}
	}

	@media screen and (max-width: $mobile-breakpoint) {
		article {
			padding: $space-smd 0;
		}
	}
</style>
