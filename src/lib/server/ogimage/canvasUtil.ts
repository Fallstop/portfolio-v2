import { NodeCanvasRenderingContext2D, default as canvasLib } from "canvas";

const {registerFont, loadImage} = canvasLib

export const tileFont = "Work Sans";
export const paragraphFont = "Open Sans";

export function registerFonts() {
    registerFont('./src/lib/server/ogimage/assets/josefin-sans-all-300-normal.ttf', { family: tileFont });
    registerFont('./src/lib/server/ogimage/assets/open-sans-all-400-normal.ttf', { family: paragraphFont }); 
}

export function wrapText(context: NodeCanvasRenderingContext2D, text: string, x: number, y: number, line_width: number, line_height: number) {
    var line = '';
    var paragraphs = text.split('\n');

    for (var i = 0; i < paragraphs.length; i++) {
        var words = paragraphs[i].split(' ');
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > line_width && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += line_height;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
        y += line_height;
        line = '';
    }

    return y;
}


export class TextStyle {
    fontSize: number
    fontName: string
    textAlign: CanvasTextAlign
    textBaseline: CanvasTextBaseline
    fillStyle: string

    constructor({
        fontSize,
        fontName,
        textAlign,
        textBaseline,
        fillStyle,
    }: {
        fontSize: number
        fontName: string
        textAlign: CanvasTextAlign
        textBaseline: CanvasTextBaseline
        fillStyle: string
    }) {
        this.fontSize = fontSize
        this.textAlign = textAlign
        this.textBaseline = textBaseline
        this.fillStyle = fillStyle
        this.fontName = fontName
    }

    canvasApply(ctx: NodeCanvasRenderingContext2D) {
        ctx.font = `${this.fontSize}pt ${this.fontName}`
        ctx.textAlign = this.textAlign
        ctx.textBaseline = this.textBaseline
        ctx.fillStyle = this.fillStyle
    }
}

export class ShapeStyle {
    fillStyle: string
    strokeStyle: string
    lineWidth: number

    constructor({
        fillStyle,
        strokeStyle,
        lineWidth,
    }: {
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number,    
    }) {
        this.fillStyle = fillStyle
        this.strokeStyle = strokeStyle
        this.lineWidth = lineWidth
    }

    canvasApply(ctx: NodeCanvasRenderingContext2D) {
        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = this.fillStyle
        ctx.strokeStyle = this.strokeStyle
    }
}


export async function drawBgImage(ctx: NodeCanvasRenderingContext2D, backgroundImage: Buffer, pageWidth: number, pageHeight: number) {
    const backgroundSlate = await loadImage(backgroundImage);
    const imageWidth = backgroundSlate.naturalWidth, imageHeight = backgroundSlate.naturalHeight;

    let scaledWidth = pageWidth;
    let scaledHeight = pageHeight;

    const widthScale = pageWidth / imageWidth;
    const heightScale = pageHeight / imageHeight;

    if (Math.abs(widthScale - 1) > Math.abs(heightScale - 1)) {
        // Width is further
        scaledHeight = imageHeight * widthScale;
    } else {
        // Height is further
        scaledWidth = imageWidth * heightScale;
    }


    ctx.drawImage(backgroundSlate, 0, 0, scaledWidth, scaledHeight);
    
}