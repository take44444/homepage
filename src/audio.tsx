import { Container } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useMemo, useState } from "react";
import { RRect, UText } from "./util";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

const SMOOTHING = 0.7;
const FFT_SIZE = 1024;

class Audio {
  private analyser: AnalyserNode | undefined;
  private ctx;
  private freqs: Uint8Array | undefined;
  private status;
  constructor(url: string, onLoad: () => void) {
    this.status = 0;
    this.ctx = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = (res: ProgressEvent<EventTarget>) => {
      this.ctx.decodeAudioData(
        (res.currentTarget as XMLHttpRequest).response,
        buffer => {
          if (!buffer) throw new Error('Unknown error.');
          this.analyser = this.ctx.createAnalyser();
          this.analyser.connect(this.ctx.destination);
          this.analyser.minDecibels = -140;
          this.analyser.maxDecibels = 0;
          this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
          const src = this.ctx.createBufferSource();
          src.connect(this.analyser);
          src.buffer = buffer;
          src.loop = true;
          this.status = 1;
          src.start(0);
          this.ctx.suspend();
          onLoad();
        },
        _ => {
          throw new Error('decodeAudioData error');
        }
      );
    };
    request.onerror = () => {
      throw new Error('Loader: XHR error');
    };
    request.send();
  }

  getAudio(): Uint8Array {
    if (this.status === 0) return new Uint8Array([0]);
    this.analyser!.smoothingTimeConstant = SMOOTHING;
    this.analyser!.fftSize = FFT_SIZE;
    this.analyser!.getByteFrequencyData(this.freqs!);
    return this.freqs!;
  }

  getTime(): number {
    return this.ctx.currentTime;
  }

  play() {
    if (this.status === 0) return;
    if (this.status === 1) this.ctx.resume();
    this.status = 2;
  }

  stop() {
    if (this.status !== 2) return;
    this.ctx.suspend();
    this.status = 1;
  }
}

const AudioPlayer = memo((props: {
  x: number,
  y: number,
  h: number,
  audio: Audio
}) => {
  const filters = useMemo(() => [
    new GlowFilter({distance: 30, color: 0x555555, outerStrength: 1.5})
  ], []);
  const [state, setState] = useState({text: 'Play', col: 0x0077FF});
  const pointerTap = () => {
    if (state.col === 0x444444) {
      setState({text: 'Play', col: 0x0077FF});
      props.audio.stop();
    } else {
      setState({text: 'Stop', col: 0x444444});
      props.audio.play();
    }
  }
  return (
    <Container filters={filters}
      interactive={true} buttonMode={true} pointertap={pointerTap}
    >
      <RRect col={state.col}
        x={props.x} y={props.y} w={props.h*2.88} h={props.h}
      />
      <UText text={state.text} col={0x0A0A0A}
        x={props.x+props.h*0.48} y={props.y+props.h*0.1} h={props.h*0.8}
      />
    </Container>
  );
});

const AudioTimeText = memo((props: {
  anchor?: number,
  x: number,
  y: number,
  t: number,
  h: number,
  col: number
}) => {
  const filters = useMemo(() => [
    new GlowFilter({distance: 40, color: 0x0077FF, outerStrength: 1.5})
  ], []);
  return (
    <UText {...props} filters={filters}
      text={
        `${
          (('00')+Math.floor(props.t/60)).slice(-2)
        }:${
          (('00')+Math.floor(props.t)%60).slice(-2)
        }:${
          (('00')+props.t.toFixed(2)).slice(-2)
        }`
      }
    />
  );
});

export { Audio, AudioPlayer, AudioTimeText };