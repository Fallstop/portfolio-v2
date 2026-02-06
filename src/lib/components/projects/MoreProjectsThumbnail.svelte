<script lang="ts">
    import QRCode from "qrcode-svg";

    interface Props {
        missedProjects?: number;
    }

    let { missedProjects = 0 }: Props = $props();

    let svg = new QRCode({
        content: "https://jmw//projects",
        padding: 0,
        width: 100,
        height: 100,
        color: "currentcolor",
        background: "#ffffff00",
        ecl: "M",
    }).svg();
</script>

<div class="print-space-fill">

</div>

<a href="/projects" class="more-projects">
    <span class="more-header headline">{missedProjects > 1 ? missedProjects : ''} More Projects</span>
    <div class="qr-code">
        {@html svg}
    </div>
    <span class="link-name">jmw.nz/projects</span>
</a>



<style lang="scss">
    @use "../../../variables.scss" as *;
    .more-projects {
        text-decoration: none;
        flex-grow: 1;
        flex-shrink: 1;
        min-width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        text-decoration: none;
        color: $text-color;
        font-weight: bold;
        text-align: center;

        @media screen {
            flex-direction: column;
            .more-header {
                display: block;
            }
            border: 4px dashed $mid-tone;
            border-radius: $border-radius;
            
            color: #fff0;
            
            font-size: 2.5rem;
            
            transition: all 0.2s ease-in-out;
            &:hover, &:active, &:focus {
                color: $text-color;
                border: 4px dashed $text-color;
            }
            .qr-code {
                display: none;
            }
            .link-name {
                display: none;
            }
            
        }
        @media print {
            width: 300px;
            flex-grow: unset;
            flex-direction: column;
            text-align: left;
            align-items: flex-start;
            justify-content: space-evenly;
            .more-header {
                font-size: 1.5rem;
            }

            .qr-code {
                display: block;
                color: $text-color;
                width: 100px;
            }
            .link-name {
                font-size: 1rem;
            }
        }
    }
    @media print {
        .print-space-fill {
            flex-grow: 1;
        }
    }
    @media screen {
        .print-space-fill {
            display: none;
        }
    }
    
</style>
