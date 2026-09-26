<script lang="ts">
  import "../../app.scss";
  let { children } = $props();

  import { browser } from "$app/environment";
  import { onNavigate } from "$app/navigation";
  import { isNavigating } from "$lib/components/layout/layoutDataStore";
  import NavigationLoadingBar from "$lib/components/layout/NavigationLoadingBar.svelte";

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    isNavigating.set(true);

    return new Promise((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
      transition.finished.then(() => {
        isNavigating.set(false);
      }).catch(() => {
        isNavigating.set(false);
      });
    });
  });
  // Build-time, so prerendered pages don't need to fetch /_app/env.js from the Worker
  import { PUBLIC_POSTHOG_KEY } from "$env/static/public";

  export async function initTelemetry() {
    if (!browser) return;
    if (!PUBLIC_POSTHOG_KEY) {
      console.warn(
        "PostHog key is not set, telemetry will not be initialized."
      );
      return;
    }

    // Loaded here rather than imported up top: posthog-js is ~90KB gzipped, and
    // initialisation already waits for idle time, so there's no need to ship it upfront
    const { default: posthog } = await import("posthog-js");
    posthog.init(PUBLIC_POSTHOG_KEY, {
      api_host: "/relay-VNY1",
      ui_host: "https://us.posthog.com", // change us to eu for EU Cloud
      person_profiles: "always",
      persistence: "localStorage",
    });
  }

  // Defer analytics initialization to idle time to reduce main thread blocking
  if (browser) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initTelemetry(), { timeout: 3000 });
    } else {
      setTimeout(initTelemetry, 1000);
    }
  }
</script>

<NavigationLoadingBar />
{@render children?.()}
