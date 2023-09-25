<script lang="ts">
    export let alt = "";
    // If the alt includes a size, it will be in the format "blah blah:size"
    let altSizeText = alt.split(":").at(-1);
    let altText = alt.split(":").slice(0,-1).join(":");
    
    const sizeOptions = ["raw","small","medium","large","full"]

    let size = sizeOptions.includes(altSizeText) ? altSizeText : "medium";

</script>
<img {...$$restProps} class="{size}" alt={altText} title={altText}>

<style lang="scss">
    img {
        &:not(.raw) {
            border-radius: 0.5rem;
            box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
            height: auto;
            object-fit: cover;

        }

        &.small {
            width: 50%;
        }
        &.medium {
            width: 75%;
        }
        &.large {
            width: 100%;
        }
        &.full {
            width: 100%;
        }
        @media screen and (min-width: 768px) {
            &.small {
                width: 50%;
            }
            &.medium {
                width: 75%;
            }
            &.large {
                width: 100%;
            }
            &.full {
                width: 100%;
            }
        }
        @media screen and (min-width: 1024px) {
            &.small {
                width: 25%;
            }
            &.medium {
                width: 50%;
            }
            &.large {
                width: 75%;
            }
            &.full {
                width: 100%;
            }
        }
            

    }

</style>