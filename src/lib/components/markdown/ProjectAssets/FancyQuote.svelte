<blockquote>
    <span class="quote-mark">“</span><slot/><span class="quote-mark">”</span>

</blockquote>
<div class="author">
    - <slot name="author"/>
</div>
<style lang="scss">
    blockquote {
        margin-bottom: 0;
    }
    .author {
        padding-left: 4rem;
        font-weight: bold;
        font-style: italic;
        font-size: 0.9rem;
    }
    .quote-mark {
        font-weight: bold;

    }
</style>