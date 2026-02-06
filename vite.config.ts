import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import{ imagetools } from './vitePlugins/imageToolPlugin';
import {interceptDirectives, resolveThumbnailConfigs} from "./vitePlugins/imageToolsParamTransform";
import galleryImportTransform from "./vitePlugins/galleryImportTransform";


export default defineConfig({
  plugins: [
    sveltekit(),
    galleryImportTransform({projectRoot: __dirname}),
    imagetools({
      resolveConfigs: resolveThumbnailConfigs() as any,
      extendDirectives: interceptDirectives(),
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        additionalData: '@use "/src/variables.scss" as *;',
      } as any,
    },
  },
  ssr: {
    noExternal: ["@fancyapps/ui"]
  },
  clearScreen: false,
  server: {
    allowedHosts: ["dev.portfolio.jmw.nz"]
  }
});
