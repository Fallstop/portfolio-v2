<script lang="ts">
    import LiveCard from "$lib/components/utilities/LiveCard.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import MoreProjectsThumbnail from "$lib/components/projects/MoreProjectsThumbnail.svelte";
    import ProjectThumbnails from "$lib/components/projects/ProjectThumbnails.svelte";
    import { ArrowRight } from "lucide-svelte";

    interface Props {
        data: import("./$types").PageData;
    }

    let { data }: Props = $props();
</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
    splash_on_print
    SEOData={{
        type: "mainpage",
        description:
            "I'm a second-year Computer Systems Engineering student at University of Auckland, and I've got a passion for making.",
        slug: "/resume",
        title: "Jasper M-W | Resume",
    }}
>
    <div class="content">
        <h1 class="page-header">Jasper Miller-Waugh</h1>
        <p>
            I'm a second-year Computer Systems Engineering student at University of Auckland, and
            I've got a passion for making.
        </p>
        <div class="card-container">
            <LiveCard>
                <b>Tech skills:</b> Svelte & React web development, Rust and C++ systems
                programming, 3D printing and design, Python data-processing, DevOps
                with on-premise servers, IOT integration.
            </LiveCard>

            <LiveCard>
                <b>Soft Skills:</b> I work well in a team or independently, excellent
                communication, experienced at leading teams, flexible and proactive
                with good attention to detail (with an exception for spelling).
            </LiveCard>
        </div>

        <h2>Employment History</h2>
        <div class="card-container">
            <LiveCard>
                <h3 class="company-name">
                    University of Auckland - CIE<span class="date"
                        >2024 <ArrowRight class="arrow" /> present</span
                    >
                </h3>
                <ul>
                    <li>
                        Part of the Creative Technologist team at the Center of Innovation and Entrepreneurship.
                    </li>
                    <li>
                        Supervising the makerspace, running equipment workshops,
                        designing and facilitating curricular workshops, and repairing
                        equipment.
                    </li>
                </ul>
            </LiveCard>
            <LiveCard>
                <h3 class="company-name">
                    Watchful - Full Stack Software Engineer <span class="date">2024 <ArrowRight class="arrow" /> 2025</span
                    >
                </h3>
                <ul>
                    <li>
                        Over the summer, I worked as a software engineer at Watchful, a security camera monitoring platform.
                    <li>
                        I worked on a device-integration scripting tool, that not only allows rapid iteration on new security camera integrations, but also allows for third-party developers to potentially create their own integrations.
                    </li>
                    <li>
                        I 15x the approximate throughput of a key platform event bottleneck when the we were just starting to bump into the limitations of the old design. This gave Watchful headroom until a planned rework of the event pipeline.
                    </li>
                </ul>
            </LiveCard>
            <LiveCard>
                <h3 class="company-name">
                    Startup Contracting <span class="date">2021<ArrowRight class="arrow" />2024</span>
                </h3>
                <p>I worked with a variety of NZ based early-to-mid stage startups, developing software, electronics, performing R&D, all with a product focused mindset.</p>
                <div class="sub-group">

                    <LiveCard>
                        <h3 class="company-name">
                            Avant Consulting Group <span class="date">2024</span>
                    </h3>
                    <ul>
                        <li>General software development for clients.</li>
                        <li>
                            For example: automatically pulling balance information
                            out of NZ bank statements using AWS Textract
                        </li>
                    </ul>
                </LiveCard>
                <LiveCard>
                    <h3 class="company-name">
                        Provida <span class="date"
                            >2021 <ArrowRight class="arrow" /> 2023</span
                        >
                    </h3>
                    <ul>
                        <li>
                            Development of Provida's Video Meeting offering, based
                            on Jitsi Meet.
                        </li>
                        <li>
                            Web development of <a href="https://www.zui.nz/">Zui</a
                            >, the community instance of the video meeting offering.
                        </li>
                        <li>
                            Automated scanning and validation of APC medical and
                            vaccine certificates.
                        </li>
                    </ul>
                </LiveCard>
                <LiveCard>
                    <h3 class="company-name">
                        Naut <span class="date">2023</span>
                    </h3>
                    <ul>
                        <li>
                            Development of an interactive kiosk that runs on a
                            Raspberry Pi, which allows users to play a simple game
                            using a sailing Grinder
                        </li>
                        <li>
                            Working within a tight timeline and limited personal
                            availability
                        </li>
                        <li>
                            Integrated my solution with an existing timer system
                        </li>
                        <li>
                            includes a remote management portal with many settings,
                            multiple game modes, and persistent high scores.
                        </li>
                    </ul>
                </LiveCard>
                <LiveCard>
                    <h3 class="company-name">
                        N3T <span class="date"
                            >2021 <ArrowRight class="arrow" /> 2022</span
                        >
                    </h3>
                    <ul>
                        <li>
                            Research and Development on methods of low-cost vehicle
                            weight estimation.
                        </li>
                        <li>
                            Using Geophones connected to ESP32's to stream live data
                            to a controller server on a Raspberry Pi.
                        </li>
                        <li>
                            3D Design and Printing of internal mounts for node
                            electronics.
                        </li>
                    </ul>
                </LiveCard>
                <LiveCard>
                    <h3 class="company-name">
                        LilRegie <span class="date"
                            >2021 <ArrowRight class="arrow" /> 2022</span
                            >
                        </h3>
                        <ul>
                        <li>
                            Developing a new front-end for their online check-in
                            tool.
                        </li>
                        <li>
                            Implemented vaccine pass and ticket scanning and
                            validation
                        </li>
                        <li>Integrated with existing infrastructure</li>
                    </ul>
                </LiveCard>
            </div>
            </LiveCard>
        </div>
        <h2>Highlighted Projects</h2>
        <div class="projects-container">
            <ProjectThumbnails posts={data.postsHighlighted} />
            <MoreProjectsThumbnail missedProjects={data.missedProjects} />
        </div>
        <h2>Education</h2>
        <div class="card-container">
            <LiveCard>
                <h3 class="company-name">
                    UoA - Computer Systems Engineering <span class="date"
                        >2024 <ArrowRight class="arrow" /> present</span
                    >
                </h3>
                <ul>
                    <li>
                        Second year University of Auckland Bachelor of
                        Engineering (Honours).
                    </li>
                    <li>
                        Computer Systems Engineering is a mix of Software Engineering and Electrical Engineering. I decided to go down this route due to my love of combing well-designed hardware, with excellent software to solve real-world problems.
                    </li>
                    <li>
                        Current GPA: 8.5
                    </li>
                </ul>
            </LiveCard>
            <LiveCard>
                <h3 class="company-name">
                    Huanui College <span class="date"
                        >2017 <ArrowRight class="arrow" /> 2023</span
                    >
                </h3>
                <ul>
                    <li>
                        Completed my A2 level Physics, Maths, Computer Science,
                        and Digital Media under the CIE Curriculum.
                    </li>
                    <li>2023 Head Boy, leading the prefect group of 20</li>
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
            font-size: 1.5rem;

            margin: 0 0 1rem 0;

            .date {
                margin-left: 0.5rem;
                font-weight: lighter;
                color: $hint-color;
            }
        }
        .sub-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        a {
            color: $hint-color;
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
        font-size: 2rem;
        page-break-after: avoid;
    }

    :global(.arrow) {
        width: 0.8em;
        height: 0.8em;
        // padding-top: 0.2em;
        display: inline-block;
        vertical-align: baseline;
        position: relative;
        top: 0.05em;
    }
</style>
