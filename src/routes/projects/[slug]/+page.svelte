<script lang="ts">
    import PrimaryLayout from '$lib/components/layout/PrimaryLayout.svelte';
    import { NavigationOption } from '$lib/components/layout/layoutDataStore.js';


	export let data
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<PrimaryLayout navigation_option={NavigationOption.Blog}>
	<article>
		<!-- Title -->
		  <hgroup>
			  <h1>{data.meta.title}</h1>
			  <p>Published at {data.meta.date}</p>
		  </hgroup>
	  
		<!-- Post -->
		  <div class="prose">
			  <svelte:component this={data.content} />
		  </div>
	  </article>
	  
</PrimaryLayout>

