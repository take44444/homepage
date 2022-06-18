import * as PIXI from 'pixi.js';

export function Text(x, y, height, string, color) {
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