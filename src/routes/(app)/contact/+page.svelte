<script lang="ts">
    import { enhance } from "$app/forms";

    import LiveCard from "$lib/components/utilities/LiveCard.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import CopyAction from "$lib/components/utilities/CopyAction.svelte";
    import { liveCardEffect } from "$lib/effects/liveCardEffect";
    import { Send, CircleCheck, TriangleAlert, Linkedin, Github, Mail, Check } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";

    const messageMaxLength = 1024;

    let nameInput: string | undefined = $state();
    let emailInput: string | undefined = $state();
    let messageInput: string | undefined = $state();

    let nameChanged = $state(false);
    let emailChanged = $state(false);
    let messageChanged = $state(false);

    let formState: 'idle' | 'submitting' | 'success' | 'error' = $state('idle');
    let errorMessage: string = $state('');

    $effect.pre(() => {
        nameChanged = !!nameInput && nameChanged;
    });
    $effect.pre(() => {
        emailChanged = !!emailInput && emailChanged;
    });
    $effect.pre(() => {
        messageChanged = !!messageInput && messageChanged;
    });

    let nameInputValid =
        $derived(nameInput &&
        nameInput.length > 0 &&
        nameInput.length < messageMaxLength);
    let emailInputValid =
        $derived(emailInput?.split("")?.filter((x) => x == "@")?.length == 1);
    let messageInputValid =
        $derived(messageInput &&
        messageInput.length >= 3 &&
        messageInput.length <= messageMaxLength);

    let formValid =
        $derived(nameInput &&
        emailInput &&
        messageInput &&
        emailInputValid &&
        messageInputValid);

    function resetForm() {
        nameInput = undefined;
        emailInput = undefined;
        messageInput = undefined;
        nameChanged = false;
        emailChanged = false;
        messageChanged = false;
        formState = 'idle';
        errorMessage = '';
    }

</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
    SEOData={{
        type: "mainpage",
        description: "Get in touch!",
        slug: "/contact",
        title: "Jasper M-W | Contact Me",
    }}
>
<div class="prose-wrapper">

    <h1 class="page-header">Send me a message!</h1>
    <p class="intro">Have a question, want to collaborate, or just want to say hello? Drop me a message below and I'll get back to you.</p>
    
    {#if formState === 'success'}
    <div class="result-card" in:fly={{ y: 20 }}>
        <LiveCard size="large" type="none">
            <div class="result-content">
                <CircleCheck size="2.5rem" strokeWidth="1.5" />
                <h2>Message sent!</h2>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
                <button class="result-button success-button" onclick={resetForm}>
                    <Send />
                    Send another
                </button>
            </div>
        </LiveCard>
    </div>
    {:else if formState === 'error'}
    <div class="result-card" in:fly={{ y: 20 }}>
        <LiveCard size="large" type="none">
            <div class="result-content error">
                <TriangleAlert size="2.5rem" strokeWidth="1.5" />
                <h2>Something went wrong</h2>
                <p>{errorMessage}</p>
                <button class="result-button error-button" onclick={() => { formState = 'idle'; }}>
                    Try again
                </button>
            </div>
        </LiveCard>
    </div>
    {:else}
    <form method="post" use:enhance={() => {
        formState = 'submitting';
        return async ({ result }) => {
            if (result.type === 'success') {
                formState = 'success';
            } else if (result.type === 'failure') {
                errorMessage = (result.data as { error?: string })?.error || 'Failed to send message. Please try again.';
                formState = 'error';
            } else {
                errorMessage = 'An unexpected error occurred. Please try again.';
                formState = 'error';
            }
        };
    }}>
            <!-- Honeypot field - visually hidden from users, traps bots -->
            <div class="hp-field" aria-hidden="true">
                <label for="website">Website</label>
                <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
            </div>

            <div class="form-group">
                <div class="form-inside">
                    <label for="name">Name</label>
                    <LiveCard
                    size="wrap"
                    style={!nameInputValid && nameChanged ? "error" : "normal"}
                    >
                    <input
                    required
                    bind:value={nameInput}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    onblur={() => {
                        nameChanged = true;
                    }}
                        />
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
                    <LiveCard
                    size="wrap"
                    style={!emailInputValid && emailChanged
                            ? "error"
                            : "normal"}
                    >
                    <input
                    required
                    bind:value={emailInput}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.org"
                    onblur={() => {
                        emailChanged = true;
                    }}
                        />
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
                <label for="message"
                >Message
                
                <span class="helper-text">
                    {#if !messageInputValid && messageChanged}
                    &nbsp;
                    <span class="validation" transition:fade>
                        Please enter a message between 3 and {messageMaxLength}
                        characters
                    </span>
                    {:else}{/if}
                </span>
            </label>
            <LiveCard
            size="wrap"
            style={!messageInputValid && messageChanged
                        ? "error"
                        : "normal"}
                >
                <textarea
                required
                class=""
                bind:value={messageInput}
                id="message"
                name="message"
                placeholder="Interesting message here..."
                onblur={() => {
                    messageChanged = true;
                }}
                    ></textarea>
                </LiveCard>
                <div class="detail-row right">
                    <span class="helper-text message-length">
                        {messageInput?.length || 0} / {messageMaxLength}
                    </span>
                </div>
                <div class="detail-row left">
                    <button
                    class="submit-button"
                    type="submit"
                    disabled={!formValid || formState === 'submitting'}
                    title={formValid
                            ? "Send message"
                            : "Please fill all fields"}
                    >
                    <Send />
                    {formState === 'submitting' ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    </form>
    {/if}
</div>
</PrimaryLayout>

<style lang="scss">
    @use "../../../variables.scss" as *;
    @use "sass:color";

    .intro {
        color: $hint-color;
        margin-bottom: $space-sm;
    }

    .result-card {
        margin-top: $space-sm;

        .result-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.5rem;
            padding: $space-sm;

            h2 {
                margin: 0;
            }

            p {
                color: $hint-color;
                margin: 0;
            }

            &.error {
                color: $negative-color;
            }
        }

        .result-button {
            margin-top: $space-xs;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: $border-radius;
            cursor: pointer;
            transition: background-color $transition-base;
            @include icon-inline;

            &.success-button {
                background-color: $primary-color;
                color: white;

                &:hover {
                    background-color: color.adjust($primary-color, $alpha: -0.2);
                }
            }

            &.error-button {
                background-color: $negative-color;
                color: white;

                &:hover {
                    background-color: color.adjust($negative-color, $alpha: -0.2);
                }
            }
        }
    }

    .hp-field {
        position: absolute;
        left: -9999px;
        top: -9999px;
        opacity: 0;
        height: 0;
        width: 0;
        overflow: hidden;
    }

    form {
        color-scheme: light;
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
                background-color: $background-color;
                color: $text-color;

                &::placeholder {
                    color: $hint-color;
                }
            }
            textarea {
                resize: vertical;
                min-height: 6rem;
                @include body-font;
            }

            .helper-text {
                font-size: $font-size-sm;
                color: $hint-color;
            }
            .detail-row {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                &.left {
                    flex-direction: row;
                }
                &.right {
                    flex-direction: row-reverse;
                }
            }

            .submit-button {
                background-color: $primary-color;
                color: white;
                border: none;
                padding: 1rem;
                border-radius: $border-radius;
                transition: background-color $transition-base;
                width: max-content;
                float: right;
                cursor: pointer;

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
