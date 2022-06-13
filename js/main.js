import * as PIXI from 'pixi.js';
import {GlowFilter} from '@pixi/filter-glow';
import {CRTFilter} from '@pixi/filter-crt';
import * as SPECTRUM from './spectrum.js';
import * as MENU from './menu.js';

let app;
let fpsCounter;
let spectrum;
let menu;

WebFont.load({
    google: { families: ['Noto Sans Mono'] },
    active: () => init(),
    inactive: () => alert('font loading failed')
});

var FPSCounter = function () {
    this.cnt = 0;
    this.last = null;
    this.value = "";
};

FPSCounter.prototype.nextFrame = function () {
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
    // rect.beginFill(0x000000)
    //     .drawRect(0, 0, time*100, 10)
    //     .endFill();
    fpsCounter.nextFrame();
    document.getElementById('fps').innerText = "fps: " + fpsCounter.value;
}

function init() {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // initialize
    time = 0;
    let quality = 0.7;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create Application
    app = new PIXI.Application({
        width: 1920*quality,
        height: 1080*quality,
        backgroundColor: 0xF8F8FF,
        autoDensity: true,
    });
    document.getElementById('app').appendChild(app.view);
    app.stage.addChild(new PIXI.Graphics()
            .beginFill(0xF8F8FF)
            .drawRect(0, 0, app.screen.width, app.screen.height)
            .endFill());

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create FPSCounter
    fpsCounter = new FPSCounter();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create name
    let name = new PIXI.Text('Takeshi Masumoto',
        { 
            fontFamily: 'Noto Sans Mono',
            fontSize: 60*quality,
            fill : 0x2B2620
        }
    );
    name.x = 70*quality;
    name.y = 940*quality;
    name.filters = [new GlowFilter({ distance: 30 * quality, outerStrength: 1.2, color: 0x2B2620 })];
    app.stage.addChild(name);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create NcsSpectrum
    spectrum = new SPECTRUM.NcsSpectrum({ quality: quality, color: 0x0A0A0A });
    let spectrumContainer = spectrum.container;
    spectrumContainer.x = app.screen.width/2;
    spectrumContainer.y = app.screen.height/2;
    spectrumContainer.filters = [new GlowFilter({ distance: 30 * quality, outerStrength: 1.5, color: 0x0A0A0A })];
    app.stage.addChild(spectrumContainer);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create Menu
    menu = new MENU.Menu(120, 450, 1800, 400, [
        { title: 'SNS', contents: [] },
        { title: 'History', contents: [] },
        { title: 'Qualification', contents: [] },
    ], { quality: quality });
    menu.buttonContainer.filters = [new GlowFilter({ distance: 30 * quality, outerStrength: 1.5, color: 0xBBBBBB })];
    app.stage.addChild(menu.buttonContainer);
    // app.stage.addChild(menu.contentContainer);

    app.stage.filters = [new CRTFilter()];
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // finalize
    app.ticker.add(animate);
    animate(0);
}
