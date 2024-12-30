import { default as canvasLib } from "canvas";
import seedrandom from "seedrandom";
import { ShapeStyle, TextStyle, WrappedText, accentFont, drawBgImage, paragraphFont, registerFonts, tileFont } from "./canvasUtil";
import { randomOrderList } from "$lib/utilities/math";
import { ogImageHeight, ogImagePadding, ogImageWidth } from "$lib/components/layout/SEO.svelte";


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

let blackenOverlay = new ShapeStyle({
    fillStyle: "#000",
    strokeStyle: "",
    lineWidth: 0
});

export default async function renderCanvas(opts: GenerationOptions): Promise<Buffer> {
    const {projectDate, projectDescription, projectName, backgroundImage} = opts;

    // Initialize
    const canvas = createCanvas(ogImageWidth, ogImageHeight);
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error("Failed to create Canvas");
    }
    registerFonts();

    let seeded_rng = seedrandom(projectName);



    await drawBgImage(context, backgroundImage, ogImageWidth, ogImageHeight);

    // Gradient spans across 5 canvases, choose where to start and send;
    const gradientSize = 2;
    const randomXPos = seeded_rng() * (gradientSize - 1);
    const randomYPos = seeded_rng() * (gradientSize - 1);
    const gradientXOffset = randomXPos * ogImageWidth;
    const gradientYOffset = randomYPos * ogImageHeight;

    let bgGradient = context.createLinearGradient(0 - gradientXOffset, 0 - gradientYOffset, (ogImageWidth * gradientSize) - gradientXOffset, (ogImageHeight* gradientSize) - gradientYOffset);
    let keyColours = randomOrderList(["#451952", "#662549", "#AE445A", "#F39F5A", "#451952"], seeded_rng);

    for (let i = 0; i < keyColours.length; i++) {
        let ratio = i / (keyColours.length-1)
        bgGradient.addColorStop(ratio, keyColours[i])
    }

    context.fillStyle = bgGradient;
    context.globalAlpha = 0.6;
    context.fillRect(0,0,ogImageWidth,ogImageHeight)
    
    context.globalAlpha = 0.4;
    blackenOverlay.canvasApply(context);
    context.fillRect(0,0,ogImageWidth,ogImageHeight)

    context.globalAlpha = 1;

    
    const text_width_space = ogImageWidth - (ogImagePadding*2)

    let dateText = new WrappedText(context, projectDate, text_width_space, AccentTextStyle);
    let titleText = new WrappedText(context, projectName, text_width_space, TitleTextStyle);
    let descriptionText = new WrappedText(context, projectDescription, text_width_space, ParagraphTextStyle);
    
    // Draw text from the bottom up
    let bottom_y = ogImageHeight - ogImagePadding;
    bottom_y -= descriptionText.draw(ogImagePadding, bottom_y - descriptionText.total_height);
    bottom_y -= titleText.draw(ogImagePadding, bottom_y - titleText.total_height);
    bottom_y -= dateText.draw(ogImagePadding, bottom_y - dateText.total_height);



    // let blobFile: Blob = await new Promise((resolve, reject)=>{
        //     const buffer = canvas.toBlob((blob)=>{
    //         if (blob) {
    //             resolve(blob)
    //         } else {
    //             reject()
    //         }
    //     },'image/jpeg', { quality: 1 });
    // })
    return canvas.toBuffer('image/jpeg', { quality: 1 });
};    
