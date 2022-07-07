import { useTick } from '@inlet/react-pixi';
import { memo, useRef, useState } from 'react';
import { Rect, UText } from './util'

const Fps = (props) => {
  const cnt = useRef(0);
  const last = useRef(0);
  const [fps, setFps] = useState('fps: 0.0');
  useTick(_ => {
    const now = new Date();
    cnt.current += 1;
    if ((now - last.current) > 200) {
      setFps(`fps: ${
        (((200 * cnt.current) / (now - last.current)) * 5).toFixed(1)
      }`);
      cnt.current = 0;
      last.current = now;
    }
  });
  return (
    <UText col={0x000000} text={fps}
      x={props.r - props.h * 0.6 * (fps.length + 1)} y={props.y} h={props.h}
    />
  );
}

const StatusLine = memo((props) => {
  let next = props.x;
  return (
    <>
    <Rect col={0x00BBFF}
      x={next} y={props.y} w={props.w*0.1} h={props.h}
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
    <Fps
      r={props.x + props.w} y={props.y + props.h * 0.1} h={props.h * 0.8}
    />
    </>
  )
});

export { StatusLine };