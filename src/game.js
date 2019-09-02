import { process, start } from '/lib/process';
import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';
import camera from '/lib/camera';
import cls from '/lib/cls';
import fx from './fx';

let vw = 0;
let vh = 0;
let x = 10;
let y = 40;
let dx = 1;
let dy = 1;

let time = 1;

let canvas;
let ctx;

export function init() {
  console.log(
    '%c %c %c %c Bounce Back ',
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

  spritesheet.define('hero', 0, 3 * 8, 8, 8);
  spritesheet.define('title', 0, 8, 56, 16);

  process(update, render);
  start();
  fx.explode(64, 64, 5, 50);
}

function update(dt) {
  x += dx;
  y += dy;
  if (x + 8 === vw || x === 0) dx = -dx;
  if (y + 8 === vh || y === 0) dy = -dy;
  fx.update();
}

function render() {
  cls(ctx);

  camera(ctx, -20, -20, Math.cos(time++ / 200) * 10, Math.cos(time++ / 200) + 2);
  map(ctx);
  spritesheet.draw(ctx, 'hero', x, y);

  camera(ctx);
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
