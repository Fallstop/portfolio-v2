import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { svelteSitemap } from "svelte-sitemap/vite";
import { responsiveDefaultDirectives, responsiveOutputFormats, responsiveResolveConfigs, responsiveSvgs } from "./vitePlugins/responsiveImages.ts";
import galleryImportTransform from "./vitePlugins/galleryImportTransform.ts";
import pdfEmbed from "./vitePlugins/pdfEmbed.ts";


export default defineConfig({
  plugins: [
    sveltekit(),
    galleryImportTransform({projectRoot: import.meta.dirname}),
    pdfEmbed(),
    responsiveSvgs(),
    imagetools({
      defaultDirectives: responsiveDefaultDirectives(),
      resolveConfigs: responsiveResolveConfigs(),
      extendOutputFormats: responsiveOutputFormats(),
    }),
    svelteSitemap({
      domain: "https://jmw.nz",
      outDir: ".svelte-kit/cloudflare",
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "/src/variables.scss" as *;',
      },
    },
  },
  clearScreen: false,
  server: {
    allowedHosts: ["dev.portfolio.jmw.nz"]
  }
});
