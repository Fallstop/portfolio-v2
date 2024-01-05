import path from "node:path";
import galleryTemplate from "./galleryTemplate.txt?raw";
import { normalizePath } from "vite";

const markdownFileRegex = /src\/projects\/.*\.md$/

const projectsFolder = "/src/projects";

const magicResolutionKey = "\0GALLERY_IMPORT";

const templateFolderKey = "<FOLDERNAME>";


interface ResolveOptions {
  attributes: any,
  custom: any,
  isEntry: boolean,
  ssr: boolean
}

export default function galleryImportTransform({projectRoot}: {projectRoot: string}) {
  return {
    name: 'transform-file',
    async resolveId(source: string, importer: string | undefined, options: ResolveOptions) {
      if (importer && markdownFileRegex.test(importer) && source.endsWith("/")) {
        // Markdown file importing folder!
        // Hasn't resolved so far, so we can assume it's a gallery import
        console.log(source, importer, options)

        let galleryBaseDir = "";
        if (source.startsWith("/")) {
          galleryBaseDir = source;
        } else {
          // Relative import, attempting to not use the node path API for cloudflare worker compatibility
          let importDirname = importer.split("/").slice(0,-1).join("/");
          
          let fullSystemPath = normalizePath(path.join(importDirname, source));
          
          
          galleryBaseDir = fullSystemPath.slice(normalizePath(projectRoot).length);
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

        let dirname = id.slice(0,-magicResolutionKey.length);

				// Replace with actual proxy
        const folderProxy = galleryTemplate.replaceAll(templateFolderKey,dirname);
        console.log("folder proxy",folderProxy)
        return folderProxy;
        }
      return null
    }
  }
}