import { json, redirect, type RequestEvent } from "@sveltejs/kit";
import fs from "node:fs";
import { DefaultThumbnail } from "$lib/cms/loadProjects";
import renderCanvas from "./canvasRender";


const thumbnailPaths = import.meta.glob('/src/projects/**/thumbnail.webp', {
    eager: true,
    query: {
        "normal": true,
        "url": true
    }
});


export async function generateImage({params}: RequestEvent): Promise<Response> {
    let { projectID } = params;
    if (!projectID) {
        return json({ error: "No project ID provided" }, { status: 400 });
    }

    let url = Object.keys(thumbnailPaths).find((path: string) => path.includes(projectID ?? ""));
    if (!url) {
        // Return redirect to default thumbnail
        throw redirect(302, DefaultThumbnail);
    }

    // const thumbnailRequestPath = `.${url}`;
    // const thumbnailFile = fs.readFileSync(thumbnailRequestPath);
    const thumbnailFile = fs.readFileSync("./src/projects/default-thumbnail.jpg");


    const fileBlob = await renderCanvas({
        projectDate: "Wow",
        projectName: "yes.",
        backgroundImage: thumbnailFile
    })


    return new Response(fileBlob)
}
