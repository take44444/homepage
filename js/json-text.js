import * as TEXT from './text.js'

export function addJsonTexts2Container(
    x, y, lineHeight, json, posX, line, depth, container
) {
    if (posX === 0) container.addChild(lineNumText(x, y, line, lineHeight));
    if (json instanceof Object) {
        container.addChild(
            textAt(x, y, lineHeight, line, posX,
                (json instanceof Array) ? '[' : '{', 0x000000
            )
        );
        line++;depth++;
        let keys = (json instanceof Array) ?
            Array.from({length: 10}, (_, i) => i) :
            ['title', 'data', 'name', 'url', 'description'];

        let f = false;
        for (const key of keys) {
            if (!(key in json)) continue;
            if (f) {
                container.addChild(
                    textAt(x, y, lineHeight, line, posX, ',', 0x000000)
                );
                line++;
            }
            container.addChild(lineNumText(x, y, line, lineHeight));
            posX = depth*2;
            if (!(json instanceof Array)) {
                container.addChild(
                    textAt(x, y, lineHeight, line, posX, `"${key}"`, 0x007700)
                );
                posX += key.length+2;
                container.addChild(
                    textAt(x, y, lineHeight, line, posX, `:`, 0x000000)
                );
                posX += 2;
            }
            [posX, line] = addJsonTexts2Container(
                x, y, lineHeight, json[key], posX, line, depth, container
            );
            f = true;
        }
        line++;depth--;

        container.addChild(lineNumText(x, y, line, lineHeight));
        posX = depth*2;
        container.addChild(textAt(x, y, lineHeight, line, posX,
            (json instanceof Array) ? ']' : '}', 0x000000
        ));
        return [posX+1, line];
    }
    let string = textAt(x, y, lineHeight, line, posX,
        `"${json}"`, json.includes('.') ? 0x0077FF : 0xCC4400
    );
    if (json.includes('.')) {
        string.interactive = true;
        string.buttonMode = true;
        string.on(
            'pointertap', () => window.open(`https://${json}`, '_blank')
        );
    }
    container.addChild(string);
    return [posX+json.length+2, line];
}

export function lineNumText(x, y, line, lineHeight) {
    return textAt(
        x, y, lineHeight, line, -3, `${('  ' + line).slice(-2)}`, 0x666666
    );
}

function textAt(x, y, lineHeight, line, posX, string, color) {
    let charWidth = lineHeight*0.8*0.6;
    return TEXT.Text(
        x+(3+posX)*charWidth, y+lineHeight*(line-0.9), lineHeight*0.8,
        string, color
    );
}