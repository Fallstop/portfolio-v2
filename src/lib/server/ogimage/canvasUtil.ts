import { NodeCanvasRenderingContext2D, default as canvasLib } from "canvas";

const {registerFont, loadImage} = canvasLib

export const tileFont = "Work Sans";
export const paragraphFont = "Open Sans";
export const accentFont = "Accent Sans";


export function registerFonts() {
    registerFont('./src/lib/server/ogimage/assets/OpenSans-ExtraBold.ttf', { family: tileFont });
    registerFont('./src/lib/server/ogimage/assets/OpenSans-Regular.ttf', { family: paragraphFont });
    registerFont('./src/lib/server/ogimage/assets/OpenSans-Bold.ttf', { family: accentFont });
}

export class WrappedText {
    ctx: NodeCanvasRenderingContext2D
    text_lines: string[] = []
    line_width: number
    line_height: number
    total_height: number
    text_style: TextStyle
    constructor (ctx: NodeCanvasRenderingContext2D, text: string, line_width: number, text_style: TextStyle) {
        this.ctx = ctx;
        this.line_width = line_width;
        this.text_style = text_style;
        this.line_height = this.text_style.lineHeight * this.text_style.fontSize;

        this.text_style.canvasApply(this.ctx);

        let line = '';
        let paragraphs = text.split('\n');

        for (let i = 0; i < paragraphs.length; i++) {
            
            let words = paragraphs[i].split(' ');

            for (var n = 0; n < words.length; n++) {

                var testLine = line + words[n] + ' ';
                
                var metrics = this.ctx.measureText(testLine);

                var testWidth = metrics.width;
                if (testWidth > line_width && n > 0) {
                    this.text_lines.push(line)
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            this.text_lines.push(line);
            line = '';
        }

        this.total_height = this.text_lines.length * this.line_height;
    }
    draw(x: number, y: number): number {
        this.text_style.canvasApply(this.ctx);

        let y_diff = 0;
        for (const line of this.text_lines) {
            this.ctx.fillText(line,x,y+y_diff)
            y_diff += this.line_height;
        }
        return y_diff
    }
}



export class TextStyle {
    fontSize: number
    fontName: string
    textAlign: CanvasTextAlign
    textBaseline: CanvasTextBaseline
    fillStyle: string
    lineHeight: number

    constructor({
        fontSize,
        fontName,
        textAlign,
        textBaseline,
        fillStyle,
        lineHeight = 1.4
    }: {
        fontSize: number
        fontName: string
        textAlign: CanvasTextAlign
        textBaseline: CanvasTextBaseline
        fillStyle: string,
        lineHeight: number
    }) {
        this.fontSize = fontSize
        this.textAlign = textAlign
        this.textBaseline = textBaseline
        this.fillStyle = fillStyle
        this.fontName = fontName
        this.lineHeight = lineHeight
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