---
date: "2021-04-21"
title: "Taiharuru Press Website"
description: "Taiharuru Press Website - Speedrunning a high performance JAM stack website."
tags: ["Software", "Svelte", "Rust"]
collaborators:
 - Jasper M-W
---

<script lang="ts">
    import MarkdownLink from "$md/MarkdownLink.svelte";
</script>

<MarkdownLink href="https://github.com/Fallstop/TaiharuruPress" >Fallstop/TaiharuruPress</MarkdownLink>
<MarkdownLink href="https://taiharuru.co.nz" >Taiharuru Press Website</MarkdownLink>



## Framework

The site used Gatsby, and Remark for the CMS (Much like the site you are looking at now). This is the ideal combo for a mostly static website, with the bonus of being able to be deployed for free to a CDN like cloudflare.

## Development Time

The entire site took around about one day of work, from go ahead to finish, ending up with a fair bit of polish.

## Design

The whole thing is a modified version of [gatsby-starter-morning-dew](https://github.com/maxpou/gatsby-starter-morning-dew), it is a very nice template but I had to convert it from a blog to a book catalog.