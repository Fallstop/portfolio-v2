<a href="/projects" class="more-projects">
    <span class="more-header">More Projects</span>
</a>

<style lang="scss">
    @use "../../../variables.scss" as *;
    .more-projects {
        text-decoration: none;
        flex-grow: 1;
        flex-shrink: 1;
        min-width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px dashed $mid-tone;
        border-radius: $border-radius;
        color: $mid-tone;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        transition: all 0.2s ease-in-out;
        &:hover {
            border-color: $text-color;
            color: $text-color;
        }

        @media print {
            display: none;
        }
    }
</style>
