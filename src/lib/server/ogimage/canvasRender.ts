import { default as canvasLib } from "canvas";
import fs from "fs"
import roundedRect from "./roundedRectangle"
import { TextStyle, drawBgImage, registerFonts, tileFont, wrapText } from "./canvasUtil";
import { randomOrderList } from "$lib/utilities/math";

let { createCanvas, loadImage } = canvasLib;

interface GenerationOptions {
    projectName: string,
    projectDate: string,
    backgroundImage: Buffer
}

let MainTitleStyle = new TextStyle({
    fillStyle: "#f5f5f5",
    textAlign: "left",
    textBaseline: "top",
    fontSize: 100,
    fontName: tileFont
})

export default async function renderCanvas(opts: GenerationOptions): Promise<Buffer> {
    const {projectDate, projectName, backgroundImage} = opts;

    const height = 630;
    const width = 1200;
    const padding = 80;

    // Initialize
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error("Failed to create Canvas");
    }

    registerFonts();

    context.globalAlpha = 0.5;
    await drawBgImage(context, backgroundImage, width, height);
    context.globalAlpha = 1;

    // Gradient spans across 5 canvases, choose where to start and send;
    const gradientSize = 2;
    const randomXPos = Math.random() * (gradientSize - 1);
    const randomYPos = Math.random() * (gradientSize - 1);
    const gradientXOffset = randomXPos * width;
    const gradientYOffset = randomYPos * height;

    let bgGradient = context.createLinearGradient(0 - gradientXOffset, 0 - gradientYOffset, (width * gradientSize) - gradientXOffset, (height* gradientSize) - gradientYOffset);
    let keyColours = randomOrderList(["#451952", "#662549", "#AE445A", "#F39F5A", "#451952"]);
    console.log(keyColours)
    for (let i = 0; i < keyColours.length; i++) {
        let ratio = i / (keyColours.length-1)
        bgGradient.addColorStop(ratio, keyColours[i])
    }

    context.fillStyle = bgGradient;
    context.globalAlpha = 0.7;
    context.fillRect(0,0,width,height)
    context.globalAlpha = 1;

    MainTitleStyle.canvasApply(context)
    const y = wrapText(context, projectName, padding, padding, 600, 140);

    context.lineWidth = 4;
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.strokeStyle = "#f5f5f5";
    context.beginPath();
    roundedRect(context, padding - 10, padding - 15, 600 + 50, y - padding, 25, true)
    context.stroke();

    MainTitleStyle.canvasApply(context)
    wrapText(context, projectDate, padding, padding, 600, 140);

    const subtitle = projectDate
        ? `${projectDate} · HTTPS://JMW.NZ`
        : 'HTTPS://JMW.NZ';
    context.font = '32pt "Open Sans"';
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillStyle = '#f5f5f5';
    context.fillText(subtitle, padding, height - padding);

    // let blobFile: Blob = await new Promise((resolve, reject)=>{
    //     const buffer = canvas.toBlob((blob)=>{
    //         if (blob) {
    //             resolve(blob)
    //         } else {
    //             reject()
    //         }
    //     },'image/jpeg', { quality: 1 });
    // })
    console.log("Finished Gen")
    return canvas.toBuffer('image/jpeg', { quality: 1 });
};
