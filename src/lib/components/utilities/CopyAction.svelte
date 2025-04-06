<script lang="ts">

    interface Props {
        data: string;
        copyIcon: (copied: boolean) => any;
    }

    let { data, copyIcon }: Props = $props();

    let showPostCopied = $state(false);
    let timeout: NodeJS.Timeout | null = $state(null);

    function copyToClipboard() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(data).then(() => {
                showPostCopied = true;
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(() => {
                    showPostCopied = false;
                    timeout = null;
                }, 2000);
            });
        } else {
            console.error("Clipboard API not supported");
        }
    }
</script>

<button
    type="button"
    onclick={copyToClipboard}
    aria-label="Copy to clipboard"
    style="all: unset;"
>
    {@render copyIcon(showPostCopied)}
</button>