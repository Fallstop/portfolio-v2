<script lang="ts">

    import Name from "$lib/assets/svg/Name.svelte"
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";

</script>
<svelte:head>
    <title>Jasper Miller-Waugh | Portfolio</title>
</svelte:head>
<PrimaryLayout
    fluid_sim_background
    fluid_sim_interactive
    personal_headshot
    SEOData={{
		type: "mainpage",
        description: "I'm a engineering student at the University of Auckland, and I've got a passion for making.",
        slug: "",
        title: "Jasper M-W",
	}}
>
    <div class="name-title" title="Jasper M-W">
        <Name/>
    </div>
</PrimaryLayout>

<style lang="scss">
    @use "../../variables.scss" as *;
    .name-title {
        box-sizing: border-box;
        padding: 0;
        line-height: 1;
        width: 110%;
        height: 100%;

        :global(svg) {
            width: 100%;
        }

        @media screen and (max-width: $tablet-breakpoint) {
            width: 100%;
            padding: 2rem;
        }

    }

</style>