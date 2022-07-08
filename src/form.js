import { Graphics, Container } from 'pixi.js';
import { PixiComponent } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";

const Form = PixiComponent('Form', {
  create: props => {
    const container = new Container();
    container.filters = [
      new GlowFilter({distance: 30, color: props.col, outerStrength: 1.5})
    ];
    container.x = props.x;
    container.y = props.y;
    for (let i=0; i < (props.divX + 1)*(props.divY + 1); i++) {
      container.addChild(new Graphics()
        .beginFill(props.col)
        .drawCircle(0, 0, props.sz)
        .endFill()
      );
    }
    return container;
  },
  applyProps: (instance, _, props) => {
    const dx = props.w / props.divX;
    const dy = props.h / props.divY;
    const fs = [];
    for (const field of props.fields) fs.push(field.getFunc(props.v, props.t));
    const field = (x, y) => {
      let pp = [x, y, 0];
      for (const f of fs) pp = f(pp);
      const cvs = 1024 / (pp[2] + 1024);
      return [cvs * pp[0], cvs * pp[1]];
    };
    let idx = 0;
    for (let i=0; i<=props.divX; i++) {
      for(let j=0; j<=props.divY; j++) {
        const p = field(i*dx-props.w/2, j*dy-props.h/2);
        instance.getChildAt(idx).x = p[0];
        instance.getChildAt(idx++).y = p[1];
      }
    }
  }
});

export { Form };