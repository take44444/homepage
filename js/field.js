import * as NOISE from './noise.js';

function v3_add(a,b) { return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
function v2_scale(v,s) { return [v[0]*s,v[1]*s]; }

export class PerlinField {
    constructor(op) {
        this.scale = op.scale;
        this.flow = op.flow;
        this.evolution = op.evolution;
        this.displace = op.displace;
        this.noise = new NOISE.PerlinNoise();
    }

    getFunc(value, time) {
        const offset = v2_scale(this.flow, time);
        const displace = value*this.displace;
        return (p) => {
            const nx = this.noise.noise(
                p[0]*this.scale + offset[0]+1000,
                p[1]*this.scale + offset[1]+1000,
                time*this.evolution+1000,
            );
            const ny = this.noise.noise(
                p[0]*this.scale + offset[0]+2000,
                p[1]*this.scale + offset[1]+2000,
                time*this.evolution+2000,
            );
            const nz = this.noise.noise(
                p[0]*this.scale + offset[0]+3000,
                p[1]*this.scale + offset[1]+3000,
                time*this.evolution+3000,
            );
            return v3_add(p, [nx * displace, ny * displace, nz * displace]);
        }
    }
}

export class SphericalField {
    constructor(op) {
        this.r = op.r;
        this.strength = op.strength;
    }

    getFunc() {
        return (p) => {
            const len = Math.sqrt(
                p[0]*p[0] + p[1]*p[1] + p[2]*p[2]
            ); // length of vector
            const e = [p[0]/len, p[1]/len, p[2]/len]; // unit vector
            const push = (this.r-len)*this.strength*0.01;
            const pv = [e[0]*push, e[1]*push, e[2]*push];
            return [p[0]+pv[0], p[1]+pv[1], pv[2]];
        }
    }
}