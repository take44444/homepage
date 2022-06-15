import * as PIXI from 'pixi.js';

export function jsonViewer (x, y, width, height, lineHeight, name, json) {
    let container = new PIXI.Container();
    let background = new PIXI.Graphics()
        .beginFill(0x222222)
        .drawRect(x, y, width, height)
        .endFill();
    let statusline = statusLine(x, y+height-lineHeight, width, lineHeight, name);
    container.addChild(background, statusline);
    return container;
}

function statusLine(x, y, width, height, name) {
    let container = new PIXI.Container();
    let last = x;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // draw mode
    let modeBg = new PIXI.Graphics()
        .beginFill(0x00BBFF)
        .drawRect(last, y, width*0.1, height)
        .endFill();
    let modeText = new PIXI.Text('VIEW',
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: height*0.8,
            fill : 0x000000
        }
    );
    modeText.x = last + height*0.15;
    modeText.y = y+height*0.1;
    last = x + width*0.1;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // draw path
    let pathBg = new PIXI.Graphics()
        .beginFill(0x666666)
        .drawRect(last, y, width*0.45, height)
        .endFill();
    let pathText = new PIXI.Text(`~/profile/${name}.json`,
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: height*0.8,
            fill : 0xD8D8FF
        }
    );
    pathText.x = last+height*0.2;
    pathText.y = y+height*0.1;
    last = x + width*0.55;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // draw base
    let baseBg = new PIXI.Graphics()
        .beginFill(0x444444)
        .drawRect(last, y, width*0.3, height)
        .endFill();
    let baseText = new PIXI.Text('unix|utf-8',
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: height*0.8,
            fill : 0xD8D8FF
        }
    );
    baseText.x = last + height*1.5;
    baseText.y = y+height*0.1;
    last = x + width*0.85;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // draw filetype
    let filetypeBg = new PIXI.Graphics()
        .beginFill(0xDDDDDD)
        .drawRect(last, y, width*0.15, height)
        .endFill();
    let filetypeText = new PIXI.Text('{}json',
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: height*0.8,
            fill : 0x000000
        }
    );
    filetypeText.x = last + height*0.2;
    filetypeText.y = y+height*0.1;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // add all
    container.addChild(
        modeBg, modeText,
        pathBg, pathText,
        baseBg, baseText,
        filetypeBg, filetypeText
    );
    return container;
}