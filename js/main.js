import * as PIXI from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {CRTFilter} from '@pixi/filter-crt';
import {GlitchFilter} from '@pixi/filter-glitch';
import * as TEXT from './text.js'
import * as SPECTRUM from './spectrum.js';
import * as MENU from './menu.js';
import * as STATUS from './statusline.js';
import * as AUDIO from './audio.js';

let app;
let quality;
let spectrum;
let menu;
let statusline;
let playButton;
let playButtonBg;
let audio;

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
    audio.container.filters = [new GlowFilter(
        { distance: 30*quality, outerStrength: 1.5, color: 0x555555 }
    )];
    app.stage.addChild(audio.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create name
    let name = TEXT.Text(100*quality, 50*quality, 35*quality,
        'Takeshi Masumoto', 0x0A0A0A
    );
    name.filters = [
        new GlowFilter(
            { distance: 30*quality, outerStrength: 1.2, color: 0x0A0A0A }
        )
    ];
    app.stage.addChild(name);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create theme
    let theme = TEXT.Text(0, 0, 35*quality, 'Creativity', 0x0077FF);
    theme.anchor.x = 0.5;
    theme.anchor.y = 0.5;
    theme.x = 420*quality;
    theme.y = 450*quality;
    theme.filters = [
        new GlowFilter(
            { distance: 30*quality, outerStrength: 1.2, color: 0x0077FF }
        )
    ];
    app.stage.addChild(theme);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create NcsSpectrum
    spectrum = new SPECTRUM.NcsSpectrum(
        { quality: quality, color: 0x0A0A0A, div: [120, 120] }
    );
    let spectrumContainer = spectrum.container;
    spectrumContainer.x = 420*quality;
    spectrumContainer.y = 450*quality;
    spectrumContainer.filters = [new GlowFilter({ distance: 30*quality, outerStrength: 1.5, color: 0x000000 })];
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
    menu.buttonContainer.filters = [new GlowFilter({ distance: 30*quality, outerStrength: 1.5, color: 0x555555 })];
    app.stage.addChild(menu.buttonContainer);
    app.stage.addChild(menu.contentContainer);

    statusline = new STATUS.StatusLine(0, 820*quality, 1920*quality, 20*quality);
    app.stage.addChild(statusline.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // finalize
    app.ticker.add(animate);
    animate(0);
}
