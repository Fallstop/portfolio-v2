import { default as canvasLib } from "canvas";
import fs from "fs"
import roundedRect from "./roundedRectangle"
import { TextStyle, WrappedText, accentFont, drawBgImage, paragraphFont, registerFonts, tileFont, wrapText } from "./canvasUtil";
import { randomOrderList } from "$lib/utilities/math";

let { createCanvas, loadImage } = canvasLib;

interface GenerationOptions {
    projectName: string,
    projectDescription: string,
    projectDate: string,
    backgroundImage: Buffer
}

let TitleTextStyle = new TextStyle({
    fillStyle: "#f5f5f5",
    textAlign: "left",
    textBaseline: "top",
    fontSize: 60,
    fontName: tileFont,
    lineHeight: 1.8
});
let ParagraphTextStyle = new TextStyle({
    fillStyle: "#f5f5f5",
    textAlign: "left",
    textBaseline: "top",
    fontSize: 40,
    fontName: paragraphFont,
    lineHeight: 1.4
});
let AccentTextStyle = new TextStyle({
    fillStyle: "#F39F5A",
    textAlign: "left",
    textBaseline: "top",
    fontSize: 40,
    fontName: accentFont,
    lineHeight: 1.8
});
export default async function renderCanvas(opts: GenerationOptions): Promise<Buffer> {
    const {projectDate, projectDescription, projectName, backgroundImage} = opts;
    console.log(opts)

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

    context.globalAlpha = 0.4;
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
    context.globalAlpha = 0.4;
    context.fillRect(0,0,width,height)
    context.globalAlpha = 1;

    
    const text_width_space = width - (padding*2)

    let dateText = new WrappedText(context, projectDate, text_width_space, AccentTextStyle);
    let titleText = new WrappedText(context, projectName, text_width_space, TitleTextStyle);
    let descriptionText = new WrappedText(context, projectDescription, text_width_space, ParagraphTextStyle);
    
    // Draw text from the bottom up
    let bottom_y = height - padding;
    bottom_y -= descriptionText.draw(padding, bottom_y - descriptionText.total_height);
    bottom_y -= titleText.draw(padding, bottom_y - titleText.total_height);
    bottom_y -= dateText.draw(padding, bottom_y - dateText.total_height);



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
