import path from "node:path";
import galleryTemplate from "./galleryTemplate.txt?raw";
import { normalizePath, type Plugin } from "vite";

type CustomPluginOptions = Record<string, any>;
type ResolveIdResult = string | false | null | void | {
  id: string;
  external?: boolean;
  moduleSideEffects?: boolean | 'no-treeshake';
};

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


export default function galleryImportTransform({projectRoot}: {projectRoot: string}): Plugin {
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
          // Relative import
          // Use path.dirname and path.resolve to handle cross-platform paths correctly
          let importDir = path.dirname(importer);
          let fullSystemPath = path.resolve(importDir, source);

          // Use path.relative to compute the project-relative path
          // Preserve trailing slash from source (needed for import.meta.glob pattern)
          galleryBaseDir = "/" + normalizePath(path.relative(projectRoot, fullSystemPath)) + "/";
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
        return folderProxy;
      }
      return null
    }
  }
}