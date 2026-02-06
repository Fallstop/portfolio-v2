---
date: "2021-09-01"
title: "Toi: Times Of Interest"
description: "Govhack Entry that visualizes the all the COVID-19 locations of interest in an intuitive timeline/map combo."
collaborators:
 - Jasper M-W
 - Connor Hare
 - Jacob Read
 - Taine Reader
 - Dan Burns
tags: ["Software", "Svelte", "Typescript", "COVID", "GovHack", "48 Hours"]
---

<script>
  import MarkdownLink from "$md/MarkdownLink.svelte";
  import YoutubeEmbed from "$md/YoutubeEmbed.svelte";
</script>


<MarkdownLink href="https://2021.hackerspace.govhack.org/projects/toi">Govhack Project Page</MarkdownLink>
<MarkdownLink href="https://toi.qrl.nz">toi.qrl.nz</MarkdownLink>


Toi (pronounced "toy") is a tool that lets you visualize the all the COVID-19 locations of interest and outlined by the New Zealand Ministry of Health, and allows you to filter by name and by time.

### Features

- Filtering by date, so you can see if you were in an area of interest during any given period of time
- Search for location by name
- Push notification for when new locations are added
- Installable PWA with offline support
- Intuitive map interface


<YoutubeEmbed videoID="C14ecNV1Ts8"/>

### Toi Source Code

#### Frontend Repo:
<MarkdownLink href="https://github.com/Questionable-Research-Labs/GovHack-2021">Questionable-Research-Labs/GovHack-2021</MarkdownLink>

#### Backend Repo
<MarkdownLink href="https://github.com/Questionable-Research-Labs/Govhack2021-backend">Questionable-Research-Labs/Govhack2021-backend</MarkdownLink>


### What is Toi?
Toi is an application that allows people to easily search COVID-19 locations of interest between the specified dates. The website has a large easy to navigate map and a slider at the bottom of the webpage to slide through all the different dates and see what the locations of interest were.

### How do I use Toi?
To use Toi you must first navigate to the map. At the bottom of the screen, there is a large slider with this slider you can adjust the two points to select your range of dates. The first point is the starting date and the second is the ending. After this blimps will appear on the map showcasing the locations of interest. You can also filter to only a specific location by using the search box at the top of your screen.

### Open Source
This is an open-source project! This means all of the code that went into this project is available to the public. If you are interested in contributing or would just like to view the code for this website you can view it on Github here

### Data Used
This project uses data provided by the New Zealand Government. This data is licensed under the Creative Commons Attribution-Sharealike 4.0 International license. You can view this data on Ministry of Health New Zealand github repository which is available at https://github.com/minhealthnz/nz-covid-data.