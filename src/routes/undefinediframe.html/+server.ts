import { error, redirect, type RequestEvent } from "@sveltejs/kit";

export const prerender = false;
// 

export async function GET({ url }: RequestEvent) {
    const pdfLink = url.searchParams.get("parent");
    if (pdfLink) {
        redirect(302, pdfLink);
    }
    error(404, "PDF Preview not found.");
    return new Response(pdfLink, { status: 200 });
}

