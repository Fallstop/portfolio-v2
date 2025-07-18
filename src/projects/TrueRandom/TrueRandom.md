---
date: "2021-06-04"
title: "True Random"
subtitle: "The most powerful and secure random number tool you could ever want."
description: "Using a massive robotic arm to violently roll dice."
collaborators:
    - Jasper M-W
    - Connor Hare
    - Jacob Read
    - Taine Reader
highlight: true
tags: ["Software", "Hardware", "Svelte", "Python", "48 Hours", "Terrible Ideas"]
---
<script lang="ts">
    import TwitchStream from "$md/TwitchStream.svelte";
    import MarkdownLink from "$md/MarkdownLink.svelte";
</script>


<MarkdownLink href="https://tr.host.qrl.nz/" color="#0c60ce">TrueRandom Website</MarkdownLink>
<MarkdownLink href="https://terriblehack.com/">Produced for the Terrible Ideas Hackathon</MarkdownLink>


Today's random number algorithms are too boring and fast. That's why we used a massive robotic arm that uses ODrive controllers to precisely roll a dice and read the result.

### The robot in action
![The Robot:large](./preview.mp4)


We also set up a twitch stream for a more interactive random number generation experience, the channel is [True Random QRL](https://twitch.tv/truerandomqrl) and should be running 24/7. Just run `!roll` in chat to see your random number being generated and read in realtime (+stream delay).

<TwitchStream channelName="truerandomqrl"/>

We plan of keeping the stream up until roughly 2021-07-22 or later, because we can't just dedicate resources for it forever, so if the stream is down by the time you get here that is why.

### The robot's design

The robotic arm is an old design from a prototype engineer that had ambitions to use ODrive, the controller, to make a much cheaper and more powerful robotic arm. The design has 3 Axes, all of which are powered by drone motors (running 12v, 30A each) with relative encoder with an index pulse. The motors are controlled using the aforementioned dual ODrive controllers that use the encoders to calculate the exact positions of the motors, and fights to keep it at the goal position in a closed loop control system.

The abstraction of the ODrive is abstracted again by the code running on the dedicated server jankly placed underneath the arm.

### The Web Server

The website ([truerandom.ml](https://truerandom.ml/)) is vaguely inspired by the legendary [is even api](https://isevenapi.xyz/), it is dockerized and is self hosted on [QRL's](https://qrl.nz) servers.

##### User facing API

The user facing api is just a simple express server serving from a buffer of random numbers.

##### Connection to the robot arm

Because this was developed at a hackathon, we had to do it in reverse, the robot arm server creates a websocket connection to the webserver, which then allows the webserver to send orders to the robot arm server that it can fulfill.