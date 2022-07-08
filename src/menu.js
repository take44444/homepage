import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { JsonContainer } from "./json-text";
import { RRect, UText } from "./util";

const EASE_TIME = 2;

function clamp(a, b, x) {
  return Math.min(Math.max(a, x), b)
}

function easeOutExpo(x) {
  return clamp(0, 1, x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
}

function easeInExpo(x) {
  return clamp(0, 1, x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
}

const Menu = memo((props) => {
  const [pointed, setPointed] = useState(0);
  const [selected, setSelected] = useState(0);
  const interval = (props.h - props.iH*props.dL.length)
    / (props.dL.length-1);
  const filters = useMemo(() => [
    new GlowFilter({distance: 35, color: 0x888888, outerStrength: 1.5})
  ], []);
  return (
    <>
    {[...Array(props.dL.length)].map((_, i) => (
      <MenuButton key={i} title={props.dL[i].title}
        x={props.x1} y={props.y1+(interval+props.iH)*i}
        maxW={props.w} h={props.iH} selected={selected===i}
        filters={filters} delta={props.delta}
        onPoint={()=>{setPointed(i)}} onSelect={()=>{setSelected(i)}}
      />
    ))}
    <UText text={'>'} col={0x0A0A0A}
      x={props.x1-props.iH*0.8}
      y={props.y1+(interval+props.iH)*pointed+props.iH*0.1}
      h={props.iH*0.8}
    />
    {props.dL.map((d, i) => (
      <JsonContainer key={i} x={props.x2} y={props.y2} lH={props.lH}
        json={d} lines={props.lines} alpha={selected === i ? 1 : 0}
      />
    ))}
    </>
  );
});

const MenuButton = memo((props) => {
  const [rProps, setRProps] = useState({col: 0, w: 0});
  const isOver = useRef(false);
  const t = useRef(EASE_TIME);
  useEffect(() => {
    let col = 0x444444, w = props.maxW;
    if (props.selected) {
      t.current = EASE_TIME;
      isOver.current = false;
    } else {
      col = 0x888888;
      if (isOver.current) {
        t.current = Math.min(EASE_TIME, t.current + props.delta);
        w = easeOutExpo(t.current / EASE_TIME) * props.maxW;
      } else {
        t.current = Math.min(EASE_TIME, t.current + props.delta);
        w = (1 - easeOutExpo(t.current / EASE_TIME)) * props.maxW;
      }
    }
    setRProps({col: col, w: w});
  }, [props]);
  

  const pointerOver = () => {
    props.onPoint();
    if (props.selected) return;
    isOver.current = true;
    t.current = easeInExpo(rProps.w / props.maxW) * EASE_TIME;
  }
  const pointerOut = () => {
    if (props.selected) return;
    isOver.current = false;
    t.current = easeInExpo(1 - rProps.w / props.maxW) * EASE_TIME;
  }
  const pointerTap = () => { props.onSelect(); }

  return (
    <Container interactive={true} buttonMode={true}
      pointerover={pointerOver}
      pointerout={pointerOut}
      pointertap={pointerTap}
      filters={props.filters}
    >
      <RRect {...rProps}
        x={props.x} y={props.y} h={props.h}
      />
      <UText text={props.title} col={0x0A0A0A}
        x={props.x+props.h*0.48} y={props.y+props.h*0.1} h={props.h*0.8}
      />
    </Container>
  );
});

export { Menu };