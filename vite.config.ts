import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import{ imagetools } from './vitePlugins/imageToolPlugin';
import {interceptDirectives, resolveThumbnailConfigs} from "./vitePlugins/imageToolsParamTransform";
import galleryImportTransform from "./vitePlugins/galleryImportTransform";
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    sveltekit(),
    galleryImportTransform({projectRoot: __dirname}),
    imagetools({
      resolveConfigs: resolveThumbnailConfigs(),
      extendDirectives: interceptDirectives()
    }),
    Inspect({
      build: true,
      outputDir: '.vite-inspect'
    })
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
