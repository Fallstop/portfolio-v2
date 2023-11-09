<script lang="ts">
    import { onMount } from "svelte";
    import MarkdownImage from "./MarkdownImage.svelte";

    export let src: object = {};
</script>

<div class="image-gallery">
    
    {#each Object.values(src) as imageImport}
        {#await imageImport()}
        {:then {default: imageMetadata}}
            {@const lowResImage = imageMetadata[0]}
            {@const image = imageMetadata[1]}
            <div class="image">
                <MarkdownImage width={lowResImage.width} height={lowResImage.height} src={lowResImage.src} alt=":none" />
            </div>
        {/await}
    {/each}
</div>
<style lang="scss">
    .image-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        position: relative;
        & > .image {
            flex: 1 1 auto;
            position: relative;
            height: 300px;
            :global(img) {
                height: 100%;
                width: 100%;
                vertical-align: middle;
            }
        }
        &::after {
            content: "";
            flex-grow: 999;
        }
    }
</style>