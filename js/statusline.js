import * as PIXI from 'pixi.js';
import * as UTIL from './util.js'

class Fps {
    constructor() {
        this.cnt = 0;
        this.last = null;
        this.val = 'fps: 0.0';
    }

    update() {
        let now = new Date();
        this.cnt++;
        if (this.last === null) {
            this.last = now;
            return;
        }
        if ((now - this.last) > 200) {
            this.val = `fps: ${
                (((200 * this.cnt) / (now - this.last)) * 5).toFixed(1)
            }`;
            this.cnt = 0;
            this.last = now;
        }
    }
};

export class StatusLine {
    constructor(x, y, width, height) {
        x = x;
        y = y;
        this.width = width;
        height = height;
        this.container = new PIXI.Container();
        this.fps = new Fps();
        let items = [];
        let last = x;
    
        items.push(new PIXI.Graphics()
            .beginFill(0x00BBFF)
            .drawRect(last, y, width*0.1, height)
            .endFill());
        items.push(UTIL.text(
            last+(width*0.1-height*0.48*6)/2, y+height*0.1, height*0.8,
            'STATUS', 0x000000
        ));
        last = x + width*0.1;
    
        items.push(new PIXI.Graphics()
            .beginFill(0x222222)
            .drawRect(last, y, width*0.45, height)
            .endFill());
        items.push(UTIL.text(last+height*0.48, y+height*0.1, height*0.8,
            'Copyright © 2022 Takeshi Masumoto', 0xD8D8FF
        ));
        last = x + width*0.55;
    
        items.push(new PIXI.Graphics()
            .beginFill(0x111111)
            .drawRect(last, y, width*0.3, height)
            .endFill());
        items.push(UTIL.text(
            last+width*0.3-height*0.48*21, y+height*0.1, height*0.8,
            '~/Documents/profile/', 0xD8D8FF
        ));
        last = x + width*0.85;
    
        items.push(new PIXI.Graphics()
            .beginFill(0xAAFF00)
            .drawRect(last, y, width*0.15, height)
            .endFill());
        this.fpsText = UTIL.text(
            x+this.width-height*0.48*(this.fps.val.length+1),
            y+height*0.1, height*0.8, this.fps.val, 0x000000
        );
    
        this.container.addChild(
            items[0], items[1], items[2], items[3],
            items[4], items[5], items[6], this.fpsText
        );
    }

    update() {
        this.fps.update();
        this.fpsText.text = this.fps.val;
    }
}