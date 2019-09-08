import process, { start } from '/lib/process';
import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';
import camera from '/lib/camera';
import cls from '/lib/cls';
import cooldown from '/lib/cooldown';
import fx from './fx';
import agent from './agent';
import debug from '/lib/debug';
import input from '/lib/input';
import menu from './menu';

const scenes = {
  menu,
  level: { update: () => {}, render: () => {} },
};

const state = {
  scene: scenes.menu,
};

window.$globalConfig = {
  // Draw bbox around entities and grid for a map
  isDebugDraw: false,
  // Print each keystroke
  isDebugInput: false,
};

let vw = 0;
let vh = 0;
let x = 10;
let y = 40;
let dx = 1;
let dy = 1;

let time = 1;

let canvas;
let ctx;

const cd = cooldown();

let offset = 0;
export function shake(ctx) {
  let fade = 0.95;
  let offsetx = 16 - Math.random() * 32;
  let offsety = 16 - Math.random() * 32;
  offsetx *= offset;
  offsety *= offset;

  camera(ctx, offsetx, offsety);
  offset *= fade;
  if (offset < 0.05) {
    offset = 0;
  }
}

export function init() {
  console.log(
    '%c %c %c %c REBOUND ',
    'background: #666;',
    'background: #555;',
    'background: #444;',
    'background: #000; color: #fff',
  );

  canvas = document.getElementById('game');
  vw = canvas.width;
  vh = canvas.height;
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  input.init({ isDebug: true });

  spritesheet.define('hero', 0, 3 * 8, 8, 8);
  spritesheet.define('title', 0, 8, 56, 16);

  agent.add({
    x: 0,
    y: 0,
    width: 4,
    height: 4,
    sprite: 'hero',
  });

  process(update, render);
  start();
}

function update(dt) {
  if (!cd.hasSet('explosion', 2)) {
    fx.explode(64, 64, 5, 100);
    offset = 0.3;
  }

  x += dx;
  y += dy;
  if (x + 8 === vw || x === 0) dx = -dx;
  if (y + 8 === vh || y === 0) dy = -dy;

  if (input.isDownOnce('KeyD')) {
    $globalConfig.isDebugDraw = !$globalConfig.isDebugDraw;
  }

  fx.update();
}

function render() {
  cls(ctx);

  switch (state.scene) {
    case scenes.MENU:
      menu.render();
      return;
  }

  camera(ctx, -20, -20, Math.cos(time++ / 200) * 10, Math.cos(time++ / 200) + 2);
  map(ctx);
  spritesheet.draw(ctx, 'hero', x, y);
  agent.draw(ctx);

  debug.drawGrid(ctx);

  shake(ctx);
  fx.draw(ctx);
  spritesheet.draw(ctx, 'title', (128 - 56) / 2, 50);
  font.printOutline(
    ctx,
    'compo edition',
    (128 - 'compo edition'.length * 4) / 2,
    70,
    'white',
    'black',
  );
}
