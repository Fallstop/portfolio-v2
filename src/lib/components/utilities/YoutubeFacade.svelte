<!-- https://kellenmace.com/blog/lite-youtube-embed-for-svelte -->

<script lang="ts">
  import { Copy, CopyCheckIcon, X } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import CopyAction from "./CopyAction.svelte";
  import { fade } from "svelte/transition";

  interface Props {
    videoId: string;
    shortMode?: boolean;
    rounded?: boolean;
  }
  let { videoId, shortMode = false, rounded = true }: Props = $props();

  const thumbnailLink = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  let activated = $state(false);
  let hovered = $state(false);

  let iframeRawContainer: HTMLDivElement | null = $state(null);
  let videoTitle = $state("");

  async function fetchVideoTitle(videoId: string) {
    if (!videoId) {
      return;
    }

    const nameRequest = await fetch(`/api/metadata/youtube/${videoId}`);
    if (nameRequest.ok) {
      const data = await nameRequest.json();
      if (data && data.title) {
        videoTitle = data.title;
      }
    } else {
      console.error("Failed to fetch video metadata");
    }
  }

  $effect(() => {
    fetchVideoTitle(videoId);
  });

  let computedParams = $derived(
    (() => {
      const p = new URLSearchParams();
      p.append("autoplay", "1");
      p.append("playsinline", "1");
      return p.toString();
    })(),
  );

  function injectIFrame() {
    if (!iframeRawContainer) {
      return;
    }

    if (iframeRawContainer.firstChild) {
      // If the iframe already exists, we don't need to do anything.
      return;
    }

    // On button press, we need to manually inject the iframe into the DOM, so we keep the button-press event chain going.
    // This allows autoplay to function, so we should only need to press once.

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.position = "absolute";
    iframe.scrolling = "no";

    iframe.title = videoTitle;
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      videoId,
    )}?${computedParams}`;
    iframe.setAttribute("aria-label", videoTitle);

    iframeRawContainer.appendChild(iframe);
    iframe.focus();
  }

  onDestroy(() => {
    if (iframeRawContainer) {
      iframeRawContainer.innerHTML = "";
    }
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://i.ytimg.com" />
  {#if hovered}
    <link rel="preconnect" href="https://www.youtube-nocookie.com" />
    <link rel="preconnect" href="https://www.google.com" />
  {/if}
</svelte:head>

<div
  class="lite-youtube"
  class:rounded
  class:short-mode={shortMode}
  class:lite-youtube-activated={activated}
  role="button"
  tabindex="0"
>
  <div class="preview-bar" class:removed={activated}>
    <h3 class="video-title">
      {#if videoTitle}
        <span in:fade>
          {videoTitle}
        </span>
      {/if}
    </h3>
    <CopyAction data={`https://www.youtube.com/watch?v=${videoId}`}>
      {#snippet copyIcon(copied)}
        <div class="copy-action">
          {#if copied}
            <CopyCheckIcon />
            <span>Copied!</span>
          {:else}
            <Copy />
            <span>Copy Link</span>
          {/if}
        </div>
      {/snippet}
    </CopyAction>
  </div>
  <picture>
    <img class="lite-youtube-poster" alt={videoTitle} src={thumbnailLink} />
  </picture>
  <button type="button" class="lite-youtube-playbtn" aria-label={videoTitle}>
  </button>
  <div
    bind:this={iframeRawContainer}
    class="iframeRawContainer"
    onpointerover={() => (hovered = true)}
    onclick={() => {
      activated = true;
      injectIFrame();
    }}
    onkeypress={() => {
      activated = true;
      injectIFrame();
    }}
    role={activated ? "" : "button"}
  ></div>

  <noscript>
    <!-- To help google indexing, won't be loaded, but will be discoverd by search engines -->
    <iframe
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      src="https://www.youtube-nocookie.com/embed/{encodeURIComponent(
        videoId,
      )}?{computedParams}"
      title={videoTitle}
      frameborder="0"
      scrolling="no"
      width="100%"
      height="100%"
      style="position: absolute"
    >
    </iframe>
  </noscript>
</div>

<style lang="scss">
  @use "../../../variables.scss" as *;

  .lite-youtube {
    background-color: #000000;
    position: relative;
    display: block;
    contain: content;
    cursor: pointer;

    /* gradient */
    &:before {
      content: "";
      display: block;
      pointer-events: none;
      position: absolute;
      top: 0;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);
      background-position: top;
      background-repeat: repeat-x;
      height: 60px;
      padding-bottom: 50px;
      width: 100%;
      transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
      box-sizing: unset;
      z-index: 1;
    }

    &::after {
      /* responsive iframe with a 16:9 aspect ratio
		  thanks https://css-tricks.com/responsive-iframes/
		  */
      content: "";
      display: block;
      padding-bottom: calc(100% / (16 / 9));
      pointer-events: none;
    }

    &.short-mode {
      width: 50%;
      max-width: 35m;
      @media (max-width: $mobile-breakpoint) {
        width: 90%;
        margin: 0 auto;
      }

      &::after {
        padding-bottom: calc(100% / (9 / 16));
      }
    }

    & > :global(iframe) {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border: 0;
    }
    &:hover > .lite-youtube-playbtn,
    .lite-youtube-playbtn:focus {
      filter: none;
    }

    &.rounded {
      border-radius: $border-radius;
      overflow: hidden;
    }
  }

  .iframeRawContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
  }

  /* poster */
  .lite-youtube-poster {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
  }
  /* play button */
  .lite-youtube-playbtn {
    width: 68px;
    height: 48px;
    position: absolute;
    cursor: pointer;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    left: 50%;
    z-index: 1;
    background-color: transparent;
    /* YT's actual play button svg */
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 68 48"><path fill="%23f00" fill-opacity="0.8" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path d="M 45,24 27,14 27,34" fill="%23fff"></path></svg>');
    filter: grayscale(100%);
    transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1);
    border: none;
    outline: 0;
  }

  /* Post-click styles */
  .lite-youtube.lite-youtube-activated {
    cursor: unset;
  }
  .lite-youtube.lite-youtube-activated::before,
  .lite-youtube.lite-youtube-activated > .lite-youtube-playbtn {
    opacity: 0;
    pointer-events: none;
  }

  .preview-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: top;
    color: #eee;

    z-index: 2;

    .video-title {
      font-size: 1.2rem;
      margin: 0;
      padding: 0.5rem;
    }

    .copy-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1rem;
      color: #eee;
      width: 6em;
      padding: 0.5rem;
      border-radius: 0.5rem;

      cursor: pointer;

      &:hover {
        color: #fff;
        background-color: #0000053f;
      }
      &:active {
        background-color: #00000594;
      }
    }

    &::before {
      content: "";
      top: 0;
      left: 0;
      height: 4rem;
      padding-bottom: 4rem;
      width: 100%;

      z-index: -1;

      position: absolute;
      background-repeat: repeat-x;
      background-position: top;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);
      -webkit-transition: opacity 0.25s cubic-bezier(0, 0, 0.2, 1);
      transition: opacity 0.25s cubic-bezier(0, 0, 0.2, 1);
      pointer-events: none;
    }
  }
</style>
