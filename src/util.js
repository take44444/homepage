import { Graphics, Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js';
import { memo, useCallback } from 'react';

const UText = memo((props) => {
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

const RRect = memo((props) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(props.col);
    g.drawRoundedRect(props.x, props.y, props.w, props.h, props.h*0.125);
    g.endFill();
  }, [props]);

  return <Graphics draw={draw} />;
});

const Rect = memo((props) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(props.col);
    g.drawRect(props.x, props.y, props.w, props.h);
    g.endFill();
  }, [props]);

  return <Graphics draw={draw} />;
});

export { UText, Rect, RRect };