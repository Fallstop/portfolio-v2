<style>
    #twitchStreamWrapper {
        display: flex;
        flex-direction: row;
        align-content: stretch;

    }

    @media (max-width: 700px) {
        #twitchStreamWrapper {
            flex-direction: column;
        }
        #twitchStreamChat {
            height:400px;
            width:100%
        }
    }

    #twitchStreamVideo {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;
    }
</style>

<div id="twitchStreamWrapper">
    <div id=twitchStreamVideo>
        <iframe src="https://player.twitch.tv/?channel=truerandomqrl&parent=localhost&parent=jmw.nz&muted=true" frameborder="0" allowfullscreen="true" scrolling="no" width="100%" height="100%" style="position: absolute"></iframe>
    </div>
    <iframe id="twitchStreamChat" src="https://www.twitch.tv/embed/truerandomqrl/chat?parent=localhost&parent=jmw.nz" width="350"></iframe>
</div>