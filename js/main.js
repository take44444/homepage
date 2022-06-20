import * as PIXI from 'pixi.js';
import {CRTFilter} from '@pixi/filter-crt';
import {GlitchFilter} from '@pixi/filter-glitch';
import * as UTIL from './util.js'
import * as SPECTRUM from './spectrum.js';
import * as MENU from './menu.js';
import * as STATUS from './statusline.js';
import * as AUDIO from './audio.js';

let app;
let quality;
let spectrum;
let menu;
let statusline;
let audio;
let audioTime;

WebFont.load({
    google: { families: ['Noto Sans Mono'] },
    active: () => init(),
    inactive: () => alert('font loading failed')
});

let time;
function animate(delta) {
    // time += delta;
    time += app.ticker.deltaMS/1000;
    spectrum.update(audio.getAudio().slice(0, 8), time);
    audioTime.text = `${
        (('00')+Math.floor(audio.ctx.currentTime/60)).slice(-2)
    }:${
        (('00')+Math.floor(audio.ctx.currentTime)%60).slice(-2)
    }:${
        (('00')+audio.ctx.currentTime.toFixed(2)).slice(-2)
    }`;

    menu.update(app.ticker.deltaMS/1000);
    statusline.update();
    if ((time - Math.floor(time)) > 0.975)
        app.stage.filters = [
            new CRTFilter({ curvature: 1.2, vignetting: 0.27 }),
            new GlitchFilter(
                { slices: 80, offset: Math.sin(time)*30*quality, seed: time }
            )
        ];
    else
        app.stage.filters = [new CRTFilter({ curvature: 1.2, vignetting: 0.27 })];
}

function init() {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // initialize
    time = 0;
    quality = 1.0;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create Application
    app = new PIXI.Application({
        width: 1920*quality,
        height: 840*quality,
        backgroundColor: 0x000000,
        autoDensity: true,
    });
    document.getElementById('app').appendChild(app.view);
    app.stage.addChild(new PIXI.Graphics()
            .beginFill(0xD8D8FF)
            .drawRect(0, 0, app.screen.width, app.screen.height)
            .endFill());

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create play button
    audio = new AUDIO.Audio('bgm.mp3',
        app.screen.width/2-30*2.88*quality/2, 750*quality, 30*quality
    );
    app.stage.addChild(audio.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create name
    let name = UTIL.text(100*quality, 50*quality, 35*quality,
        'Takeshi Masumoto', 0x0A0A0A
    );
    name.filters = [UTIL.glowFilter(0x0A0A0A, 40*quality)];
    app.stage.addChild(name);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create audioTime
    audioTime = UTIL.text(0, 0, 45*quality, '00:00', 0x0077FF);
    audioTime.anchor.x = 0.5;
    audioTime.anchor.y = 0.5;
    audioTime.x = 430*quality;
    audioTime.y = 450*quality;
    audioTime.filters = [UTIL.glowFilter(0x0077FF, 40*quality)];
    app.stage.addChild(audioTime);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create NcsSpectrum
    spectrum = new SPECTRUM.NcsSpectrum(
        { quality: quality, color: 0x0A0A0A, div: [120, 120] }
    );
    let spectrumContainer = spectrum.container;
    spectrumContainer.x = 430*quality;
    spectrumContainer.y = 450*quality;
    app.stage.addChild(spectrumContainer);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create Menu
    menu = new MENU.Menu(
        840*quality, 200*quality, 220*quality, 170*quality, 35*quality,
        1130*quality, 52*quality, 23*quality, 32,
        [
            {
                title: "SNS",
                data: [
                    {
                        name: "Twitter",
                        url: "twitter.com/__take4"
                    },
                    {
                        name: "YouTube",
                        url: "youtube.com/channel/UCCpMrpmLGhb1PO-aPhzlmGw"
                    }
                ]
            },
            {
                title: "Interests",
                data: [
                    {
                        name: "Cyber Security",
                        description: "Reversing, Pwn"
                    },
                    {
                        name: "Programming Language",
                        description: "C/C++, Python, Rust, Java(Type)Script"
                    },
                    {
                        name: "Algorithm and Data Structure",
                        description: "Graph theory, Search algorithms"
                    },
                    {
                        name: "Web Development",
                        description: "PixiJS, React, Shader, Web Assembly"
                    },
                    {
                        name: "Computer Graphics",
                        description: "Perlin Noise, Curl Noise"
                    }
                ]
            },
            {
                title: "Other",
                data: [
                    {
                        title: "Works",
                        data: [
                            {
                                name: "Audio Spectrum Script",
                                url: "youtube.com/watch?v=j9wNzf7jiH8"
                            },
                            {
                                name: "Algorithm Book",
                                url: "take44444.github.io/Algorithm-Book/"
                            }
                        ]
                    },
                    {
                        title: "Qualifications",
                        data: [
                            {
                                name: "AtCoder",
                                description: "Cyan Coder"
                            },
                            {
                                name: "Security Next Camp",
                                description: "Security Next Camp 2020"
                            }
                        ]
                    }
                ]
            },
        ]
    );
    app.stage.addChild(menu.buttonContainer);
    app.stage.addChild(menu.contentContainer);

    statusline = new STATUS.StatusLine(0, 820*quality, 1920*quality, 20*quality);
    app.stage.addChild(statusline.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // finalize
    app.ticker.add(animate);
    animate(0);
}
