import { Container, useTick } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useMemo, useState } from "react";
import { Circle } from "./util";

const Form = memo((props) => {
  const filters = useMemo(() => [
    new GlowFilter({distance: 30, color: props.col, outerStrength: 1.5})
  ], [props.col]);
  const [p, setP] = useState(
    new Array((props.div[0]+1)*(props.div[1]+1)).fill({x: 0, y: 0})
  );
  useTick(_ => {
    const dx = props.w / props.div[0];
    const dy = props.h / props.div[1];
    const ret = [];
    const t = props.audio.ctx.currentTime;
    const audioData = props.audio.getAudio().slice(0, 8);
    const vol = audioData.reduce((a, b)=>a+b, 0)/audioData.length/200;
    const fs = [];
    for (const field of props.fields) fs.push(field.getFunc(vol, t));

    for (let i=0; i<=props.div[0]; i++) {
      for (let j=0; j<=props.div[1]; j++) {
        let pp = [(i*dx-props.w/2), (j*dy-props.h/2), 0];

        for (const f of fs) pp = f(pp);

        // Draw with 3d position on 2d coordinate.
        const cvs = 1024 / (pp[2] + 1024);
        ret.push({x: cvs*pp[0], y: cvs*pp[1]});
      }
    }
    setP(ret);
  });

  return (
    <Container x={props.x} y={props.y} filters={filters}>
      {p.map((e, i) => (
        <Circle key={i} col={props.col} sz={props.sz} {...e} />
      ))}
    </Container>
  );
});

export { Form };