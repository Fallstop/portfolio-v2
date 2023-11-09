import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import{ imagetools } from './imageToolPlugin';
import {interceptDirectives, resolveThumbnailConfigs} from "./imageToolsParamTransform";

export default defineConfig({
  plugins: [
    sveltekit(),
    imagetools({
      resolveConfigs: resolveThumbnailConfigs(),
      extendDirectives: interceptDirectives()
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});
