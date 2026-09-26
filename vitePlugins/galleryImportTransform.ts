import path from "node:path";
import { normalizePath, type Plugin } from "vite";


const markdownFileRegex = /src\/projects\/.*\.md$/

const projectsFolder = "/src/projects";


// Super weird regression when including the conventional '\0' api key.
const magicResolutionKey = "_____GALLERY_IMPORT";

const templateFolderKey = "<FOLDERNAME>";

// Every image in the folder, processed with the gallery preset (see responsiveImages.ts)
const galleryTemplate = `const galleryData = import.meta.glob("${templateFolderKey}*.{jpg,jpeg,png,webp,svg}", {
    query: {
        "responsive": "gallery"
    },
    import: "default",
    eager: true
});
export default galleryData;`;



export default function galleryImportTransform({projectRoot}: {projectRoot: string}): Plugin {
  return {
    name: 'transform-file',
    enforce: 'post',
    async resolveId(source, importer) {
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