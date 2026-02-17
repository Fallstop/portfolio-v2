<script lang="ts">
    import { onMount } from "svelte";
    import { Download } from "lucide-svelte";

    let state: "loading" | "loaded" | "failed" = $state("loading");
    let count = $state(0);
    let digits = $state(4);

    function placeholderText(d: number): string {
        const representative = Math.pow(10, d - 1);
        return representative.toLocaleString("en-NZ") + " downloads";
    }

    onMount(async () => {
        const [hintRes, dataRes] = await Promise.allSettled([
            fetch("/api/logi-downloads/digits").then(r => r.json()),
            fetch("/api/logi-downloads").then(r => r.json())
        ]);

        if (hintRes.status === "fulfilled" && hintRes.value.digits) {
            digits = hintRes.value.digits;
        }

        if (dataRes.status === "fulfilled" && dataRes.value.downloads != null) {
            count = dataRes.value.downloads;
            state = "loaded";
        } else {
            state = "failed";
        }
    });
</script>

{#if state !== "failed"}
    <a class="badge" class:shimmer={state === "loading"}
        href="https://marketplace.logi.com/plugin/HapticWeb/en" target="_blank"
        aria-label={state === "loaded" ? `${count.toLocaleString('en-NZ')} downloads` : "Loading download count"}>
        <Download />
        {#if state === "loading"}
            <span class="placeholder">{placeholderText(digits)}</span>
        {:else}
            {count.toLocaleString("en-NZ")} downloads
        {/if}
    </a>
{/if}

<style lang="scss">
    @use "../../../../variables.scss" as *;

    .badge {
        display: inline-block;
        text-decoration: none;
        padding: $space-xs;
        margin: $space-xs $space-xs $space-xs 0;
        color: $dark-text-color;
        background-color: #E26500;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
        transition: box-shadow $transition-base, width $transition-base;
        text-wrap: nowrap;
        overflow: hidden;
        max-width: 100%;
        box-sizing: border-box;
        interpolate-size: allow-keywords;

        @include icon-inline;

        &:hover {
            box-shadow: 0 0 $space-xs rgba(0, 0, 0, 0.5);
        }
    }

    .shimmer {
        animation: pulse 1.5s ease-in-out infinite;
    }

    .placeholder {
        color: transparent;
        user-select: none;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
</style>
