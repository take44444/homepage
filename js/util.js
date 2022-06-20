import * as PIXI from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';

export function text(x, y, height, string, color) {
  let ret = new PIXI.Text(string,
      { 
          fontFamily: 'Noto Sans Mono',
          fontSize: height,
          fill : color
      }
  );
  ret.x = x;
  ret.y = y;
  return ret;
}

export function glowFilter(color, distance) {
  return new GlowFilter(
    { distance: distance, outerStrength: 1.5, color: color }
  );
}