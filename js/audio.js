import * as PIXI from 'pixi.js';
/* CONST */
const SMOOTHING = 0.85;
const FFT_SIZE = 1024;

export class Audio {
    constructor(url) {
        this.status = 0;
        let audioCtx = new (
            window.AudioContext || window.webkitAudioContext
        )();
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = res => {
            audioCtx.decodeAudioData(
                res.currentTarget.response,
                buffer => {
                    if (!buffer)  throw 'Unknown error.';
                    this.status = 1;
                    this.analyser = audioCtx.createAnalyser();
                    this.analyser.connect(audioCtx.destination);
                    this.analyser.minDecibels = -140;
                    this.analyser.maxDecibels = 0;
                    this.freqs = new Uint8Array(
                        this.analyser.frequencyBinCount
                    );
                    this.source = audioCtx.createBufferSource();
                    this.source.connect(this.analyser);
                    this.source.buffer = buffer;
                    this.source.loop = true;
                },
                _ => {
                    throw 'decodeAudioData error';
                }
            );
        };
        request.onerror = () => {
            throw 'Loader: XHR error';
        };
        request.send();
    }

    play() {
        this.source.start(0);
    }

    getAudio() {
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = FFT_SIZE;
        this.analyser.getByteFrequencyData(this.freqs);
    }
}