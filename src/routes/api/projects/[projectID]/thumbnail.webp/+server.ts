import { DefaultThumbnail } from "$lib/cms/loadProjects";
import { json, redirect, type RequestEvent } from "@sveltejs/kit"

import fs from 'fs';

export const prerender = true;

import { getProjects } from "$lib/cms/loadProjects";

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
    const projects = await getProjects();

	return projects.map((x)=>({projectID: x.postID}))
}


const thumbnailPaths = import.meta.glob('/src/projects/**/thumbnail.webp', {
    eager: true,
    query: {
        "normal": true,
        "url": true
    }
});



export async function GET({ params, fetch }: RequestEvent) {
    let { projectID } = params;
    if (!projectID) {
        return json({ error: "No project ID provided" }, { status: 400 });
    }

    let url = Object.keys(thumbnailPaths).find((path: string) => path.includes(projectID ?? ""));
    if (!url) {
        // Return redirect to default thumbnail
        throw redirect(302, DefaultThumbnail);
    }

    const thumbnailRequestPath = `.${url}`;
    const thumbnailFile = fs.readFileSync(thumbnailRequestPath);

    // if (thumbnailRequest.status !== 200) {
    //     console.log("WARNING: Thumbnail request returned status", url, thumbnailRequest.status);
    //     // return json({ error: "No thumbnail found" }, { status: 404 });
    // }

    return new Response(thumbnailFile, {
        headers: {
            'Content-Type': 'image/webp',
            'Content-Length': thumbnailFile.length.toString()
        }
    });
}
