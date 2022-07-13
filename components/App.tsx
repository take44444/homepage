import { Container, Stage, useTick } from "@inlet/react-pixi";
import { CRTFilter } from "@pixi/filter-crt";
import { GlowFilter } from "@pixi/filter-glow";
import { Filter } from "pixi.js";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Audio, AudioPlayer, AudioTimeText } from "./audio";
import { FractalField, SphericalField } from "./field";
import { Form } from "./form";
import { Menu } from "./menu";
import PROFILE from "./profile";
import { StatusLine } from "./statusline";
import { Rect, UText } from "./util";

const Main: FC = () => {
  const [time, setTime] = useState(0);
  const [audioData, setAudioData] = useState({t: 0, v: 0});
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const onAudioLoad = useCallback(() => { setAudioLoaded(true); }, []);
  const audio = useMemo(
    () => new Audio('/bgm.mp3', onAudioLoad),
    [onAudioLoad]
  );
  const titleFilters: Filter[] = useMemo(() => [
    new GlowFilter({distance: 40, color: 0x0A0A0A, outerStrength: 1.5})
  ], []);
  const fields = useMemo(() => [
    new FractalField({
      scale: 0.01, flow: [0, 2.0], evolution: 1.8, displace: 80.0
    }),
    new SphericalField({
      r: 280,
      strength: 107
    })
  ], []);
  useEffect(() => {
    import('webfontloader').then(module => {
      module.load({
        google: { families: ['Noto Sans Mono'] },
        active: () => setFontLoaded(true),
        inactive: () => alert('font loading failed')
      });}
    );
  }, []);
  useTick((_) => {
    if (!audioLoaded || !fontLoaded) return;
    setTime(new Date().getTime() / 1000);
    if (audioData.t !== audio.getTime()) {
      const data = audio.getAudio().slice(0, 8);
      const vol = data.reduce((a, b)=> a + b, 0) / data.length / 200;
      setAudioData({t: audio.getTime(), v: vol});
    }
  });
  return (
    <>{audioLoaded && fontLoaded && <>
    <UText x={100} y={50} h={35} col={0x0A0A0A}
      text={'Takeshi Masumoto'} filters={titleFilters}
    />
    <AudioPlayer x={960-43.2} y={740} h={30} audio={audio} />
    <AudioTimeText anchor={0.5} x={430} y={450} h={45} col={0x0077FF}
      t={audioData.t}
    />
    <Form x={430} y={450} w={226} h={226} col={0x0A0A0A}
      sz={2.5} divX={120} divY={120} {...audioData} fields={fields}
    />
    <Menu x1={840} y1={200} w={220} h={170} iH={35}
      x2={1130} y2={52} lH={23} lines={32} dL={PROFILE} t={time}
    />
    <StatusLine x={0} y={820} w={1920} h={20} t={time} />
    </>}</>
  );
};

const App = () => {
  const [browser, setBrowser] = useState(<></>);
  useEffect(() => {
    // const resolution = Math.min(window.devicePixelRatio, 2);
    const stageProps = {
      width: 1920,
      height: 840,
      // raf: false,
      // renderOnComponentChange: true,
      options: {
        autoDensity: true,
        // resolution: resolution || 1,
        // antialias: resolution <= 1,
        // backgroundColor: 0xD8D8FF,
      },
    };
    setBrowser(
      <Stage {...stageProps}>
        <Container width={1920} height={840} filters={[
          new CRTFilter({curvature: 1.2, vignetting: 0.27})
        ]}>
          <Rect col={0xD8D8FF} x={0} y={0} w={1920} h={840} />
          <Main />
        </Container>
      </Stage>
    );
  }, []);
  return browser;
};

export default App;
