import { Container, useTick } from "@inlet/react-pixi";
import { GlowFilter } from "@pixi/filter-glow";
import { memo, useState } from "react";
import { RRect, UText } from "./util";

const SMOOTHING = 0.7;
const FFT_SIZE = 1024;

class Audio {
  constructor(url, onLoad) {
    this.status = 0;
    this.ctx = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = res => {
      this.ctx.decodeAudioData(
        res.currentTarget.response,
        buffer => {
          if (!buffer) throw new Error('Unknown error.');
          this.analyser = this.ctx.createAnalyser();
          this.analyser.connect(this.ctx.destination);
          this.analyser.minDecibels = -140;
          this.analyser.maxDecibels = 0;
          this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
          this.src = this.ctx.createBufferSource();
          this.src.connect(this.analyser);
          this.src.buffer = buffer;
          this.src.loop = true;
          this.status = 1;
          this.src.start(0);
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

  getAudio() {
    if (this.status !== 2) return [0];
    this.analyser.smoothingTimeConstant = SMOOTHING;
    this.analyser.fftSize = FFT_SIZE;
    this.analyser.getByteFrequencyData(this.freqs);
    return this.freqs;
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

const AudioPlayer = memo((props) => {
  const [state, setState] = useState(
    {playing: false, text: 'Play', col: 0x0077FF}
  );
  const pointerTap = () => {
    if (state.playing) {
      setState({playing: false, text: 'Play', col: 0x0077FF});
      props.audio.stop();
    } else {
      setState({playing: true, text: 'Stop', col: 0x444444});
      props.audio.play();
    }
  }
  return (
    <Container interactive={true} buttonMode={true} pointertap={pointerTap}
      filters={[
        new GlowFilter({distance: 30, color: 0x555555, outerStrength: 1.5})
      ]}
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

const AudioTimeText = (props) => {
  const [t, setT] = useState(0);
  useTick(_ => {
    setT(props.audio.ctx.currentTime);
  });
  return (
    <UText {...props}
      text={
        `${
          (('00')+Math.floor(t/60)).slice(-2)
        }:${
          (('00')+Math.floor(t)%60).slice(-2)
        }:${
          (('00')+t.toFixed(2)).slice(-2)
        }`
      }
    />
  );
}

export { Audio, AudioPlayer, AudioTimeText };