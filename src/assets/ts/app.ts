import * as PIXI from "pixi.js-legacy";
import { networkInterfaces } from "os";
const w = window.innerWidth - 150;
const h = window.innerHeight;
const stageElem = document.getElementById("stage");
let mode = "write";

const App = new PIXI.Application({
  width: w,
  height: h,
  backgroundColor: "0xeeeeee",
});

const layers = [
  {
    key: "stamp",
    container: new PIXI.Sprite(),
    graphics: null,
  },
  {
    key: "pen",
    container: new PIXI.Sprite(),
    opts: {
      lineHandle: {
        graphics: new PIXI.Graphics(),
        sprite: new PIXI.Sprite(),
      },
      eraserHandle: {
        graphics: new PIXI.Graphics(),
        sprite: new PIXI.Sprite(),
      },
    },
  },
];

window.onload = async function () {
  await init();

  const pen = layers.filter((r) => r.key == "pen")[0];
  let state = false;
  stageElem.addEventListener("mousedown", (e) => {
    App.stage.beforeX = e.offsetX;
    App.stage.beforeY = e.offsetY;
    state = true;
  });

  stageElem.addEventListener("mouseup", () => {
    state = false;
  });

  App.stage.on("mousemove", (e) => {
    if (!state) return false;
    const handle =
      mode == "write"
        ? pen.opts.lineHandle.graphics
        : pen.opts.eraserHandle.graphics;

    // pen.opts.lineHandle.graphics.blendMode =
    //   mode == "write" ? PIXI.BLEND_MODES.NORMAL : PIXI.BLEND_MODES.ADD;
    // console.log(pen.opts.lineHandle.graphics);
    // draw(e, pen.opts.lineHandle.graphics);
    draw(e, handle);
  });
};

function draw(e, handle) {
  const evt = e.data.originalEvent;
  handle.moveTo(App.stage.beforeX, App.stage.beforeY);
  handle.lineTo(evt.offsetX, evt.offsetY);

  App.stage.beforeX = evt.offsetX;
  App.stage.beforeY = evt.offsetY;
}

function changeMode(evt) {
  mode = evt.target.attributes["data-mode"].value;
}

async function init() {
  Array.from(document.getElementsByClassName("js-click-change-mode")).forEach(
    (n) => {
      n.addEventListener("click", changeMode);
    }
  );

  layers.forEach((l) => {
    App.stage.addChild(l.container);
  });
  App.renderer = new PIXI.CanvasRenderer({
    width: w,
    height: h,
    transparent: true,
    backgroundColor: "0xeeeeee",
  });
  stageElem.appendChild(App.view);

  const pen = layers.filter((r) => r.key == "pen")[0];

  pen.opts.lineHandle.graphics.lineStyle(2, "0x000000", 1);

  pen.opts.eraserHandle.graphics.lineStyle(12, "0x000000", 1);
  pen.opts.eraserHandle.graphics.blendMode = PIXI.BLEND_MODES.DST_OUT;

  pen.container.addChild(pen.opts.lineHandle.graphics);
  pen.container.addChild(pen.opts.eraserHandle.graphics);
  App.stage.interactive = true;
}
