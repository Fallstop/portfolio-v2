<script lang="ts">
    import { Fancybox } from "@fancyapps/ui";
    import "@fancyapps/ui/dist/fancybox/fancybox.css";

    import { onDestroy, onMount } from "svelte";

    onMount(() => {
        Fancybox.bind(`[data-fancybox]`, {
            // Your custom options
            on: {
                ready: (fancybox) => {
                    // here `fancybox` refers to the current instance
                    console.log("ready!", fancybox);
                },
                error: (e) => {
                    console.log("error", e);
                },
            },
        });
        console.log("Fancy box init");
    });

    onDestroy(() => {
        if (Fancybox) {
            Fancybox.destroy();
        }
    });
</script>

<!-- Dummy component -->
