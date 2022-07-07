import * as PIXI from 'pixi.js';

export class Form {
    constructor(op) {
        this.h = op.h;
        this.w = op.w;
        this.div = op.div;
        this.dx = op.w / op.div[0];
        this.dy = op.h / op.div[1];

        this.container = new PIXI.Container();
        this.container.x = op.x;
        this.container.y = op.y;
        this.fieldQueue = [];

        this.circles = new Array(this.div[0]+1);
        for (let i=0; i<=this.div[0]; i++) {
            this.circles[i] = new Array(this.div[1]+1);
            for(let j=0; j<=this.div[1]; j++) {
                const circle = new PIXI.Graphics()
                    .beginFill(op.color)
                    .drawCircle(0, 0, op.size)
                    .endFill();
                this.circles[i][j] = circle;
                this.container.addChild(circle);
            }
        }
    }

    pushField(fieldFunc) {
        this.fieldQueue.push(fieldFunc);
    }

    execute() {
        for (let i=0; i<=this.div[0]; i++) {
            for(let j=0; j<=this.div[1]; j++) {
                let p = [
                    (i*this.dx-this.w/2),
                    (j*this.dy-this.h/2),
                    0
                ];

                for(const fieldFunc of this.fieldQueue) {
                    p = fieldFunc(p);
                }

                // Draw with 3d position in 2d coordinate.
                const cvs = 1024 / (p[2] + 1024);
                this.circles[i][j].x = cvs*p[0];
                this.circles[i][j].y = cvs*p[1];
            }
        }
        this.fieldQueue = [];
    }
}