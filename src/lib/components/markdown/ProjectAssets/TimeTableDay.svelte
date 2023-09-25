<script lang="ts">
    import { onMount } from "svelte";

    let text = "Loading...";
    onMount(async ()=>{
        try {
            let request = await fetch("https://hctools.jmw.nz/api/gettimetableday");
            
            if (!request.ok) throw new Error("Request failed");

            let data = await request.json();
            
            if (data["isSchoolDay"]) {
                text = "Day " + data["dayNumber"];
            } else if (!data["isSchoolDay"]) {
                text = "Not a school day"
            }
            else if ('internalError' in data) {
                console.log("Error in gettimetableday API");
                console.log(data["internalError"]);
                text = "Internal Error";
            }

        } catch {
            console.log("Error in gettimetableday API");
            text = "Internal Error";
        }
    });
</script>
<code>
    {text}
</code>