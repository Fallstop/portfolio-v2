<script lang="ts">
    import { enhance } from "$app/forms";

    import LiveCard from "$lib/components/LiveCard.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import { Send } from "lucide-svelte";
    import { fade } from "svelte/transition";

    const messageMaxLength = 1024;

    let nameInput: string | undefined;
    let emailInput: string | undefined;
    let messageInput: string | undefined

    let nameChanged = false;
    let emailChanged = false;
    let messageChanged = false;

    $: nameChanged = !!nameInput && nameChanged;
    $: emailChanged = !!emailInput && emailChanged;
    $: messageChanged = !!messageInput && messageChanged;

    $: nameInputValid = nameInput && nameInput.length > 0 && nameInput.length < messageMaxLength;
    $: emailInputValid = emailInput?.split("")?.filter((x)=>x=="@")?.length == 1;
    $: messageInputValid = messageInput && messageInput.length > 3 && messageInput.length < messageMaxLength;

    $: formValid = nameInput && emailInput && messageInput && emailInputValid && messageInputValid;

</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
>
    <h1 class="page-header">Send me a message!</h1>
    <form method="post" use:enhance >
        <div class="form-group">
            <div class="form-inside">
                <label for="name">Name</label>
                <LiveCard size="wrap" style={!nameInputValid && nameChanged ? "error" : "normal"} >
                    <input required bind:value={nameInput} type="text" id="name" name="name" placeholder="Something close to a name here" on:blur={()=>{nameChanged=true}}/>
                </LiveCard>
                <div class="helper-text">
                    {#if !nameInputValid && nameChanged}
                        <span class="validation" transition:fade>
                            Please enter a name, less than {messageMaxLength} characters
                        </span>
                    {:else}
                        &nbsp;
                    {/if}
                </div>
            </div>
            <div class="form-inside">
                <label for="email">Email</label>
                <LiveCard size="wrap" style={!emailInputValid && emailChanged ? "error" : "normal"}>
                    <input required bind:value={emailInput} type="email" id="email" name="email" placeholder="Mail of the E variant" on:blur={()=>{emailChanged=true}}/>
                </LiveCard>
                <div class="helper-text">
                    {#if !emailInputValid && emailChanged}
                        <span class="validation" transition:fade>
                            Please enter a valid email address
                        </span>
                    {:else}
                        &nbsp;
                    {/if}
                </div>
            </div>
        </div>
        <div class="form-inside">
            <label for="message">Message</label>
            <LiveCard size="wrap" style={!messageInputValid && messageChanged ? "error" : "normal"}>
                <textarea required bind:value={messageInput} id="message" name="message" placeholder="Interesting message here..." on:blur={()=>{messageChanged=true}}></textarea>
            </LiveCard>
            <div class="helper-text">
                {#if !messageInputValid && messageChanged}
                    <span class="validation" transition:fade>
                        Please enter a message between 3 and {messageMaxLength} characters
                    </span>
                {:else}
                    &nbsp;
                {/if}
                <span class="message-length">
                    {messageInput?.length || 0} / {messageMaxLength}
                </span>
            </div>
        </div>
        <div class="form-inside">
            <button class="submit-button" type="submit" disabled={!formValid}>
                <Send />
                Send
            </button>
        </div>
    </form>
</PrimaryLayout>

<style lang="scss">
    @use "../../variables.scss" as *;
    @use "sass:color";
    form {
        display: flex;
        flex-direction: column;

        .form-group {
            display: flex;
            flex-direction: row;
            gap: 0 1rem;
            width: 100%;
            flex-grow: 1;

            @media screen and (max-width: $mobile-breakpoint) {
                flex-direction: column;
            }
        }

        .form-inside {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            border-radius: $border-radius;

            input,
            textarea {
                box-sizing: border-box;
                border: none;
                width: 100%;
                padding: 0.75rem;
                border-radius: $border-radius;
            }
            textarea {
                resize: vertical;
                min-height: 6rem;
                @include body-font;
            }


            .helper-text {
                font-size: 0.75rem;
                color: $hint-color;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .submit-button {
                background-color: $primary-color;
                color: white;
                border: none;
                padding: 1rem;
                border-radius: $border-radius;
                transition: background-color 0.2s ease-in-out;
                width: max-content;

                @include icon-inline;

                &:hover {
                    background-color: color.adjust(
                        $primary-color,
                        $alpha: -0.2
                    );
                }
                &:disabled {
                    background-color: color.adjust(
                        $primary-color,
                        $alpha: -0.5
                    );
                }
            }
        }
    }
</style>
