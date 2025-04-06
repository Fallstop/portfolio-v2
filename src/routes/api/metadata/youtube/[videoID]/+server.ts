import { getProjects } from '$lib/cms/loadProjects'
import { json } from '@sveltejs/kit'

export async function GET({fetch, params}) {

    const video_url = `https://www.youtube.com/watch?v=${params.videoID}`;
    const youtube_meta = `https://youtube.com/oembed?url=${video_url}&format=json`;

    const response = await fetch(youtube_meta, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    return json(data);
}
