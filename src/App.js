import { Container, Stage } from '@inlet/react-pixi';
import { Form } from './form';
import { Menu } from './menu';
import { INTERESTS, OTHER, SNS } from './profile';
import { StatusLine } from './statusline';
import { FractalField, SphericalField } from './field';
import { useMemo, useState } from 'react';
import { Audio, AudioPlayer, AudioTimeText } from './audio';
import { Rect, UText } from './util';
import { GlowFilter } from '@pixi/filter-glow';
import { CRTFilter } from '@pixi/filter-crt';

const Main = () => {
  const [loaded, setLoaded] = useState(false);
  function onLoad() { setLoaded(true); }
  const audio = useMemo(() => new Audio('/bgm.mp3', onLoad), []);
  const fields = useMemo(() => [
    new FractalField({
      scale: 0.01, flow: [0, 2.0], evolution: 1.8, displace: 80.0
    }),
    new SphericalField({
      r: 280,
      strength: 107
    })
  ], []);
  return (
    loaded &&
    <>
    <UText text={'Takeshi Masumoto'}
      x={100} y={50} h={35} col={0x0A0A0A}
      filters={[
        new GlowFilter({distance: 40, color: 0x0A0A0A, outerStrength: 1.5})
      ]}
    />
    <AudioPlayer audio={audio}
      x={960-43.2} y={740} h={30}
    />
    <AudioTimeText audio={audio}
      col={0x0077FF} anchor={0.5} x={430} y={450} h={45}
      filters={[
        new GlowFilter({distance: 40, color: 0x0077FF, outerStrength: 1.5})
      ]}
    />
    <Form sz={2.5} div={[120, 120]} col={0x0A0A0A}
      x={430} y={450} w={226} h={226} audio={audio}
      fields = {fields}
    />
    <Menu mIL={[SNS, INTERESTS, OTHER]}
      x1={840} y1={200} w={220} h={170} iH={35}
      x2={1130} y2={52} lH={23} lines={32}
      filters={[
        new GlowFilter({distance: 35, color: 0x888888, outerStrength: 1.5})
      ]}
    />
    <StatusLine x={0} y={820} w={1920} h={20} />
    </>
  )
}

const App = () => {
  // const resolution = Math.min(window.devicePixelRatio, 2);
  const stageProps = {
    width: 1920,
    height: 840,
    options: {
      autoDensity: true,
      // resolution: resolution || 1,
      // antialias: resolution <= 1,
      // backgroundColor: 0xD8D8FF,
    },
  };
  return (
    <Stage {...stageProps}>
      <Container width={1920} height={840}
        filters={[
          new CRTFilter({curvature: 1.2, vignetting: 0.27})
        ]}
      >
        <Rect col={0xD8D8FF} x={0} y={0} w={1920} h={840} />
        <Main />
      </Container>
    </Stage>
  )
};

export default App;
