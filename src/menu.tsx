import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { Filter } from "pixi.js";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JsonContainer } from "./json-text";
import { RRect, UText } from "./util";

const EASE_TIME = 2;

function clamp(a: number, b: number, x: number) {
  return Math.min(Math.max(a, x), b)
}

function easeOutExpo(x: number) {
  return clamp(0, 1, x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
}

function easeInExpo(x: number) {
  return clamp(0, 1, x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
}

const Menu = memo((props: {
  t: number,
  x1: number,
  y1: number,
  h: number,
  w: number,
  iH: number,
  x2: number,
  y2: number,
  lH: number,
  lines: number,
  dL: any
}) => {
  const [pointed, setPointed] = useState(0);
  const [selected, setSelected] = useState(0);
  const interval = (props.h - props.iH*props.dL.length)
    / (props.dL.length-1);
  const filters = useMemo(() => [
    new GlowFilter({distance: 35, color: 0x888888, outerStrength: 1.5})
  ], []);
  const callbacks = useMemo(() => {
    const ret = [];
    for (let i=0; i<props.dL.length; i++) {
      ret.push([()=>{setPointed(i)}, ()=>{setSelected(i)}]);
    }
    return ret;
  }, [props.dL]);
  return (
    <>
    {[...Array(props.dL.length)].map((_, i) => (
      <MenuButton key={i} title={props.dL[i].title}
        x={props.x1} y={props.y1+(interval+props.iH)*i}
        maxW={props.w} h={props.iH} selected={selected===i}
        filters={filters} t={props.t}
        onPoint={callbacks[i][0]} onSelect={callbacks[i][1]}
      />
    ))}
    <UText text={'>'} col={0x0A0A0A}
      x={props.x1-props.iH*0.8}
      y={props.y1+(interval+props.iH)*pointed+props.iH*0.1}
      h={props.iH*0.8}
    />
    {props.dL.map((d: any, i: number) => (
      <JsonContainer key={i} x={props.x2} y={props.y2} lH={props.lH}
        json={d} lines={props.lines} visible={selected === i}
      />
    ))}
    </>
  );
});

const MenuButton = memo((props: {
  x: number,
  y: number,
  t: number,
  h: number,
  maxW: number,
  title: string,
  filters: Filter[],
  selected: boolean,
  onPoint: () => void,
  onSelect: () => void
}) => {
  const [w, setW] = useState(0);
  const [col, setCol] = useState(0x888888);
  const state = useRef({t: props.t, ease: 0, hover: [false, false]});
  const pointerOver = useCallback(() => {
    props.onPoint();
    state.current.hover = [true, true];
  }, []);
  const pointerOut = useCallback(() => {
    state.current.hover = [true, false];
  }, []);
  const pointerTap = useCallback(() => {
    props.onSelect();
  }, []);

  useEffect(() => {
    const delta = props.t - state.current.t;
    state.current.t = props.t;
    if (props.selected) return;
    state.current.ease += delta;
    if (state.current.hover[1]) {
      if (state.current.hover[0]) {
        state.current.ease = Math.min(
          EASE_TIME, easeInExpo(w / props.maxW) * EASE_TIME
        );
      }
      setW(easeOutExpo(state.current.ease / EASE_TIME) * props.maxW);
    } else {
      if (state.current.hover[0]) {
        state.current.ease = Math.min(
          EASE_TIME, easeInExpo(1 - w / props.maxW) * EASE_TIME
        );
      }
      setW((1 - easeOutExpo(state.current.ease / EASE_TIME)) * props.maxW);
    }
    state.current.hover[0] = false;
  }, [props.t]);
  useEffect(() => {
    if (props.selected) {
      setW(props.maxW);
      setCol(0x444444);
    } else {
      state.current.ease = EASE_TIME;
      setW(0);
      setCol(0x888888);
    }
  }, [props.selected, props.maxW]);

  return (
    <Container interactive={true} buttonMode={true}
      pointerover={pointerOver}
      pointerout={pointerOut}
      pointertap={pointerTap}
      filters={props.filters}
    >
      <RRect w={w} col={col}
        x={props.x} y={props.y} h={props.h}
      />
      <UText text={props.title} col={0x0A0A0A}
        x={props.x+props.h*0.48} y={props.y+props.h*0.1} h={props.h*0.8}
      />
    </Container>
  );
});

export { Menu };