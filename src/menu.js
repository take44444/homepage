import { Container } from "@inlet/react-pixi";
import { memo, useMemo, useRef, useState } from "react";
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
  const interval = (props.h-props.iH*props.mIL.length)/(props.mIL.length-1);
  const jsonContainers = useMemo(() => {
    const ret = [];
    for (let i=0; i<props.mIL.length; i++) {
      ret.push(
        <JsonContainer
          x={props.x2} y={props.y2} lH={props.lH} json={props.mIL[i]}
          posX={0} line={1} depth={0} lines={props.lines}
        />
      );
    }
    return ret;
  }, [props.x2, props.y2, props.lH, props.lines]);
  return (
    <>
    {[...Array(props.mIL.length)].map((_, i) => (
      <MenuButton key={i} title={props.mIL[i].title} delta={props.delta}
        x={props.x1} y={props.y1+(interval+props.iH)*i}
        maxW={props.w} h={props.iH} selected={selected===i}
        onPoint={()=>{setPointed(i)}} onSelect={()=>{setSelected(i)}}
        filters={props.filters}
      />
    ))}
    <UText text={'>'} col={0x0A0A0A}
      x={props.x1-props.iH*0.8}
      y={props.y1+(interval+props.iH)*pointed+props.iH*0.1}
      h={props.iH*0.8}
    />
    <ContainerSelector
      selected={selected} containers={jsonContainers}
    />
    </>
  );
});

const MenuButton = (props) => {
  const w = useRef(0);
  const col = useRef(0x888888);
  const isOver = useRef(false);
  const t = useRef(EASE_TIME);

  if (props.selected) {
    col.current = 0x444444;
    t.current = EASE_TIME;
    w.current = props.maxW;
    isOver.current = false;
  } else {
    col.current = 0x888888;
    if (isOver.current) {
      t.current = Math.min(EASE_TIME, t.current+props.delta);
      w.current = easeOutExpo(t.current / EASE_TIME) * props.maxW;
    } else {
      t.current = Math.min(EASE_TIME, t.current+props.delta);
      w.current = (1 - easeOutExpo(t.current / EASE_TIME)) * props.maxW;
    }
  }

  const pointerOver = () => {
    props.onPoint();
    if (props.selected) return;
    isOver.current = true;
    t.current = easeInExpo(w.current / props.maxW) * EASE_TIME;
  }
  const pointerOut = () => {
    if (props.selected) return;
    isOver.current = false;
    t.current = easeInExpo(1 - w.current / props.maxW) * EASE_TIME;
  }
  const pointerTap = () => { props.onSelect(); }
  return (
    <Container interactive={true} buttonMode={true}
      pointerover={pointerOver}
      pointerout={pointerOut}
      pointertap={pointerTap}
      filters={props.filters}
    >
      <RRect col={col.current}
        x={props.x} y={props.y} w={w.current} h={props.h}
      />
      <UText text={props.title} col={0x0A0A0A}
        x={props.x+props.h*0.48} y={props.y+props.h*0.1} h={props.h*0.8}
      />
    </Container>
  );
};
const ContainerSelector = memo((props) => {
  return props.containers[props.selected];
});

export { Menu };