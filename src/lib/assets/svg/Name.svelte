<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    let canvas: HTMLCanvasElement = undefined as any;
    let duration = "8s";

    let svgElement: SVGSVGElement = $state() as SVGSVGElement;
    let canvasRendered = false;

    let backgroundBlurSize = 200;

    let windowInnerWidth = 0;
    let windowInnerHeight = 0;

    function generateSVGImage() {
        let xml = new XMLSerializer().serializeToString(svgElement);
        // make it base64
        let svg64 = btoa(xml);
        let b64Start = "data:image/svg+xml;base64,";

        // prepend a "header"
        return b64Start + svg64;
    }
    let i = 0;

    function renderCanvas() {
        if (!canvas) return;

        let boundingBox = svgElement.getBoundingClientRect();
        let area: [number, number, number, number] = [
            boundingBox.x,
            boundingBox.y,
            boundingBox.width,
            boundingBox.height,
        ];

        canvas.width = windowInnerWidth;
        canvas.height = Math.max(
            svgElement.height.baseVal.value + 8 * boundingBox.y,
            windowInnerHeight
        );
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let filterIntensifiers: string[] = [];
        // filterIntensifiers.push("saturate(300%)");
        // filterIntensifiers.push("contrast(300%)");
        // filterIntensifiers.push("brightness(500%)");
        filterIntensifiers.push("opacity(0.8)");
        filterIntensifiers.push(`blur(${backgroundBlurSize}px)`);

        // Draw optimised blurred background to canvas
        ctx.filter = filterIntensifiers.join(" ");
        // Draw gradient to canvas
        const gradient = ctx.createLinearGradient(...area);
        gradient.addColorStop(0, "#451952");
        gradient.addColorStop(0.25, "#662549");
        gradient.addColorStop(0.5, "#AE445A");
        gradient.addColorStop(0.75, "#F39F5A");
        gradient.addColorStop(1, "#451952");

        ctx.fillStyle = gradient;

        // Get SVG Viewbox width/height
        let viewBox = svgElement
            .getAttribute("viewBox")!
            .split(" ")
            .map((x) => +x);
        let viewBoxWidth = viewBox[2];
        let viewBoxHeight = viewBox[3];

        ctx.translate(boundingBox.x, boundingBox.y);
        ctx.scale(
            boundingBox.width / viewBoxWidth,
            boundingBox.height / viewBoxHeight
        );
        // ctx.translate(-42.021, -33.288);

        // ctx.fillRect(...area);

        svgElement.querySelectorAll(".canvasDraw").forEach((x) => {
            let p = new Path2D(x.getAttribute("d")!);
            // p.moveTo(boundingBox.x, boundingBox.y);
            ctx.fill(p);
        });

        // We've rendered everything! We're good to remove the backup text
        canvasRendered = true;
    }
    let renderInterval: ReturnType<typeof setInterval> | undefined;

    function renderCache() {
        // Only the horizontal size of the window is important for rendering
        if (windowInnerWidth !== window.innerWidth && windowInnerWidth !== window.innerHeight) {
            windowInnerWidth = window.innerWidth;
            windowInnerHeight = window.innerHeight;
            renderCanvas();
        }
        window.requestAnimationFrame(renderCache);
        
    }

    onMount(() => {
        renderCache();
        // renderInterval = setInterval(renderCache, 1000);
    });

    onDestroy(() => {
        if (renderInterval) clearInterval(renderInterval);
    });
</script>

<div class="svg-container">
<!-- Background blur SVG -->
<svg
    version="1.1"
    viewBox="0 0 326.56 144.96"
    xmlns="http://www.w3.org/2000/svg"
    class="blur-background"
    style="--svg-width: 100cqi;"
>
    <defs>
        <linearGradient
            id="logo-gradient-blur"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset="0%" stop-color="#451952">
                <animate
                    attributeName="stop-color"
                    values="#451952; #662549; #AE445A; #F39F5A; #451952"
                    dur={duration}
                    repeatCount="indefinite"
                />
            </stop>

            <stop offset="25%" stop-color="#662549">
                <animate
                    attributeName="stop-color"
                    values="#662549; #AE445A; #F39F5A; #451952; #662549"
                    dur={duration}
                    repeatCount="indefinite"
                />
            </stop>

            <stop offset="50%" stop-color="#AE445A">
                <animate
                    attributeName="stop-color"
                    values="#AE445A; #F39F5A; #451952; #662549; #AE445A"
                    dur={duration}
                    repeatCount="indefinite"
                />
            </stop>

            <stop offset="75%" stop-color="#F39F5A">
                <animate
                    attributeName="stop-color"
                    values="#F39F5A; #451952; #662549; #AE445A; #F39F5A"
                    dur={duration}
                    repeatCount="indefinite"
                />
            </stop>

            <stop offset="100%" stop-color="#451952">
                <animate
                    attributeName="stop-color"
                    values="#451952; #662549; #AE445A; #F39F5A; #451952"
                    dur={duration}
                    repeatCount="indefinite"
                />
            </stop>
        </linearGradient>
    </defs>
    <g class="text-group" transform="translate(-8.2879 -40.46281)" fill="url(#logo-gradient-blur)" style="shape-inside:url(#rect1035);white-space:pre" aria-label="Jasper M-W">
        <path d="m99.195 33.288v37.248q0 12.864-7.68 19.968-7.68 7.104-22.176 7.104-10.656 0-17.088-3.744-6.336-3.744-8.736-10.272-2.304-6.528-1.056-14.784l22.176-3.744q-1.248 9.024 0.288 12.384 1.632 3.36 5.568 3.36 3.264 0 4.8-2.784t1.536-9.12v-35.616z"/>
        <path d="m130.93 66.696q0-2.208-1.056-3.456-0.96-1.248-3.072-1.248-2.016 0-3.36 1.152t-1.536 4.608l-18.624-2.688q0.672-7.968 6.912-12.672t18.144-4.704q8.352 0 13.728 2.304 5.472 2.304 8.064 6.432 2.688 4.128 2.688 9.6v14.88q0 3.936 3.744 3.936 1.056 0 1.632-0.288l-0.96 11.328q-3.552 1.728-8.544 1.728-4.512 0-8.064-1.248-3.456-1.344-5.472-3.936-1.92-2.688-1.92-6.816v-0.96h2.112q-0.096 3.648-2.4 6.624-2.208 2.88-5.952 4.608t-8.544 1.728q-5.088 0-8.64-1.536-3.456-1.536-5.28-4.416t-1.824-6.816q0-5.28 3.36-8.544 3.36-3.36 9.696-4.608l16.704-3.456-0.096 7.776-5.184 1.248q-2.016 0.48-2.88 1.632-0.864 1.056-0.864 2.688 0 1.536 0.96 2.496t2.688 0.96q0.768 0 1.44-0.288 0.768-0.288 1.248-0.864 0.576-0.576 0.864-1.344 0.288-0.864 0.288-1.92z"/>
        <path d="m184.81 97.608q-7.008 0-13.536-1.92-6.432-1.92-11.232-5.76l7.872-11.424q2.592 2.304 6.816 4.128 4.224 1.728 8.448 1.728 1.632 0 2.88-0.384 1.344-0.384 1.344-1.344 0-0.768-0.768-1.152-0.672-0.384-3.072-0.768l-3.456-0.672q-10.464-2.016-14.784-5.76t-4.32-10.08q0-3.936 2.496-7.68 2.592-3.84 8.16-6.336t14.688-2.496q7.488 0 13.44 1.92 5.952 1.824 9.696 5.088l-7.584 10.944q-2.688-2.112-6.912-3.36-4.128-1.344-7.584-1.344-1.536 0-2.496 0.192t-1.44 0.576q-0.384 0.288-0.384 0.768 0 0.672 0.96 1.248t3.744 1.056l6.816 1.152q7.776 1.248 11.328 4.992 3.648 3.744 3.648 9.216 0 4.704-2.592 8.736-2.496 3.936-7.968 6.336-5.376 2.4-14.208 2.4z"/>
        <path d="m249.53 47.688c-3.392 0-6.336 0.8638-8.832 2.5918-2.496 1.664-4.4494 3.9681-5.8574 6.9121-0.16873 0.35279-0.32725 0.71143-0.47851 1.0762l-0.48047-9.6191h-17.945l-0.00781 68.072v0.00195l-8.5703 43.957-7.3926-45.793h-24.096l17.951 63.361h24.576l4.8965-23.809 2.4961-16.225h0.28711l2.4961 16.225 4.9922 23.809h23.713l18.047-63.361h-23.232l-7.1992 45.506-9.0117-43.586h0.01562v-28.307c0.74544 1.6831 1.6677 3.2204 2.7852 4.5957 2.496 3.008 6.08 4.5117 10.752 4.5117 3.904 0 7.2304-0.99256 9.9824-2.9766 2.752-1.984 4.8322-4.8627 6.2402-8.6387 1.472-3.776 2.209-8.3208 2.209-13.633 0-5.248-0.70528-9.6958-2.1133-13.344-1.408-3.648-3.4863-6.4316-6.2383-8.3516-2.688-1.984-6.0164-2.9766-9.9844-2.9766zm-8.9297 15.457c1.536 0 2.7524 0.63992 3.6484 1.9199 0.896 1.28 1.3438 3.808 1.3438 7.584 0 3.776-0.44775 6.304-1.3438 7.584-0.89599 1.216-2.1124 1.8223-3.6484 1.8223-1.088 0-1.9835-0.35069-2.6875-1.0547s-1.2152-1.76-1.5352-3.168-0.48047-3.1356-0.48047-5.1836c0-2.24 0.19217-4.033 0.57617-5.377 0.384-1.408 0.92686-2.4323 1.6309-3.0723 0.704-0.704 1.5361-1.0547 2.4961-1.0547z" stop-color="#000000" style="-inkscape-stroke:none;font-variation-settings:normal"/>
        <path d="m299.08 97.608q-8.64 0-14.784-2.88-6.144-2.976-9.408-8.544t-3.264-13.536 3.264-13.536q3.36-5.568 9.312-8.448 6.048-2.976 14.016-2.976 8.16 0 13.824 2.976 5.76 2.88 8.736 8.16t2.976 12.288q0 1.536-0.192 3.168-0.096 1.632-0.288 2.592h-37.44v-8.16h27.84l-10.464 4.128q0-5.184-0.96-7.872-0.864-2.688-3.936-2.688-2.016 0-3.36 0.96-1.248 0.96-1.824 3.36-0.576 2.304-0.576 6.432t0.768 6.336q0.768 2.112 2.208 2.88 1.536 0.672 3.84 0.672 2.496 0 3.84-1.056 1.44-1.152 1.92-3.072l17.76 4.8q-1.056 4.704-4.704 7.872-3.648 3.072-8.736 4.608-4.992 1.536-10.368 1.536z"/>
        <path d="m329.13 96.648v-48h19.872l0.48 12q1.632-5.952 4.992-9.408 3.456-3.552 9.12-3.552 2.208 0 3.36 0.384t1.632 0.768l-1.824 17.76q-0.864-0.384-2.496-0.672t-3.552-0.288q-2.88 0-4.992 0.96-2.112 0.864-3.36 2.592-1.152 1.728-1.152 4.416v23.04z"/>
        <path d="m126.08 114.89v63.36h-19.488v-21.984l0.288-21.312h-0.288l-12.288 43.296h-17.856l-12.096-43.296h-0.384l0.288 21.312v21.984h-19.584v-63.36h31.296l7.296 28.128 2.784 11.808h0.192l2.784-11.808 7.296-28.128z"/>
        <path d="m175.36 143.78v16.8h-37.44v-16.8z"/>
    </g>   
</svg>

<!-- Main outline SVG -->
<svg
    version="1.1"
    viewBox="0 0 326.56 144.96"
    xmlns="http://www.w3.org/2000/svg"
    bind:this={svgElement}
>
    <g
        transform="translate(-42.021 -33.288)"
        class="main-path outlines"
        aria-label="Jasper M-W"
    >
        <path
            d="m99.195 33.288v37.248q0 12.864-7.68 19.968-7.68 7.104-22.176 7.104-10.656 0-17.088-3.744-6.336-3.744-8.736-10.272-2.304-6.528-1.056-14.784l22.176-3.744q-1.248 9.024 0.288 12.384 1.632 3.36 5.568 3.36 3.264 0 4.8-2.784t1.536-9.12v-35.616z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m130.93 66.696q0-2.208-1.056-3.456-0.96-1.248-3.072-1.248-2.016 0-3.36 1.152t-1.536 4.608l-18.624-2.688q0.672-7.968 6.912-12.672t18.144-4.704q8.352 0 13.728 2.304 5.472 2.304 8.064 6.432 2.688 4.128 2.688 9.6v14.88q0 3.936 3.744 3.936 1.056 0 1.632-0.288l-0.96 11.328q-3.552 1.728-8.544 1.728-4.512 0-8.064-1.248-3.456-1.344-5.472-3.936-1.92-2.688-1.92-6.816v-0.96h2.112q-0.096 3.648-2.4 6.624-2.208 2.88-5.952 4.608t-8.544 1.728q-5.088 0-8.64-1.536-3.456-1.536-5.28-4.416t-1.824-6.816q0-5.28 3.36-8.544 3.36-3.36 9.696-4.608l16.704-3.456-0.096 7.776-5.184 1.248q-2.016 0.48-2.88 1.632-0.864 1.056-0.864 2.688 0 1.536 0.96 2.496t2.688 0.96q0.768 0 1.44-0.288 0.768-0.288 1.248-0.864 0.576-0.576 0.864-1.344 0.288-0.864 0.288-1.92z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m184.81 97.608q-7.008 0-13.536-1.92-6.432-1.92-11.232-5.76l7.872-11.424q2.592 2.304 6.816 4.128 4.224 1.728 8.448 1.728 1.632 0 2.88-0.384 1.344-0.384 1.344-1.344 0-0.768-0.768-1.152-0.672-0.384-3.072-0.768l-3.456-0.672q-10.464-2.016-14.784-5.76t-4.32-10.08q0-3.936 2.496-7.68 2.592-3.84 8.16-6.336t14.688-2.496q7.488 0 13.44 1.92 5.952 1.824 9.696 5.088l-7.584 10.944q-2.688-2.112-6.912-3.36-4.128-1.344-7.584-1.344-1.536 0-2.496 0.192t-1.44 0.576q-0.384 0.288-0.384 0.768 0 0.672 0.96 1.248t3.744 1.056l6.816 1.152q7.776 1.248 11.328 4.992 3.648 3.744 3.648 9.216 0 4.704-2.592 8.736-2.496 3.936-7.968 6.336-5.376 2.4-14.208 2.4z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m249.53 47.688c-3.392 0-6.336 0.8638-8.832 2.5918-2.496 1.664-4.4494 3.9681-5.8574 6.9121-0.16873 0.35279-0.32725 0.71143-0.47851 1.0762l-0.48047-9.6191h-17.945l-8e-3 68.072v2e-3l-8.5703 43.957-7.3926-45.793h-24.096l17.951 63.361h24.576l4.8965-23.809 2.4961-16.225h0.28711l2.4961 16.225 4.9922 23.809h23.713l18.047-63.361h-23.232l-7.1992 45.506-9.0117-43.586h0.0156v-28.307c0.74544 1.6831 1.6677 3.2204 2.7852 4.5957 2.496 3.008 6.08 4.5117 10.752 4.5117 3.904 0 7.2304-0.99256 9.9824-2.9766 2.752-1.984 4.8322-4.8627 6.2402-8.6387 1.472-3.776 2.209-8.3208 2.209-13.633 0-5.248-0.70528-9.6958-2.1133-13.344-1.408-3.648-3.4863-6.4316-6.2383-8.3516-2.688-1.984-6.0164-2.9766-9.9844-2.9766zm-8.9297 15.457c1.536 0 2.7524 0.63992 3.6484 1.9199 0.896 1.28 1.3438 3.808 1.3438 7.584 0 3.776-0.44775 6.304-1.3438 7.584-0.89599 1.216-2.1124 1.8223-3.6484 1.8223-1.088 0-1.9835-0.35069-2.6875-1.0547s-1.2152-1.76-1.5352-3.168-0.48047-3.1356-0.48047-5.1836c0-2.24 0.19217-4.033 0.57617-5.377 0.384-1.408 0.92686-2.4323 1.6309-3.0723 0.704-0.704 1.5361-1.0547 2.4961-1.0547z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m299.08 97.608q-8.64 0-14.784-2.88-6.144-2.976-9.408-8.544t-3.264-13.536 3.264-13.536q3.36-5.568 9.312-8.448 6.048-2.976 14.016-2.976 8.16 0 13.824 2.976 5.76 2.88 8.736 8.16t2.976 12.288q0 1.536-0.192 3.168-0.096 1.632-0.288 2.592h-37.44v-8.16h27.84l-10.464 4.128q0-5.184-0.96-7.872-0.864-2.688-3.936-2.688-2.016 0-3.36 0.96-1.248 0.96-1.824 3.36-0.576 2.304-0.576 6.432t0.768 6.336q0.768 2.112 2.208 2.88 1.536 0.672 3.84 0.672 2.496 0 3.84-1.056 1.44-1.152 1.92-3.072l17.76 4.8q-1.056 4.704-4.704 7.872-3.648 3.072-8.736 4.608-4.992 1.536-10.368 1.536z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m329.13 96.648v-48h19.872l0.48 12q1.632-5.952 4.992-9.408 3.456-3.552 9.12-3.552 2.208 0 3.36 0.384t1.632 0.768l-1.824 17.76q-0.864-0.384-2.496-0.672t-3.552-0.288q-2.88 0-4.992 0.96-2.112 0.864-3.36 2.592-1.152 1.728-1.152 4.416v23.04z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m123.43 114.89v63.36h-19.488v-21.984l0.288-21.312h-0.288l-12.288 43.296h-17.856l-12.096-43.296h-0.384l0.288 21.312v21.984h-19.584v-63.36h31.296l7.296 28.128 2.784 11.808h0.192l2.784-11.808 7.296-28.128z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
        <path
            d="m172.71 143.78v16.8h-37.44v-16.8z"
            stop-color="#000000"
            style="-inkscape-stroke:none;font-variation-settings:normal"
        />
    </g>

</svg>
</div>

<style lang="scss">
    @use "../../../variables.scss" as *;
    
    .svg-container {
        position: relative;
        display: inline-block;
        width: 100%;
        // height: 100%;
        pointer-events: none;
        z-index: -1;
    }

    svg {
        overflow: visible;
        width: 100%;
        height: 100%;
        path {
            paint-order: stroke;
            stroke-linecap: square;
        }
    }

    .blur-background {
        filter: blur(calc(var(--svg-width, 500px) / 3));
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        // mask: radial-gradient(ellipse 80% 60% at center, 
        //        rgba(0,0,0,1) 30%, 
        //        rgba(0,0,0,0.8) 50%, 
        //        rgba(0,0,0,0.3) 80%, 
        //        rgba(0,0,0,0) 100%);
        // -webkit-mask: radial-gradient(ellipse 80% 60% at center, 
        //               rgba(0,0,0,1) 30%, 
        //               rgba(0,0,0,0.8) 50%, 
        //               rgba(0,0,0,0.3) 80%, 
        //               rgba(0,0,0,0) 100%);
        .text-group {
            > * {
                transform: scale(1.5);
                transform-origin: center;
            }
        }
    }

    svg:not(.blur-background) {
        position: relative;
        z-index: 1;
        .outlines {
            fill: $background-color;
        }
    }
    .main-path {
        animation: main-dash 3s ease-out;
        stroke-dasharray: 3900 0;
        // stroke: #000;
        stroke-width: 4px;
        paint-order: fill stroke;
    }

    @keyframes flood-background {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    @keyframes main-dash {
        from {
            stroke-dashoffset: 3900;
            stroke-dasharray: 3900 3900;
            // stroke-dasharray: 1000;
        }
        to {
            stroke-dashoffset: calc(3900 / 2);
            stroke-dasharray: 3900 0;
            // stroke-dasharray: 3900;
        }
    }
    @keyframes delayBackupTextAppear {
        0% {
            opacity: 0;
        }
        80% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes outline-fade-out {
        0% {
            opacity: 1;
        }
        60% {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    @keyframes blur-appear {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
