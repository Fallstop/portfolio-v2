<script lang="ts">

    interface Props {
        videoID: string;
        shortMode?: boolean;
    }

    let { videoID, shortMode = false }: Props = $props();
</script>

<style>
    .youtubeWrapper {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;

        &.shortMode {
            width: min-content;
            height: 5rem;
            padding-right: 50%;
        }
    }
</style>

<div class="youtubeWrapper" class:shortMode={shortMode}>
    <iframe src="https://www.youtube.com/embed/{videoID}?si=9TkHJzuD-As1Cqgc" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" scrolling="no" width="100%" height="100%" style="position: absolute"></iframe>
</div>
