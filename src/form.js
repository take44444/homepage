import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { useEffect, useRef, useState } from "react";
import { Circle } from "./util";

const Form = (props) => {
  const [loaded, setLoaded] = useState(false);
  function onLoad() { setLoaded(true); }
  const ps = useRef(null);
  useEffect(() => {
    ps.current = new Array(props.div[0]+1);
    for (let i=0; i<=props.div[0]; i++) {
      ps.current[i] = new Array(props.div[1]+1);
      for(let j=0; j<=props.div[1]; j++) {
        ps.current[i][j] = [0, 0];
      }
    }
    onLoad();
  }, [props.div]);
  useEffect(() => {
    const dx = props.w / props.div[0];
    const dy = props.h / props.div[1];
    for (let i=0; i<=props.div[0]; i++) {
      for(let j=0; j<=props.div[1]; j++) {
        let p = [(i*dx-props.w/2), (j*dy-props.h/2), 0];

        for (const field of props.fields)
          p = field.getFunc(props.data, props.t)(p);

        // Draw with 3d position in 2d coordinate.
        const cvs = 1024 / (p[2] + 1024);
        ps.current[i][j][0] = cvs*p[0];
        ps.current[i][j][1] = cvs*p[1];
      }
    }
  });

  return (
    loaded &&
    <Container x={props.x} y={props.y}
      filters={[
        new GlowFilter({distance: 30, color: props.col, outerStrength: 1.5})
      ]}
    >
      {[...Array(props.div[0]+1)].map((_, i) => (
        [...Array(props.div[1]+1)].map((_, j) => (
          <Circle key={`${i}/${j}`} col={props.col} sz={props.sz}
            x={ps.current[i][j][0]} y={ps.current[i][j][1]}
          />
        ))
      ))}
    </Container>
  )
}

export { Form };