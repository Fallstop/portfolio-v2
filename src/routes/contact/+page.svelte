<script>
    import { enhance } from "$app/forms";

    import LiveCard from "$lib/components/LiveCard.svelte";
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";
    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import { Send } from "lucide-svelte";
</script>

<PrimaryLayout
    fluid_sim_background
    navigation_option={NavigationOption.Midpoint}
    personal_headshot
>
    <h1>Send me a message!</h1>
    <form method="post" use:enhance>
        <div class="form-inside">
            <label for="name">Name</label>
            <LiveCard size="wrap">
                <input type="text" id="name" name="name" />
            </LiveCard>
        </div>
        <div class="form-inside">
            <label for="email">Email</label>
            <LiveCard size="wrap">
                <input type="email" id="email" name="email" />
            </LiveCard>
        </div>
        <div class="form-inside">
            <label for="message">Message</label>
            <LiveCard size="wrap">
                <textarea id="message" name="message"></textarea>
            </LiveCard>
        </div>
        <div class="form-inside">
            <button class="submit-button" type="submit">
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
        gap: 1rem;

        .form-inside {
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
            }
            .submit-button {
                background-color: $primary-color;
                color: white;
                border: none;
                padding: 1rem;
                border-radius: $border-radius;
                cursor: pointer;
                transition: background-color 0.2s ease-in-out;
                width: max-content;
                @include icon-inline;

                &:hover {
                    background-color: color.adjust(
                        $primary-color,
                        $alpha: -0.2
                    );
                }
            }
        }
    }
</style>
