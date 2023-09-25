<script context="module" lang="ts">
    import MarkdownImage from "./MarkdownImage.svelte";
    import TimeTableDay from "./ProjectAssets/TimeTableDay.svelte";
    import "./markdown.scss";
    import "./prism-nord.scss";

    export {MarkdownImage as img, TimeTableDay as timetableday};
</script>
<slot/>