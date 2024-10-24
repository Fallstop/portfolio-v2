<script lang="ts">
    interface Props {
        channelName: string;
    }

    let { channelName }: Props = $props();
</script>

<style>
    .twitchStreamWrapper {
        display: flex;
        flex-direction: row;
        align-content: stretch;

    }

    @media (max-width: 700px) {
        .twitchStreamWrapper {
            flex-direction: column;
        }
        .twitchStreamChat {
            height:400px;
            width:100%
        }
    }

    .twitchStreamVideo {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;
    }
</style>

<div class="twitchStreamWrapper">
    <div class=twitchStreamVideo>
        <iframe src="https://player.twitch.tv/?channel={channelName}&parent=localhost&parent=jmw.nz&muted=true" frameborder="0" title="Twitch Stream" allowfullscreen="true" scrolling="no" width="100%" height="100%" style="position: absolute"></iframe>
    </div>
    <iframe class="twitchStreamChat" src="https://www.twitch.tv/embed/{channelName}/chat?parent=localhost&parent=jmw.nz" width="350"></iframe>
</div>