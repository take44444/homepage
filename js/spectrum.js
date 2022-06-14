import * as PIXI from 'pixi.js';
import * as NOISE from './noise.js';

function v_add(a,b) { return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
function v_scale(v,s) { return [v[0]*s,v[1]*s,v[2]*s]; }

function sphericalField(r, strength, pos) {
    let len = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1] + pos[2]*pos[2]) // length of vector
    let e = [pos[0]/len, pos[1]/len, pos[2]/len]; // unit vector
    let push = (r - len) * strength * 0.01;
    let pv = [e[0]*push, e[1]*push, e[2]*push];
    return [pos[0]+pv[0], pos[1]+pv[1], pv[2]];
}

export class Spectrum {
    update(data, time) {
        throw 'Not implemented!';
    }
}

export class NcsSpectrum extends Spectrum {
    constructor(op) {
        super();
        this.container = new PIXI.Container();
        this.quality = op.quality ? op.quality : 1.0;
        this.formSize = (op.formSize ? op.formSize : 260) * this.quality;
        this.r = (op.r ? op.r : 322) * this.quality;
        this.div = op.div ? op.div : [150, 150];
        this.dx = this.formSize / this.div[0];
        this.dy = this.formSize / this.div[1];
        this.displacement = (op.displacement ? op.displacement : 40.0) * this.quality;
        let size = (op.size ? op.size : 2.5) * this.quality;
        let color = op.color !== undefined ? op.color : 0xFFFF00;
        this.noiseOptions = op.noiseOptions ? op.noiseOptions
            : {
                scale      : 0.01 / this.quality,
                octaves    : 1,
                flow       : [0, 1.5, 0],
                lacunarity : 1.5,
                gain       : 0.25,
            };
        this.noise = new NOISE.PerlinNoise();

        this.circles = new Array(this.div[0]+1);
        for (let i=0; i <= this.div[0]; i++) {
            this.circles[i] = new Array(this.div[1]+1);
            for(let j=0; j <= this.div[1]; j++ ) {
                let circle = new PIXI.Graphics()
                    .beginFill(color)
                    .drawCircle(0, 0, size)
                    .endFill();
                this.circles[i][j] = circle;
                this.container.addChild(circle);
            }
        }
    }

    update(data, time) {
        let sound_ave = data.length ?
            data.reduce((a, b) => a + b, 0) / data.length
            : (Math.sin(time) + 2) * 0.6666667;
        let displacement = sound_ave * this.displacement;

        let scale = this.noiseOptions.scale;
        let octaves = this.noiseOptions.octaves;
        let offset = v_scale(this.noiseOptions.flow, time);
        let lacunarity = this.noiseOptions.lacunarity;
        let gain = this.noiseOptions.gain;

        for (let i=0; i <= this.div[0]; i++) {
            for(let j=0; j <= this.div[1]; j++ ) {
                // basic position
                let p = [
                    (i*this.dx-this.formSize/2),
                    (j*this.dy-this.formSize/2),
                    0
                ];

                // fractal field
                let nx = this.noise.fbm(
                    p[0]*scale+time* 0 + offset[0]+100,
                    p[1]*scale+time* 1 + offset[1]+100,
                    p[2]*scale+time* 0 + offset[2]+100,
                    octaves, lacunarity, gain
                );
                let ny = this.noise.fbm(
                    p[0]*scale+time* 0 + offset[0]+200,
                    p[1]*scale+time* 0 + offset[1]+200,
                    p[2]*scale+time* 1 + offset[2]+200,
                    octaves, lacunarity, gain
                );
                let nz = this.noise.fbm(
                    p[0]*scale+time* 1 + offset[0]+300,
                    p[1]*scale+time* 0 + offset[1]+300,
                    p[2]*scale+time* 0 + offset[2]+300,
                    octaves, lacunarity, gain
                );
                p = v_add(p,[nx * displacement, ny * displacement, nz * displacement]);

                // spherical field
                if (this.r > 0) p = sphericalField(this.r, 107, p);

                // Draw with 3d position in 2d coordinate.
                let cvs = 1024*this.quality / (p[2] + 1024*this.quality);
                this.circles[i][j].x = cvs*p[0];
                this.circles[i][j].y = cvs*p[1];
            }
        }
    }
}