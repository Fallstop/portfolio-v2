<!-- Brand icon from lucide 0.562 (ISC); brand icons were removed in lucide 1.0 -->
<script lang="ts">
    import { Icon, type LucideProps } from "@lucide/svelte";
    let props: LucideProps = $props();
</script>

<Icon {...props} iconNode={[["rect", { "width": "20", "height": "20", "x": "2", "y": "2", "rx": "5", "ry": "5" }], ["path", { "d": "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }], ["line", { "x1": "17.5", "x2": "17.51", "y1": "6.5", "y2": "6.5" }]]} />
