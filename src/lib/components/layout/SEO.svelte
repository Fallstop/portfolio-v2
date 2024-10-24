<script lang="ts" module>
    import type { Post } from "$lib/types";

    export interface MainPageSEO {
        title: string;
        description: string;
        image?: string;
        slug: string;
        type: "mainpage" | "profile";
    }

    export interface PostPageSEO {
        post: Post;
        type: "post";
    }

    export type SEOProps = MainPageSEO | PostPageSEO;

    export const ogImageHeight = 630;
    export const ogImageWidth = 1200;
    export const ogImagePadding = 80;

</script>

<script lang="ts">
    interface Props {
        SEOData: SEOProps;
    }

    let { SEOData }: Props = $props();

    const canonicalURL = "https://jmw.nz";
</script>

<svelte:head>
    {#if SEOData?.type == "post"}
        {@const post = SEOData?.post}
        <title>{post.title} - Jasper M-W</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`${canonicalURL}${post.slug}`} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={`${canonicalURL}${post.slug}`} />

        <meta property="og:image" content={`${canonicalURL}${post.slug}/ogimage.png`} />
        <meta property="og:image:width" content={`${ogImageWidth}`} />
        <meta property="og:image:height" content={`${ogImageWidth}`} />
        <meta property="og:image:alt" content={`${post.date} |${post.title} | ${post.description}`} />
        <meta property="og:image:type" content="image/png" />
        
        <meta name="article:published_time" content={post.date} />
        <meta name="article:author" content={`${canonicalURL}/about`} />
        
    {:else}
        <title>{SEOData?.title}</title>
        <meta name="description" content={SEOData?.description} />
        <link rel="canonical" href={`${canonicalURL}${SEOData?.slug}`} />

        <meta property="og:title" content={SEOData?.title} />
        <meta property="og:description" content={SEOData?.description} />
        <meta property="og:image" content={SEOData?.image} />
        <meta property="og:url" content={`${canonicalURL}${SEOData?.slug}`} />

        {#if SEOData?.image}
            <meta property="og:image" content={`${canonicalURL}${SEOData?.image}`} />
        {:else}
            <meta property="og:image" content={`${canonicalURL}${SEOData?.slug}/ogimage.png`} />
        {/if}
        <meta property="og:image:width" content={`${ogImageWidth}`} />
        <meta property="og:image:height" content={`${ogImageWidth}`} />
        <meta property="og:image:type" content="image/png" />

        {#if SEOData?.type == "profile"}
            <meta property="og:type" content="profile" />
            <meta property="profile:first_name" content="Jasper" />
            <meta property="profile:last_name" content="Miller-Waugh" />
            <meta property="profile:username" content="fallstop" />
            
        {:else}
            <meta property="og:type" content="website" />
        {/if}
    {/if}
    <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/>
    <meta name="twitter:card" content="summary_large_image"/>

</svelte:head>