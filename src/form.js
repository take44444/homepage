import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useMemo } from "react";
import { Circle } from "./util";

const Form = memo((props) => {
  const dx = props.w / props.div[0];
  const dy = props.h / props.div[1];
  const key = useMemo(() => {
    const ret = new Array(props.div[0]+1);
    for (let i=0; i<=props.div[0]; i++) {
      ret[i] = new Array(props.div[1]+1);
      for(let j=0; j<=props.div[1]; j++) {
        ret[i][j] = `${i}/${j}`;
      }
    }
    return ret;
  }, []);

  const field = useMemo(() => {
    const fields = [];
    for (const f of props.fields)
      fields.push(f.getFunc(props.data, props.t));
    return (x, y) => {
      let pp = [x, y, 0];
      for (const f of fields)
        pp = f(pp);
      const cvs = 1024 / (pp[2] + 1024);
      return {x: cvs*pp[0], y: cvs*pp[1]};
    };
  }, [props.data, props.fields, props.t]);

  return (
    <Container x={props.x} y={props.y}
      filters={[
        new GlowFilter({distance: 30, color: props.col, outerStrength: 1.5})
      ]}
    >
      {key.map((e, i) => (e.map((ee, j) => (
        <Circle key={ee} col={props.col} sz={props.sz}
          {...field(i*dx-props.w/2, j*dy-props.h/2)}
        />
      ))))}
    </Container>
  );
});

export { Form };