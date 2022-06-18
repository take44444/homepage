import * as PIXI from 'pixi.js';
import * as JSON_TEXT from './json-text.js';
import * as TEXT from './text.js'

const EASE_TIME = 2;

function clamp(a, b, x) {
    return Math.min(Math.max(a, x), b)
}

function easeOutExpo(x) {
    return clamp(0, 1, x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
}

function easeInExpo(x) {
    return clamp(0, 1, x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
}

export class Menu {
    // menuInfoList = [{title: string, content: [object, ...]}, ...]
    constructor(x1, y1, width, height, itemHeight, x2, y2, lineHeight, maxLines, menuInfoList) {
        this.itemHeight = itemHeight;
        this.interval = (height - this.itemHeight * menuInfoList.length) / (menuInfoList.length - 1);
        this.x1 = x1;
        this.y1 = y1;

        this.buttons = new Array(menuInfoList.length);
        this.contents = new Array(menuInfoList.length);
        this.buttonContainer = new PIXI.Container();
        this.contentContainer = new PIXI.Container();
        for (let i=0; i<menuInfoList.length; i++) {
            this.buttons[i] = new MenuButton(
                this.x1, this.y1 + (this.interval + this.itemHeight) * i, width, this.itemHeight,
                menuInfoList[i].title, () => this.point(i), () => this.select(i)
            );
            this.buttonContainer.addChild(this.buttons[i].container);
            this.contents[i] = new PIXI.Container();
            let [_, line] = JSON_TEXT.addJsonTexts2Container(x2, y2, lineHeight, menuInfoList[i], 0, 1, 0, this.contents[i]);
            for (let l=line+1; l<=maxLines; l++) {
                this.contents[i].addChild(JSON_TEXT.lineNumText(x2, y2, l, lineHeight));
            }
        }
        this.pointer = TEXT.Text(
            this.x1-this.itemHeight*0.8, this.y1+this.itemHeight*0.1,
            this.itemHeight*0.8, '>', 0x0A0A0A
        );
        this.buttonContainer.addChild(this.pointer);
        this.point(0);
        this.selected = 0;
        this.select(0);
    }

    select(i) {
        this.buttons[this.selected].unselect();
        this.buttons[i].select();
        this.contentContainer.removeChild(this.contentContainer.children[0]);
        this.contentContainer.addChild(this.contents[i]);
        this.selected = i;
    }

    point(i) {
        this.pointed = i;
        this.pointer.y = this.y1 + (this.interval + this.itemHeight) * i + this.itemHeight*0.1;
    }

    update(delta) {
        for (let i=0; i<this.buttons.length; i++) {
            this.buttons[i].update(delta);
            // this.contents[i].update(delta);
        }
    }
}

class MenuButton {
    constructor(x, y, width, height, title, onPoint, onSelect) {
        this.x = x;
        this.y = y;
        this.maxWidth = width;
        this.height = height;
        this.width = 0;
        this.onPoint = onPoint;
        this.onSelect = onSelect;
        this.selected = false;
        this.isOver = false;
        this.time = EASE_TIME;

        this.onPointerOver = this.onPointerOver.bind(this);
        this.onPointerOut = this.onPointerOut.bind(this);
        this.onPointerTap = this.onPointerTap.bind(this);

        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on('pointerover', this.onPointerOver);
        this.container.on('pointerout', this.onPointerOut);
        this.container.on('pointertap', this.onPointerTap);

        this.rect = new PIXI.Graphics()
            .beginFill(0x888888)
            .drawRoundedRect(this.x, this.y, this.width, this.height, this.height*0.125)
            .endFill();
        this.container.addChild(this.rect);

        this.container.addChild(TEXT.Text(
            x+this.maxWidth*0.05, y+this.height*0.1,
            this.height*0.8, title, 0x0A0A0A
        ));
    }

    onPointerOver() {
        this.isOver = true;
        this.time = easeInExpo(this.width / this.maxWidth) * EASE_TIME;
        this.onPoint();
    }

    onPointerOut() {
        this.isOver = false;
        this.time = easeInExpo(1 - this.width / this.maxWidth) * EASE_TIME;
    }

    onPointerTap() { this.onSelect(); }

    select() {
        this.selected = true;
        this.width = this.maxWidth;
        this.rect.clear();
        this.rect.beginFill(0x444444)
                 .drawRoundedRect(this.x, this.y, this.width, this.height, this.height*0.125)
                 .endFill();
    }

    unselect() {
        this.selected = false;
        this.isOver = false;
        this.time = EASE_TIME;
        this.width = 0;
        this.rect.clear();
        this.rect.beginFill(0x888888)
                 .drawRoundedRect(this.x, this.y, this.width, this.height, this.height*0.125)
                 .endFill();
    }

    update(delta) {
        if (this.selected) return;
        if (this.time >= EASE_TIME) return;
        if (this.isOver) {
            this.time += delta;
            this.width = easeOutExpo(this.time / EASE_TIME) * this.maxWidth;
        } else {
            this.time += delta;
            this.width = (1 - easeOutExpo(this.time / EASE_TIME)) * this.maxWidth;
        }
        this.rect.clear();
        this.rect.beginFill(0x888888)
                 .drawRoundedRect(this.x, this.y, this.width, this.height, this.height*0.125)
                 .endFill();
    }
}