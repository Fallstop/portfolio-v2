---
date: "2023-12-10"
title: "Motorised Couch"
subtitle: "A couch fast enough that we should probably add seatbelts"
description: "Building a collaborative driving experience, using nothing but a couch, a wheelchair, two electric scooters, a recycled UPS, and a suspicious briefcase."
collaborators:
    - Jasper M-W
    - Connor Hare
    - Taine Reader
    - Ara Bartlett
    - Cam Matheson
    - Carolyn
highlight: true
tags: ["Software", "Hardware", "C/C++", "48 Hours", "Terrible Ideas"]
---

<script lang="ts">
    import MarkdownLink from "$md/MarkdownLink.svelte";
    import HighlightedBlock from "$md/HighlightedBlock.svelte";

    import YoutubeEmbed from "$md/YoutubeEmbed.svelte";
</script>


<MarkdownLink href="https://github.com/Questionable-Research-Labs/lounge-gate">Questionable-Research-Labs/lounge-gate</MarkdownLink>


## Building a Motorised Couch
For the December 2023 Terrible Ideas Hackathon, my teams aimed for a long attempted project, building a motorised couch. A few teams had attempted building their own over the years, each attempt accumulating more necessary parts before fading.

Now, a high-speed couch isn't enough of a terrible idea itself, we needed to go deeper. Introducing, a collaborative driving experience. You now only get to control one side of the vehicle, the other side is now controlled by your enemy. You must agree on exactly were to go, and be perfectly in-tune with each other in order to get anywhere. 

<HighlightedBlock style="warning">
    {#snippet header()}
      Loud Volume Warning - "Artistic Intent"
    {/snippet}
</HighlightedBlock>
<YoutubeEmbed videoID="EpDFLeyvnqQ" rounded={false}/>

## The Build
We had no chance of shipping in new parts in time during the competition, so we had to work within the parts we had at the lab:
 - A couch donated for this exact project a few years ago
 - A salvaged wheelchair frame with 4 somewhat matching brushed motors
 - Two scraped brushed electric scooter beasts, from before scooters become popular and refined
 - A pile of 12v lead acid cells that were donated from the local hospital UPS's
 - A box full of RC remotes from a separate project that replaced the remote-control with a local AI
 - All the basic electronics we could need

The wheelchair motors were repaired, while the frame was cut in half. The two half were bolted to each side of the couch frame. The motors were driven by two of the salvaged electric scooter motor-controller, which were powered of a 48v lead acid battery bank. Those motor controllers were plugged into an arduino each, with a RC controller trigger wired into each.

All of those electronics were stuck into a briefcase bolted to the underside of the couch for easy maintenance. Underglow, and speed animations around each motor was added for the all important flair.

## Testing in and around the Lab

![](./BuildPhotos/)


## Maiden voyage around the Town Basin

![:full](./TownBasinPhotos/)

<YoutubeEmbed shortMode={true} videoID="ZUqfRdzU0HQ"/>
