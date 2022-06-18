import * as TEXT from './text.js'

export function addJsonTexts2Container(
    x, y, lineHeight, json, posX, line, depth, container
) {
    if (posX === 0) container.addChild(lineNumText(x, y, line, lineHeight));
    if (json instanceof Object) {
        container.addChild(
            textAt(x, y, lineHeight, line, posX,
                (json instanceof Array) ? '[' : '{'
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
                container.addChild(textAt(x, y, lineHeight, line, posX, ','));
                line++;
            }
            container.addChild(lineNumText(x, y, line, lineHeight));
            posX = depth*2;
            if (!(json instanceof Array)) {
                container.addChild(
                    textAt(x, y, lineHeight, line, posX, `"${key}"`)
                );
                posX += key.length+2;
                container.addChild(textAt(x, y, lineHeight, line, posX, `:`));
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
            (json instanceof Array) ? ']' : '}'
        ));
        return [posX+1, line];
    }
    container.addChild(textAt(x, y, lineHeight, line, posX, `"${json}"`));
    return [posX+json.length+2, line];
}

export function lineNumText(x, y, line, lineHeight) {
    return textAt(x, y, lineHeight, line, -3, `${('  ' + line).slice(-2)}`);
}

function textAt(x, y, lineHeight, line, posX, string) {
    let charWidth = lineHeight*0.8*0.6;
    return TEXT.Text(
        x+(3+posX)*charWidth, y+lineHeight*(line-0.9), lineHeight*0.8,
        string, 0x000000
    );
}