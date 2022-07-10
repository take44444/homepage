import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
        filters={filters} t={props.t}
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
  const [w, setW] = useState(0);
  const [col, setCol] = useState(0x888888);
  const time = useRef(props.t);
  const t = useRef(0);
  const last = useRef(false);
  const [isOver, setIsOver] = useState(false);
  useEffect(() => {
    const delta = props.t - time.current;
    time.current = props.t;
    if (props.selected) return;
    t.current += delta;
    if (isOver) {
      if (!last.current) {
        t.current = Math.min(
          EASE_TIME, easeInExpo(w / props.maxW) * EASE_TIME
        );
      }
      setW(easeOutExpo(t.current / EASE_TIME) * props.maxW);
    } else {
      if (last.current) {
        t.current = Math.min(
          EASE_TIME, easeInExpo(1 - w / props.maxW) * EASE_TIME
        );
      }
      setW((1 - easeOutExpo(t.current / EASE_TIME)) * props.maxW);
    }
    last.current = isOver;
  }, [props.t]);
  useEffect(() => {
    if (props.selected) {
      setW(props.maxW);
      setCol(0x444444);
    } else {
      t.current = EASE_TIME;
      setW(0);
      setCol(0x888888);
    }
  }, [props.selected, props.maxW]);

  const pointerOver = useCallback(() => {
    props.onPoint();
    setIsOver(true);
  }, []);
  const pointerOut = useCallback(() => {
    setIsOver(false);
  }, []);
  const pointerTap = useCallback(() => {
    props.onSelect();
  }, []);

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