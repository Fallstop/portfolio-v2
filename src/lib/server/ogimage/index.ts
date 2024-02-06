import { json, redirect, type RequestEvent } from "@sveltejs/kit";
import fs from "node:fs";
import { DefaultThumbnail, getProjects } from "$lib/cms/loadProjects";
import renderCanvas from "./canvasRender";
import type { Post } from "$lib/types";



export async function generateImage({params}: RequestEvent): Promise<Response> {
    let { projectID } = params;
    if (!projectID) {
        return json({ error: "No project ID provided" }, { status: 400 });
    }

    const allProjects = await getProjects();

    let project = allProjects.find((project: Post) => project.postID==projectID);
    if (!project) {
        // Return redirect to default thumbnail
        throw redirect(302, DefaultThumbnail);
    }
    const thumbnailRequestPath = `./src/projects/${project.postID}/thumbnail.webp`;

    let thumbnailFile;
    try {
        thumbnailFile = fs.readFileSync(thumbnailRequestPath);
    } catch (e) {
        console.log(e)
        thumbnailFile = fs.readFileSync("./src/projects/default-thumbnail.webp");
    }
    // const thumbnailFile = fs.readFileSync("./src/projects/default-thumbnail.jpg");


    const fileBlob = await renderCanvas({
        projectDate: project.date,
        projectName: project.title,
        projectDescription: project.description,
        backgroundImage: thumbnailFile
    });


    return new Response(fileBlob)
}
