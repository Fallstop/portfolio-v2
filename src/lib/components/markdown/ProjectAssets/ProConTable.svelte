<script lang="ts">
    import CheckURL from "lucide-static/icons/check.svg?url";
    import XURL from "lucide-static/icons/x.svg?url";
    interface Props {
        pros?: import('svelte').Snippet;
        cons?: import('svelte').Snippet;
    }

    let { pros, cons }: Props = $props();
</script>

<div class="procon-table">
    <div class="pro-list" style='--icon-url: url("{CheckURL}")'>
        <h4 class="header">Pros</h4>
        {@render pros?.()}
    </div>
    <div class="con-list" style='--icon-url: url("{XURL}")'>
        <h4 class="header" >Cons</h4>
        {@render cons?.()}
    </div>
</div>
<style lang="scss">
    @use "../../../../variables.scss" as *;
    .procon-table {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        grid-template-areas: "pros cons";
        margin: $space-sm 0;

        .header {
            margin: 0;
            padding: 0;
            font-size: $font-size-md;
            color: $dark-text-color;
            padding: $space-xs;
        }

        .con-list,.pro-list {
            background-color: white;
            :global(ul) {
                margin: 0;
                padding: 0;
            }
            :global(li) {
                padding: $space-xs;
                border-bottom: 1px solid $dark-text-color;
                
                list-style-type: none;


                &:last-child {
                    border-bottom: none;
                }
                &:before {
                    content: "";
                    display: inline-block;
                    width: 1.1em;
                    height: 1.1em;
                    box-sizing: border-box;
                    margin-right: 0.5em;
                    background-image: var(--icon-url);
                    background-size: contain;

                    // Move down slightly
                    transform: translateY(0.2em);
                }
            }
        }

        .con-list {
            grid-area: cons;
            .header {
                background-color: $negative-color;
            }
        }
        
        .pro-list {
            grid-area: pros;
            .header {
                background-color: $positive-color;
            }
        }
    }
</style>
