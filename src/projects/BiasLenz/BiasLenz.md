---
date: "2023-08-21"
title: "BiasLenz Govhack"
description: "Govhack 2023 Entry - Media bias detection using the power of AI"
collaborators:
 - Jasper M-W
 - Taine Reader
 - Ara Bartlett
 - Leya Stow
 - Carolyn
tags: ["Software", "Svelte", "Python", "GovHack", "48 Hours"]
---

<script>
  import MarkdownLink from "$md/MarkdownLink.svelte";
  import YoutubeEmbed from "$md/YoutubeEmbed.svelte";
</script>



<MarkdownLink href="https://2023.hackerspace.govhack.org/projects/biaslenz">Govhack Project</MarkdownLink>
<MarkdownLink href="https://biaslenz.qrl.nz/">biaslenz.qrl.nz</MarkdownLink>
<MarkdownLink href="https://github.com/Questionable-Research-Labs/govhack-23">Questionable-Research-Labs/govhack-23</MarkdownLink>
<MarkdownLink href="https://youtu.be/Q2H69tJGbvY">Presentation Video</MarkdownLink>


![:borderless:small](./logo-text.svg)



<YoutubeEmbed videoID="Q2H69tJGbvY"/>


Have you ever seen a truly awful photo of a politician in a newspaper? Next to the confident stance of the opposing party? The photography used in our media is the first thing we see, and can bias our opinions before we've even read the article. BiasLenz scans photography from New Zealand's biggest media organisations, looking for a political stance in their portrait photography.

## Data Scrapper
BiasLenz gets its data from two places:
 - RSS Feeds from each organisation, scraping the headline photo from the page
 - Google Images search for images hosted on each news site with the politician

Once it has the dataset of images, it cleans up and labels the dataset:
 - Deduplicating using a crop-resistant hash
 - Identifying all faces in the pictures, and cropping to them
 - Matching those cropped faces to the headshots on the parliament website

## Sentiment Analysis
Using the `schibsted/facial_expression_classifier` AI model, BiasLenz determines the sentiment of the photo. Here's the most positive, and most negative photos it found in the dataset:

![](./bias/)

<MarkdownLink href="https://huggingface.co/spaces/schibsted/facial_expression_classifier">Hugging Face schibsted/facial_expression_classifier</MarkdownLink>
