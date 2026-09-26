import { error, json } from '@sveltejs/kit'

// YouTube video IDs are always 11 URL-safe base64 characters
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export async function GET({fetch, params}) {
    if (!VIDEO_ID.test(params.videoID)) {
        error(400, 'Invalid video ID');
    }

    const video_url = `https://www.youtube.com/watch?v=${params.videoID}`;
    const youtube_meta = `https://youtube.com/oembed?url=${encodeURIComponent(video_url)}&format=json`;

    const response = await fetch(youtube_meta, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 404) {
        error(404, 'Video not found');
    }

    if (!response.ok) {
        // Upstream failures are ours to report, whatever status YouTube used
        error(502, 'Failed to fetch metadata');
    }

    const data = await response.json();

    // Titles and thumbnails rarely change, so let browsers and Cloudflare's edge cache it
    return json(data, {
        headers: {
            'Cache-Control': 'public, max-age=86400, s-maxage=604800'
        }
    });
}
