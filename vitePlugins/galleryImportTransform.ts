import path from "node:path";
import galleryTemplate from "./galleryTemplate.txt?raw";
import { normalizePath } from "vite";
import type { ResolveIdResult, CustomPluginOptions } from "rollup"; 

const markdownFileRegex = /src\/projects\/.*\.md$/

const projectsFolder = "/src/projects";


// Super weird regression when including the conventional '\0' api key.
const magicResolutionKey = "_____GALLERY_IMPORT";

const templateFolderKey = "<FOLDERNAME>";


interface ResolveOptions {
  attributes: Record<string, string>;
  custom?: CustomPluginOptions;
  ssr?: boolean;
  isEntry: boolean;
}


export default function galleryImportTransform({projectRoot}: {projectRoot: string}) {
  return {
    name: 'transform-file',
    enforce: 'post',
    async resolveId(source: string, importer: string | undefined, options: ResolveOptions): Promise<ResolveIdResult> {      
      if (importer && markdownFileRegex.test(importer) && source.endsWith("/")) {

        // Markdown file importing folder!
        // Hasn't resolved so far, so we can assume it's a gallery import

        let galleryBaseDir = "";
        if (source.startsWith("/")) {
          galleryBaseDir = source;
        } else {
          // Relative import, attempting to not use the node path API for cloudflare worker compatibility
          let importDirname = importer.split("/").slice(0,-1).join("/");
          
          let fullSystemPath = normalizePath(path.join(importDirname, source));
          
          // path.relative(fullSystemPath, projectRoot);
          // galleryBaseDir = fullSystemPath.slice(normalizePath(projectRoot).length);
          galleryBaseDir = path.relative(projectRoot, fullSystemPath);
          galleryBaseDir = galleryBaseDir;
          console.log(fullSystemPath, importDirname, source, galleryBaseDir)
        }
        return {
          id: galleryBaseDir+magicResolutionKey,
          moduleSideEffects: true,
        }
      }

      return null
    },
    load(id: string) {
			if (id.endsWith(magicResolutionKey)) {

        let dirname = "./" + normalizePath(id.slice(0,-magicResolutionKey.length));

				// Replace with actual proxy
        const folderProxy = galleryTemplate.replaceAll(templateFolderKey,dirname);
        return folderProxy;
      }
      return null
    }
  }
}