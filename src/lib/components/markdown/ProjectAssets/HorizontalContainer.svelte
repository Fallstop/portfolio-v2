<div class="horizontal-container">
    <slot/>
</div>

<style lang="scss">
    .horizontal-container {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>