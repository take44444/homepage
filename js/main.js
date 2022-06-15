import * as PIXI from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {CRTFilter} from '@pixi/filter-crt';
import {GlitchFilter} from '@pixi/filter-glitch';
import * as SPECTRUM from './spectrum.js';
import * as MENU from './menu.js';

let app;
let quality;
let fps;
let spectrum;
let menu;

WebFont.load({
    google: { families: ['Noto Sans Mono'] },
    active: () => init(),
    inactive: () => alert('font loading failed')
});

var Fps = function () {
    this.cnt = 0;
    this.last = null;
    this.value = "";
};

Fps.prototype.nextFrame = function () {
    let now = new Date();
    this.cnt++;
    if (this.last === null) {
        this.last = now;
        return;
    }
    if ((now - this.last) > 200) {
        this.value = (((200 * this.cnt) / (now - this.last)) * 5).toFixed(1);
        this.cnt = 0;
        this.last = now;
    }
};

let time;
function animate(delta) {
    // time += delta;
    time += app.ticker.deltaMS/1000;
    spectrum.update([], time);
    menu.update(app.ticker.deltaMS/1000);
    fps.nextFrame();
    document.getElementById('fps').innerText = "fps: " + fps.value;
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
    // create Fps
    fps = new Fps();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // initialize
    time = 0;
    quality = 0.85;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create Application
    app = new PIXI.Application({
        width: 1920*quality,
        height: 1080*quality,
        backgroundColor: 0x000000,
        autoDensity: true,
    });
    document.getElementById('app').appendChild(app.view);
    app.stage.addChild(new PIXI.Graphics()
            .beginFill(0xD8D8FF)
            .drawRect(0, 0, app.screen.width, app.screen.height)
            .endFill());

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create name
    let name = new PIXI.Text('Takeshi Masumoto',
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: 50*quality,
            fill : 0x0A0A0A
        }
    );
    name.x = 90*quality;
    name.y = 960*quality;
    name.filters = [new GlowFilter({ distance: 30*quality, outerStrength: 1.2, color: 0x0A0A0A })];
    app.stage.addChild(name);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create theme
    let theme = new PIXI.Text('Creativity',
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: 50*quality,
            fill : 0x0077FF
        }
    );
    theme.anchor.x = 0.5;
    theme.anchor.y = 0.5;
    theme.x = app.screen.width/2;
    theme.y = app.screen.height/2;
    theme.filters = [new GlowFilter({ distance: 30*quality, outerStrength: 1.2, color: 0x00BBFF })];
    app.stage.addChild(theme);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create NcsSpectrum
    spectrum = new SPECTRUM.NcsSpectrum(
        { quality: quality, color: 0x0A0A0A, div: [127, 127] }
    );
    let spectrumContainer = spectrum.container;
    spectrumContainer.x = app.screen.width/2;
    spectrumContainer.y = app.screen.height/2;
    spectrumContainer.filters = [new GlowFilter({ distance: 30*quality, outerStrength: 1.5, color: 0x0A0A0A })];
    app.stage.addChild(spectrumContainer);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create Menu
    menu = new MENU.Menu(120, 450, 1460, 0, [
        { title: 'SNS', contents: [] },
        { title: 'History', contents: [] },
        { title: 'Qualification', contents: [] },
    ], { quality: quality });
    menu.container.filters = [new GlowFilter({ distance: 30*quality, outerStrength: 1.5, color: 0x555555 })];
    app.stage.addChild(menu.container);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // finalize
    app.ticker.add(animate);
    animate(0);
}
