<script lang="ts">
    export let data: import("./$types").PageData;
</script>

<div class="project-container">
    <h1>Projects</h1>
    <ul class="project-list">
        {#each data.posts as post}
            <a href={post.slug}>
                <li class="post">
                    <h2 class="header">
                        <span>{post.title}</span>
                        <span class="date">{post.date}</span>
                    </h2>
                    <p class="description">{post.description}</p>
                </li>
            </a>
        {/each}
    </ul>
</div>

<style lang="scss">
    @use "../../app.scss" as *;
    .project-container {
        .project-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-items: stretch;
            width: 100%;
            gap: 2rem;
            a {
                text-decoration: none;
                flex-grow: 1;
                flex-shrink: 1;
                min-width: 100px;
                display: table;
                width: 1%;
                border: 1px solid $text-color;
                    padding: 1rem;


                .post {
                    height: 100%;

                    .header {
                        font-size: 2rem;
                        font-weight: bold;
                        text-decoration: none;
                        color: $text-color;
                        white-space: nowrap;
                        margin: 0;
                        &:hover {
                            color: $secondary-color;
                        }
                    }
                    .date {
                        font-size: 1.2rem;
                        color: $secondary-color;
                        @include body-font;
                    }
                    .description {
                        font-size: 1.2rem;
                        color: $text-color;
                        margin: 0.5rem 0;
                    }
                }
            }
        }
    }
</style>
