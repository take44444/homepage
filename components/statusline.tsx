import { FC, memo, useEffect, useRef, useState } from 'react';
import { Rect, UText } from './util'

type FPSProps = {
  r: number,
  y: number,
  t: number,
  h: number
};

const Fps: FC<FPSProps> = (props: FPSProps) => {
  const cnt = useRef(0);
  const t = useRef(0);
  const [fps, setFps] = useState('');
  useEffect(() => {
    cnt.current += 1;
    if ((props.t - t.current) > 0.2) {
      setFps(`fps: ${
        ((cnt.current) / (props.t - t.current)).toFixed(1)
      }`);
      cnt.current = 0;
      t.current = props.t;
    }
  }, [props.t]);
  return (
    <UText  y={props.y} h={props.h} col={0x000000}
      x={props.r - props.h * 0.6 * (fps.length + 1)} text={fps}
    />
  );
}

const StatusLine = memo(function StatusLine_(props: {
  x: number,
  y: number,
  t: number,
  h: number,
  w: number
}) {
  return (
    <>
    <Rect col={0x00BBFF}
      x={props.x} y={props.y} w={props.w*0.1} h={props.h}
    />
    <UText text={'STATUS'} col={0x000000}
      x={props.x+(props.w*0.1-props.h*0.48*6)/2} y={props.y+props.h*0.1}
      h={props.h*0.8}
    />
    <Rect col={0x222222}
      x={props.x+props.w*0.1} y={props.y} w={props.w*0.45} h={props.h}
    />
    <UText text={'Copyright © 2022 Takeshi Masumoto'} col={0xE0E0FF}
      x={props.x+props.w*0.1+props.h*0.48} y={props.y+props.h*0.1}
      h={props.h*0.8}
    />
    <Rect col={0x111111}
      x={props.x+props.w*0.55} y={props.y} w={props.w*0.3} h={props.h}
    />
    <UText text={'~/Documents/profile/'} col={0xE0E0FF}
      x={props.x+props.w*0.85-props.h*0.48*21} y={props.y+props.h*0.1}
      h={props.h*0.8}
    />
    <Rect col={0xAAFF00}
      x={props.x+props.w*0.85} y={props.y} w={props.w*0.15} h={props.h}
    />
    <Fps r={props.x + props.w} y={props.y + props.h * 0.1} h={props.h * 0.8}
      t={props.t}
    />
    </>
  )
});

export { StatusLine };