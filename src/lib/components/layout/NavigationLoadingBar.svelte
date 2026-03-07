<script lang="ts">
  import { navigating } from "$app/stores";

  let visible = $state(false);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    if ($navigating) {
      // Small delay to avoid flash on fast navigations
      timeout = setTimeout(() => {
        visible = true;
      }, 150);
    } else {
      if (timeout) clearTimeout(timeout);
      // Keep visible briefly to show completion animation
      if (visible) {
        setTimeout(() => {
          visible = false;
        }, 300);
      }
    }
  });
</script>

{#if visible}
  <div class="loading-bar" class:finishing={!$navigating}>
    <div class="loading-bar-progress"></div>
  </div>
{/if}

<style lang="scss">
  .loading-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    z-index: 9999;
    pointer-events: none;

    .loading-bar-progress {
      height: 100%;
      background: linear-gradient(90deg, $secondary-color, $accent-color);
      animation: loading 2s ease-in-out infinite;
      transform-origin: left;
    }
  }

  .loading-bar.finishing .loading-bar-progress {
    animation: finish 0.3s ease-out forwards;
  }

  @keyframes loading {
    0% {
      width: 0%;
    }
    20% {
      width: 30%;
    }
    50% {
      width: 60%;
    }
    80% {
      width: 80%;
    }
    100% {
      width: 95%;
    }
  }

  @keyframes finish {
    to {
      width: 100%;
      opacity: 0;
    }
  }

  @media print {
    .loading-bar {
      display: none;
    }
  }
</style>
