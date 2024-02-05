import { generateImage } from "$lib/server/ogimage";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(request: RequestEvent): Promise<Response> {
    return await generateImage(request);    
}