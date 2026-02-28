<script lang="ts">
  import "../../app.scss";
  let { children } = $props();

  import posthog from "posthog-js";
  import { browser } from "$app/environment";
  import { onNavigate } from "$app/navigation";
  import { isNavigating } from "$lib/components/layout/layoutDataStore";

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
  import { env } from "$env/dynamic/public";

  export function initTelemetry() {
    if (!browser) return;
    if (!env.PUBLIC_POSTHOG_KEY) {
      console.warn(
        "PostHog key is not set, telemetry will not be initialized."
      );
      return;
    }

    posthog.init(env.PUBLIC_POSTHOG_KEY, {
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

{@render children?.()}
