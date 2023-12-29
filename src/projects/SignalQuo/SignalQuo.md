---
date: "2023-07-12"
title: "Signal Quo"
description: "Grapple 23 - Secondary emergency LoRa Mesh communication network designed for Mars."
tags: ["software", "hardware", "lora"]
authors:
 - Jasper M-W
collaborators:
    - Jasper M-W
    - Taine Reader
    - Ara Bartlett
    - Jude Wilson
    - Sean Jang
    - James Avenell
---

<script lang="ts">
    import MarkdownLink from "$md/MarkdownLink.svelte";
</script>

<MarkdownLink href="https://signalquo.qrl.nz/" color="#434f91">Signal Quo Website</MarkdownLink>
<MarkdownLink href="https://github.com/Questionable-Research-Labs/sq-comms">Questionable-Research-Labs/sq-comms</MarkdownLink>

Signal Quo is an prototype built by Somewhat Questionable. Our team claimed a first-place finish at [Grapple23](https://ymcachch.org.nz/grapple/), a week-long engineering competition, held in [YMCA’s 4C Centre](https://4c.nz/) in Christchurch, New Zealand.

The prompt was to build something that would improve life on Mars. During the week, we developed a secondary emergency communication network for a Mars colony. Consisting of a main hub, personal transmitters, and environmental monitoring devices, Signal Quo is designed to operate during even severe Martian dust storms. The system utilizes long range (LoRa) technology, and incorporates a novel HopTrace protocol that records each signal's path, enabling geolocation for nodes in distress.

## Our Vision
Imagine invaluable human life thriving amidst the daunting Martian duststorms, fortified by a resilient communication system - that's the futureSignal Quo aspires to facilitate.

Out of this vision, the Signal Quo system was born - a mesh network acting as a secondary communication system for Martian colonists, featuring a main hub, personal transmitters, and environmental monitoring modules. All these devices are designed to function meticulously even during severe dust storms, making every EVA safer and more efficient.

## How It Works
Our system utilises the Low Range (LoRa) technology for its radio communication protocol - not using the internet-expanded LoRaWAN version but the raw LoRa radio, focusing on creating a network directly serving the specific needs of a Mars colony.

Our mesh network consists of nodes that connect and work together to expand communication coverage. Each node powers our novel HopTrace protocol which accurately captures and records all the communication hops, allowing geolocation of devices several hops away from the main hub.

![:full](./photoGallary/)