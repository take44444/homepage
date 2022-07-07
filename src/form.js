import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useEffect, useRef, useState } from "react";
import { Circle } from "./util";

const Form = memo((props) => {
  const [loaded, setLoaded] = useState(false);
  const p = useRef(null);
  useEffect(() => {
    p.current = new Array(props.div[0]+1);
    for (let i=0; i<=props.div[0]; i++) {
      p.current[i] = new Array(props.div[1]+1);
      for(let j=0; j<=props.div[1]; j++) {
        p.current[i][j] = [0, 0];
      }
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    const dx = props.w / props.div[0];
    const dy = props.h / props.div[1];
    for (let i=0; i<=props.div[0]; i++) {
      for (let j=0; j<=props.div[1]; j++) {
        let pp = [(i*dx-props.w/2), (j*dy-props.h/2), 0];

        for (const field of props.fields)
          pp = field.getFunc(props.data, props.t)(pp);

        // Draw with 3d position on 2d coordinate.
        const cvs = 1024 / (pp[2] + 1024);
        p.current[i][j][0] = cvs*pp[0];
        p.current[i][j][1] = cvs*pp[1];
      }
    }
  }, [props.t]);

  return (
    loaded &&
    <Container x={props.x} y={props.y}
      filters={[
        new GlowFilter({distance: 30, color: props.col, outerStrength: 1.5})
      ]}
    >
      {p.current.map((e, i) => (e.map((ee, j) => (
        <Circle key={`${i}/${j}`} col={props.col} sz={props.sz}
          x={ee[0]} y={ee[1]}
        />
      ))))}
    </Container>
  );
});

export { Form };