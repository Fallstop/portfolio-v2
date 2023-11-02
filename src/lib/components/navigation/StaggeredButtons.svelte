<script>
    import NavigationButton from "./NavigationButton.svelte";
    import { Code2, User, Sword, Mail } from "lucide-svelte";

</script>
<div class="staggered-buttons" >
    <div class="empty" />
    <NavigationButton
        pageSlug="/projects"
        title="Projects"
        icon={Code2}
        primary
    />
    <NavigationButton pageSlug="/about" title="About" icon={User} />
    <NavigationButton pageSlug="/skills" title="Skills" icon={Sword} />
    <NavigationButton pageSlug="/contact" title="Contact" icon={Mail} />
    <div class="empty"/>
</div>

<style lang="scss">
                .staggered-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                grid-gap: 2rem;
                padding: 2rem 0;
            }
            @media screen and (max-width: $tablet-breakpoint) {

                .staggered-buttons {
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    grid-gap: 1rem;
                    padding: 0 2rem 2rem 2rem;
                    .empty {
                        // Not needed in column layout
                        display: none;
                    }
                }
            }

            @media screen and (max-width: $mobile-breakpoint) {
                .staggered-buttons {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 2rem 2rem 2rem;
                    .empty {
                        // Not needed in column layout
                        display: none;
                    }
                }
            }

</style>