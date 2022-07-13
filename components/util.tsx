import { Graphics, Text } from '@inlet/react-pixi'
import { Filter, TextStyle, Graphics as PixiGraphics } from 'pixi.js';
import { memo, useCallback } from 'react';

type Props = {
  anchor?: number,
  x: number,
  y: number,
  w?: number,
  h: number,
  text?: string,
  col: number,
  filters?: Filter[],
  interactive?: boolean,
  buttonMode?: boolean,
  pointertap?: () => void
};

const UText = memo(function UText_(props: Props) {
  return (
    <Text {...props}
      style={new TextStyle({
        fontFamily: 'Noto Sans Mono',
        fontSize: props.h,
        fill : props.col
      })}
    />
  )
});

const RRect = memo(function RRect_(props: Props) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(props.col);
    g.drawRoundedRect(props.x, props.y, props.w ?? 0, props.h, props.h*0.125);
    g.endFill();
    // g.interactive = props.interactive ?? false;
    // g.buttonMode = props.buttonMode ?? false;
    // if (props.pointertap) g.on('pointertap', props.pointertap);
    if (props.filters) g.filters = props.filters;
  }, [props]);

  return <Graphics draw={draw} />;
});

const Rect = memo(function Rect_(props: Props) {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(props.col);
    g.drawRect(props.x, props.y, props.w ?? 0, props.h);
    g.endFill();
    // g.interactive = props.interactive ?? false;
    // g.buttonMode = props.buttonMode ?? false;
    // if (props.pointertap) g.on('pointertap', props.pointertap);
    if (props.filters) g.filters = props.filters;
  }, [props]);

  return <Graphics draw={draw} />;
});

export { UText, Rect, RRect };