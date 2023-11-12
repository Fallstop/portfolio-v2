<script lang="ts">
    import PrimaryLayout from "$lib/components/layout/PrimaryLayout.svelte";


    import { NavigationOption } from "$lib/components/layout/layoutDataStore";
    import { getAge } from "./getPersonalDetails";
    import FactBox from "./FactBox.svelte";

    export let data: import("./$types").PageData;

</script>
<PrimaryLayout fluid_sim_background  navigation_option={NavigationOption.Midpoint} personal_headshot>
    <h1>Kia ora, I'm Jasper M-W.</h1>
    <h3>
        I'm a Highschollar at Huanui College, who's spent the last 3 years building random projects in my spare time.
    </h3>
    <p>
        I'm a full-full stack developer, my projects range from creating custom circuit-boards to designing bespoke websites. I like to think of myself as a jack of all trades, master of <i>some</i>.
    </p>
    <h3>
        Quick Fire Facts
    </h3>
    <div class="fact-container">

        <FactBox title="Unusable CV Boosters" description="I'm the 2023 Head Boy of Huanui College" />
        <FactBox title="Age" description={getAge().toString()} />
        {#if Math.random() > 0.9}
            <FactBox title="Current Location" description="Inside of your walls" />
        {:else}
            <FactBox title="Location" description="Whangarei, New Zealand" />
        {/if}
        <FactBox title="Best frontend framework" description="Sveltekit" />
        <FactBox title="Last Update This Section" description="2023-11-12" />
        <FactBox title="Favourite Programming Language" description="Rust" />
        <FactBox title="Severs in basement" description="5" />
        <FactBox title="Favourite IDE" description="VSCode" />
        <FactBox title="BrainF*ck Interpreters Developed" description="8" />
        <FactBox title="Tasks pointlessly automated" description="Uncountable" />
        <FactBox title="Github Repo Count" description={data.github.totalRepoCount.toString()} />

    </div>


</PrimaryLayout>

<style lang="scss">
    @use "../../variables.scss" as *;
    .fact-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
    }
</style>