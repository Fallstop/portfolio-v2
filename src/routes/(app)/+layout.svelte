<script lang="ts">
  import "../../app.scss";
  let { children } = $props();

  import posthog from "posthog-js";
  import { browser } from "$app/environment";
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

  initTelemetry();
</script>

{@render children?.()}
