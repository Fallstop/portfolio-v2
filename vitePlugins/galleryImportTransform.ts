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

        // Resolve to an absolute filesystem path so Vite resolves imports
        // from this virtual module relative to the correct directory (fixes Windows).
        let fullSystemPath: string;
        if (source.startsWith("/")) {
          fullSystemPath = path.resolve(projectRoot, source.slice(1));
        } else {
          let importDir = path.dirname(importer);
          fullSystemPath = path.resolve(importDir, source);
        }
        return {
          id: normalizePath(fullSystemPath) + "/" + magicResolutionKey,
          moduleSideEffects: true,
        }
      }

      return null
    },
    load(id: string) {
			if (id.endsWith(magicResolutionKey)) {

        let absDir = id.slice(0,-magicResolutionKey.length);
        // Convert absolute path back to root-relative for the glob pattern
        let dirname = "/" + normalizePath(path.relative(projectRoot, absDir)) + "/";

				// Replace with actual proxy
        const folderProxy = galleryTemplate.replaceAll(templateFolderKey,dirname);
        return folderProxy;
      }
      return null
    }
  }
}