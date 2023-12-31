<script lang="ts">
    import LiveCard from "$lib/components/LiveCard.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import MoreProjectsThumbnail from "$lib/components/projects/MoreProjectsThumbnail.svelte";
    import ProjectThumbnails from "$lib/components/projects/ProjectThumbnails.svelte";


    export let data: import("./$types").PageData;
</script>
<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
    splash_on_print
>

<div class="content">
    <h1 class="page-header">Jasper Miller-Waugh</h1>
    <p>
        I'm a year-13 student about to start computer-systems engineering at University of Auckland.
    </p>
    <div class="card-container">
        <LiveCard>
            <b>Tech skills:</b> Svelte web development, Rust and C++ systems programming, 3D printing and design, Python data-processing, DevOps with on-premise servers, IOT integration.
        </LiveCard>
        
        <LiveCard>
            <b>Soft Skills:</b> I work well in a team or independently, excellent communication, experienced at leading teams, flexible and proactive with good attention to detail (with an exception for spelling).
        </LiveCard>
    </div>

    <h2>Employment History</h2>
    <div class="card-container">
        <LiveCard>
            <h3 class="company-name">Provida <span class="date">2021 → present</span></h3>
            <ul>
                <li>Development of their Video Meeting offering, based on Jitsi Meet.</li>
                <li>Web development of the Zui meeting launcher, their community edition of the video meeting offering.</li>
                <li>Automated scanning and validation of APC medical and vaccine certificates</li>
            </ul>
        </LiveCard>
        <LiveCard>
            <h3 class="company-name">Naut <span class="date">2023</span></h3>
            <ul>
                <li>Development of an interactive kiosk that runs on a Raspberry Pi, which allows users to play a simple game using a sailing Grinder</li>
                <li>Working within a tight timeline and limited personal availability</li>
                <li>Integrated my solution with an existing timer system</li>
                <li>includes a remote management portal with many settings, multiple game modes, and persistent high scores.</li>
            </ul>
        </LiveCard>
        <LiveCard>
            <h3 class="company-name">N3T <span class="date">2021 → 2022</span></h3>
            <ul>
                <li>Research and Development on methods of low-cost vehicle weight estimation.</li>
                <li>Using Geophones connected to ESP32's to stream live data to a controller server on a Raspberry Pi.</li>
                <li>3D Design and Printing of internal mounts for node electronics.</li>
            </ul>
        </LiveCard>
        <LiveCard>
            <h3 class="company-name">LilRegi <span class="date">2021 → 2022</span></h3>
            <ul>
                <li>Developing a new front-end for their online check-in tool.</li>
                <li>Implemented vaccine pass and ticket scanning and validation</li>
                <li>Integrated with existing infrastructure</li>
            </ul>
        </LiveCard>
    </div>
    <h2>Highlighted Projects</h2>
    <div class="projects-container">
        <ProjectThumbnails posts={data.postsHighlighted} />
        <MoreProjectsThumbnail />
    </div>
    <h2>Education</h2>
    <div class="card-container">
        <LiveCard>
            <h3 class="company-name">Huanui College <span class="date">2017 → 2023</span></h3>
            <ul>
                <li>Completed my A2 level Physics, Maths, and Digital Media under the CIE Curriculum.</li>
                <li>Current Head Boy, leading the prefect group of 20</li>
                <li>Enrolled into my fast-track offer into UOA Engineering, to start in 2024</li>
            </ul>
        </LiveCard>

    </div>
</div>
</PrimaryLayout>

<style lang="scss">
    .card-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .company-name {
            font-weight: bold;
            font-size: 2rem;

            .date {
                font-weight: lighter;
                color: #666;
            }
        }
    }
    .projects-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
    }
    h2 {
        margin-top: 2rem;
    }
</style>