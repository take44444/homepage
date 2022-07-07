import { Graphics, PixiComponent, Text } from '@inlet/react-pixi'
import { TextStyle, Graphics as PGraphics } from 'pixi.js';
import { useCallback } from 'react';

const UText = (props) => {
  return (
    <Text {...props}
      style={ new TextStyle({
        fontFamily: 'Noto Sans Mono',
        fontSize: props.h,
        fill : props.col
      }) }
    />
  )
}

const RRect = (props) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(props.col);
    g.drawRoundedRect(props.x, props.y, props.w, props.h, props.h*0.125);
    g.endFill();
  }, [props]);

  return <Graphics draw={draw} />;
};

const Rect = (props) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(props.col);
    g.drawRect(props.x, props.y, props.w, props.h);
    g.endFill();
  }, [props]);

  return <Graphics draw={draw} />;
};

const Circle = PixiComponent('Circle', {
  create: props => new PGraphics()
    .beginFill(props.col)
    .drawCircle(0, 0, props.sz)
    .endFill(),
  applyProps: (instance, _, props) => {
    instance.x = props.x;
    instance.y = props.y;
  }
});

export { UText, Rect, RRect, Circle };