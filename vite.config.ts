import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect"
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';
import{ imagetools } from './vitePlugins/imageToolPlugin';
import {interceptDirectives, resolveThumbnailConfigs} from "./vitePlugins/imageToolsParamTransform";
import galleryImportTransform from "./vitePlugins/galleryImportTransform";
import { visualizer } from "rollup-plugin-visualizer";


export default defineConfig({
  plugins: [
    sveltekit(),
    galleryImportTransform({projectRoot: __dirname}),
    imagetools({
      resolveConfigs: resolveThumbnailConfigs(),
      extendDirectives: interceptDirectives(),
    }),
    Inspect({
      build: true,

    }),
    svelteInspector({}),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
  ssr: {
    noExternal: ["@fancyapps/ui"]
  },
  clearScreen: false
});
