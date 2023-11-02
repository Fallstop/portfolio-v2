interface ColourRange {
    minHue: number;
    maxHue: number;
    chance: number;
}

export function generateColor(): RGBColour {
    // let minHue = 0.68;
    // let maxHue = 0.97;
    // let hue = minHue + Math.random() * (maxHue - minHue);
    // let hueRanges = [[0.68,0.82],[0.93,0.97]];
    let hueRanges: ColourRange[] = [{
        minHue: 0.68,
        maxHue: 0.78,
        chance: 0.8
    }, {
        minHue: 0.93,
        maxHue: 0.97,
        chance: 0.2
    }
]
    let hue = 0;
    let chance = Math.random();
    for (let i = 0; i < hueRanges.length; i++) {
        if (chance < hueRanges[i].chance) {
            hue = hueRanges[i].minHue + Math.random() * (hueRanges[i].maxHue - hueRanges[i].minHue);
            break;
        } else {
            chance -= hueRanges[i].chance;
        }
    }


    const c = HSVtoRGB(hue, 1.0, 1.0);
    let scale = 0.02;
    c.r *= scale;
    c.g *= scale;
    c.b *= scale;
    console.log(c)
    return c;
    // return {
    //     r: 0.02,
    //     g: 0,
    //     b: 0.01
    // }
}

function HSVtoRGB(h: number, s: number, v: number): RGBColour {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }

    return {
        r: r ?? 0,
        g: g ?? 0,
        b: b ?? 0
    };
}