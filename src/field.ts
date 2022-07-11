import { lerp, PerlinNoise } from "./noise";

function v3Len(a: number[]) {
  return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
}

function v3Add(a: number[], b: number[]) {
  return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
}

function v3Scale(a: number[], s: number) {
  return [a[0]*s, a[1]*s, a[2]*s];
}

function v2Scale(a: number[], s: number) {
  return [a[0]*s, a[1]*s];
}

class Field {
  getFunc(_value: number, _time: number): (p: number[]) => number[] {
    throw new Error('Not implemented!');
  }
}

class FractalField extends Field {
  private scale;
  private flow;
  private evolution;
  private displace;
  private noise;
  constructor(op: {
    scale: number,
    flow: number[],
    evolution: number,
    displace: number
  }) {
    super();
    this.scale = op.scale;
    this.flow = op.flow;
    this.evolution = op.evolution;
    this.displace = op.displace;
    this.noise = new PerlinNoise();
  }

  getFunc(value: number, time: number): (p: number[]) => number[] {
    const offset = v2Scale(this.flow, time);
    const displace = value * this.displace;
    return (p: number[]) => {
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
      return v3Add(p, [nx * displace, ny * displace, nz * displace]);
    };
  }
}

class SphericalField extends Field {
  private r;
  private strength;
  constructor(op: {
    r: number,
    strength: number
  }) {
    super();
    this.r = op.r;
    this.strength = op.strength*0.01;
  }

  getFunc(_value: number, _time: number): (p: number[]) => number[] {
    return (p: number[]) => {
      const len =v3Len(p); // length of vector
      const e = [p[0]/len, p[1]/len, p[2]/len]; // unit vector
      const dst = v3Scale(e, this.r);
      return [
        lerp(this.strength, p[0], dst[0]),
        lerp(this.strength, p[1], dst[1]),
        lerp(this.strength, p[2], dst[2])
      ];
    }
  }
}

export { Field, FractalField, SphericalField };