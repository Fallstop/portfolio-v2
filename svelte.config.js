import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { mdsvex } from "mdsvex";
import relativeImages from 'mdsvex-relative-images'
import rehypeExternalLinks from 'rehype-external-links'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({}), mdsvex({
    extensions: [".md"],
    smartypants: {
      dashes: "oldschool",
      ellipses: true,
      quotes: true,
    },
    layout: {
      _: "./src/lib/components/markdown/layout.svelte"
    },
    remarkPlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: 'noopener' }],
      relativeImages
    ],
  })],
  extensions: [".svelte", ".md"],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['/sitemap.xml', '<all>']
			}
    }),
    alias: {
      $md: "./src/lib/components/markdown/ProjectAssets",
    }
  },
};

export default config;
