import { DefaultThumbnail } from "$lib/cms/loadProjects";
import { json, redirect, type RequestEvent } from "@sveltejs/kit"

import fs from 'fs';
import path from 'path';

export const prerender = true;

const thumbnailPaths = import.meta.glob('/src/projects/**/thumbnail.webp', {
    eager: true,
    as: "url"
});

const projectIDs = Object.keys(thumbnailPaths).map((path: string) => path.split('/').at(-2));

function entries() {
    console.log("Entries:", projectIDs)
    return projectIDs.map((id) => ({ projectID: id }));
}

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
