import * as PIXI from 'pixi.js';
import * as TEXT from './text.js'
/* CONST */
const SMOOTHING = 0.85;
const FFT_SIZE = 1024;

export class Audio {
    constructor(url, x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;
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
                    if (!buffer)  throw 'Unknown error.';
                    this.status = 1;
                    this.analyser = this.ctx.createAnalyser();
                    this.analyser.connect(this.ctx.destination);
                    this.analyser.minDecibels = -140;
                    this.analyser.maxDecibels = 0;
                    this.freqs = new Uint8Array(
                        this.analyser.frequencyBinCount
                    );
                    this.source = this.ctx.createBufferSource();
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
        this.container = new PIXI.Container();
        this.rect = new PIXI.Graphics()
            .beginFill(0x00BBFF)
            .drawRoundedRect(x, y, height*2.88, height, height*0.125)
            .endFill();
        this.container.addChild(this.rect);
        this.text = TEXT.Text(
            x+height*0.48, y+height*0.1,
            height*0.8, 'Play', 0x0A0A0A
        );
        this.container.addChild(this.text);
    
        this.onTap = this.onTap.bind(this);
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on('pointertap', this.onTap);
    }

    onTap() {
        if (this.status === 0) return;
        if (this.status === 2) {
            this.rect.clear();
            this.rect.beginFill(0x00BBFF)
                .drawRoundedRect(
                    this.x, this.y, this.height*0.48*6, this.height,
                    this.height*0.125
                )
                .endFill();
            this.status = 3;
            this.text.text = 'Play';
            this.ctx.suspend();
        } else {
            this.rect.clear();
            this.rect.beginFill(0x444444)
                .drawRoundedRect(
                    this.x, this.y, this.height*0.48*6, this.height,
                    this.height*0.125
                )
                .endFill();
            this.text.text = 'Stop';
            if (this.status === 1) this.source.start(0);
            else this.ctx.resume();
            this.status = 2;
        }
    }

    onTapStop() {
        

        this.container.on('pointertap', this.onTapPlay);
    }

    getAudio() {
        if (this.status !== 2) return [0];
        this.analyser.smoothingTimeConstant = SMOOTHING;
        this.analyser.fftSize = FFT_SIZE;
        this.analyser.getByteFrequencyData(this.freqs);
        return this.freqs;
    }
}