---
date: "2021-04-04"
title: "HC API Tools"
description: "Simple to use API Gateway to access the mess of Huanui Collage Public data with ease."
tags: ["Software", "TypeScript", "Huanui College"]
---
<script lang="ts">
    import TimeTableDay from "$lib/components/markdown/ProjectAssets/TimeTableDay.svelte"
    import MarkdownLink from "$md/MarkdownLink.svelte";
</script>
    
<MarkdownLink href="https://github.com/Fallstop/HC-API-Tools">Fallstop/HC-API-Tools</MarkdownLink>
<MarkdownLink href="https://hctools.jmw.nz/">Swagger API Docs</MarkdownLink>
<MarkdownLink href="https://hcnotices.jmw.nz/">HCNotices Example</MarkdownLink>
<MarkdownLink href="https://sites.google.com/hc.school.nz/student-portal/home">Student Portal Example</MarkdownLink>


# Why this is a thing
Because most of schools data about what events are coming, and what time table day it is, etc is posted on a google calender, which is non-machine friendly with a weird blend of timezones and API keys etc and non-human friendly because it is overly cluttered, also *no calender ever should have bulk text descriptions*. So I have made a simple open-source API Gateway.

## Methods
HTTP API Route: `https://hctools.jmw.nz/api/`

### `gettimetableday/<?date>`
> **Completed**

The time table is completely disjointed from the actual calender, and jumps around a lot. So this API, with an optional date parameter (default is today), it will return a json object like this example:
```json
{ 
    "currentDay": 10, // Returns the current day, not returned if Day X event was missing
    "isSchoolDay": true, // Returns true if Day X event was there, false if it was missing 
    "date": "2069-04-20" // Date requested
}
```

### `getdailynotice/<?date>`
> **Completed**

The daily notices are stored in the description of an google calendar event, not very easy to read due to the small box. This API method makes it easy to retrieve the notice to display in another webapp.
```json
{ 
    "noticeText": "Wow yes notice<br>Remember to filter the HTML before using it!", // Returns the current day, not returned if Day X event was missing
    "isSchoolDay": true, // Returns true if Daily Notice event was there, false if it was missing 
}
```

### `getbelltimes/`
> **Completed**

Easy access to the live, current bell times straight from the same datasource that the actual school bell uses. This API makes is easy to access without having to worry about what part of the sheet to access, and credentials to access it.

*Each number is mapped to each day (zero indexed, week starts on monday)*
```json
{
    "belltimes": {
        "0": [
            "08:43", "08:45",//...
        ],
        "1": [
            "08:45", "09:35", //...
        ],
        "2": [
            "08:43", "08:45",//...
        ],
        "3": [
            "08:43", "08:45", //...
        ],
        "4": [
            "08:43", "08:45", //...
        ],
        "5": [],
        "6": []
    },
}
```

## Example Code

Here is some overly obtuse example code:
```html
<span id="hcTimeTableDay"></span>
<script type="text/javascript">
    const messages = {
        successfulPrefix: "Day ",
        notASchoolDay: "Not a school day",
        errorServerSide: "Internal Error",
    }
    let textSpan = document.getElementById("hcTimeTableDay");
    fetch("https://hctools.jmw.nz/api/gettimetableday")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data["isSchoolDay"]) {
                console.log(data["currentDay"]);
                textSpan.innerHTML = messages.successfulPrefix + data["currentDay"];
            } else if (!data["isSchoolDay"]) {
                textSpan.innerHTML = messages.notASchoolDay;
            }
            else if ('internalError' in data) {
                console.log("Error in gettimetableday API");
                console.log(data["internalError"]);
                textSpan.innerHTML = messages.errorServerSide;
            }
            
        })
        .catch(error => {
            console.log("Error in gettimetableday API");
            textSpan.innerHTML = messages.errorServerSide;
        });
</script>
```

## Is it currently working?

Well, lets test it out by finding the current Timetable Day: <TimeTableDay/>