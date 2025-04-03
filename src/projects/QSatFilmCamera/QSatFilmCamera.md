---
date: "2025-03-09"
title: "QSat APSS"
description: "Fitting a pocket film camera into a rocket payload."
tags: ["software", "hardware", "lora"]
authors:
 - Jasper M-W
collaborators:
    - Jasper M-W
    - Taine Reader
    - Anton Bennett
    - William Yang
    - Joel Mansor
---

<script lang="ts">
    import MarkdownLink from "$md/MarkdownLink.svelte";
    import YoutubeEmbed from "$md/YoutubeEmbed.svelte";
    import FancyQuote from "$md/FancyQuote.svelte";
    import HighlightedBlock from "$md/HighlightedBlock.svelte";
    import ProConTable from "$md/ProConTable.svelte";
    import RedactedText from "$md/RedactedText.svelte";
</script>

<MarkdownLink href="https://github.com/questionable-innovations/QSAT_2024-2025">Questionable-Innovations/QSAT_2024-2025</MarkdownLink>
<MarkdownLink href="https://apss.co.nz/">APSS</MarkdownLink>

## What is PSat?
PSat is a summer program run by the [Auckland Program for Space Systems (APSS)](https://apss.co.nz/) at the University of Auckland. The program is designed to give students hands-on experience in building and launching a small "pico-satellite" payload. The payload can be anything the students like, as long as it's self-contained, and fits into the I class rockets, [Sudden Rush](https://locprecision.com/products/sudden-rush) , provided by APSS.

Many teams are formed, which are filtered down through design reviews and checkpoints to a final few teams that get launched at the end of the program. The design reviews are loosely based on a simpler version of NASA's mission lifecycle.

Every team also had access to reference designs, which were provided by the APSS team. These reference PCB's were designed to vertically stack, and covered the basic functionality needed for a PSat. The reference designs included a battery powersupply, a MSP430 based MCU board, and a beacon board with a LoRa radio, GPS, and a buzzer.

This year, the teams were provided with the following theme:
> ### Create a superlative PSat.
> Your PSat must be the best at something. It can be the fastest, the most powerful, the most efficient, or the most fun. 

## The concept

To fit the theme, we select "The Most Retro" as our superlative. We decided to build a payload that would take photos on deployment using a commerical film camera. Alongside the film camera, we wanted to include a small digital camera, and a sensor/communication module to send telemetry data back to the ground.

![:borderless:medium:center](./WinnerCameraTransparent.png)


The payload must fit into a tiny space, around the ![same size as a tin can:text](./SizeComparision.webp), so we needed a tiny film camera to match. We settled on the [Winner Pocket Camera](https://filmphotographyproject.com/kodak-winner-110-pocket-camera-review/), a small 110 film camera that was one of the [official sponsor's of the 1988 Olympic Games](https://collectiblend.com/Cameras/Kodak-Eastman/Winner-Camera-(1988-Olympics).html). The camera is small, light, and dead-simple to operate. It has a fixed focus lens, a fixed aperture, and a fixed shutter speed. The only thing we needed to automate was the shutter release & film advance.


#### Mission Definition Review

Once we had our concept, we needed to present it to the APSS team for approval. It was a simple presentation, where we outlined our concept, the components we would use, and the timeline for the project. We also outlined the risks and challenges we would face, and how we would mitigate them. The presentation was well received, and we were given the green light to proceed with the project.

![](./QSatMDR.pdf)

## First iteration

Once we had the green light, we started to design our payload. Both the mechanical team and the electrical team started to work on the first prototype from both ends, working towards the Preliminary Design Review deadline. The mechanical team started to design the payload structure, while the electrical team started to design the electronics. We also started to source the components we would need for the project.

#### Preliminary Design Review

The first design review was held on the 1st of December 2024. We presented our concept to the APSS team, and received feedback on 

![](./QSatPDR.pdf)


### Mechanical constraints
### Electrical fail

## Second Iteration
### Electrical fail

## Third Iteration

### The rebuild
### Trigger Panic
### The Remote

## The day itself

## Photos captured
![:small](./onboard_camera/)

## Recovery



