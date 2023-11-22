---
date: "2021-12-15"
title: "React QR Scanner"
description: "React library to scan user-uploaded PDF's locally for QR codes."
tags: ["software", "react", "covid"]
---

<script>
  import MarkdownLink from "$md/MarkdownLink.svelte";
</script>

<MarkdownLink href="https://github.com/openhealthnz-credentials/pdf-image-qr-scanner">openhealthnz-credentials/pdf-image-qr-scanner</MarkdownLink>
<MarkdownLink href="https://www.npmjs.com/package/@openhealthnz-credentials/pdf-image-qr-scanner">pdf-image-qr-scanner</MarkdownLink>
<MarkdownLink href="https://provida.nz">Provida</MarkdownLink>

### Demos
<MarkdownLink href="https://svelte-pdf-image-scanner.fallstop.workers.dev/">Svelte Demo</MarkdownLink>
<MarkdownLink href="https://github.com/openhealthnz-credentials/pdf-image-qr-scanner/blob/main/examples/svelte">Svelte Source</MarkdownLink>
<MarkdownLink href="https://react-pdf-image-qr-scanner.pages.dev/">React Demo</MarkdownLink>
<MarkdownLink href="https://github.com/openhealthnz-credentials/pdf-image-qr-scanner/blob/main/examples/react">React Source</MarkdownLink>


### Library to scan user-uploaded PDF's locally for QR codes.

This library is a simple way to scan user-uploaded PDF's and images for QR codes on the client-side. It uses PDF.js to render the PDF and jsQR to scan the image and PDF canvas data.


#### Use Case - NZ “My Vaccine Pass”

Provida has healthcare companies as its main clients. Due to vaccination mandates in healthcare in NZ, these customers need to request and store Covid vaccination status for all of their staff and contractors.

Provida has already implemented a “My Vaccine Pass” QR Code reader solution for this. However we have found that our users don’t always have the QR Code available on their phone, or for whatever reason are unable to scan it successfully, e.g. due to low quality camera or just shaky hands!

This was made to be a backup method to upload their vaccination status. It uses the PDF vaccination status document that is emailed out by MoH on receiving the second booster. This has the QR Code embedded in it. The user uploads their PDF document to our application, and we’d parse out the QR Code and decode it automatically, running it through NZCP.js as normal to verify the signature.