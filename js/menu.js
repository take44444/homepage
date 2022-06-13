import * as PIXI from 'pixi.js';

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
    // menuList = [{title: string, content: [string, ...]}, ...]
    constructor(x1, y1, x2, y2, menuList, op) {
        let quality = op.quality ? op.quality : 1.0;
        let width = (op.width ? op.width : 350) * quality;
        let height = (op.height ? op.height : 250) * quality;
        this.itemHeight = (op.itemHeight ? op.itemHeight : 50) * quality;
        this.interval = (height - this.itemHeight * menuList.length) / (menuList.length - 1);
        this.x1 = x1 * quality;
        this.y1 = y1 * quality;
        x2 *= quality;
        y2 *= quality;

        this.buttons = new Array(menuList.length);
        // this.contents = new Array(menuList.length);
        this.buttonContainer = new PIXI.Container();
        // this.contentContainer = new PIXI.Container();
        for (let i=0; i<menuList.length; i++) {
            this.buttons[i] = new MenuButton(
                this.x1, this.y1 + (this.interval + this.itemHeight) * i, width, this.itemHeight,
                menuList[i].title, () => this.point(i), () => this.select(i)
            );
            this.buttonContainer.addChild(this.buttons[i].container);
            // this.contents[i] = new MenuContents(
            //     x2, y2, menuList[i].contents
            // );
            // this.contentContainer.addChild(this.contents[i].container);
        }
        this.pointer = new PIXI.Text('>',
            { 
                fontFamily: 'Noto Sans Mono',
                fontSize: this.itemHeight*0.8,
                fill : 0x2B2620
            }
        );
        this.pointer.x = this.x1 - this.itemHeight*0.8;
        this.pointer.y = this.y1 + this.itemHeight*0.1;
        this.buttonContainer.addChild(this.pointer);
        this.point(0);
        this.selected = 0;
        this.select(0);
    }

    select(i) {
        this.buttons[this.selected].unselect();
        this.buttons[i].select();
        // this.contents[this.selected].hide();
        // this.contents[i].visualize();
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
            .beginFill(0xAAAAAA)
            .drawRoundedRect(this.x, this.y, this.width, this.height, this.height*0.125)
            .endFill();
        this.container.addChild(this.rect);

        let titleText = new PIXI.Text(title,
            { 
                fontFamily: 'Noto Sans Mono',
                fontSize: this.height*0.8,
                fill : 0x2B2620
            }
        );
        titleText.x = x+this.maxWidth*0.05;
        titleText.y = y+this.height*0.1;
        this.container.addChild(titleText);
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
        this.rect.clear();
        this.rect.beginFill(0xAAAAAA)
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
        this.rect.beginFill(0xAAAAAA)
                 .drawRoundedRect(this.x, this.y, this.width, this.height, this.height*0.125)
                 .endFill();
    }
}

// class MenuContents {

// }