import { process, start } from '/lib/process';
import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';

let vw = 0;
let vh = 0;
let x = 10;
let y = 40;
let dx = 1;
let dy = 1;

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

  spritesheet.define('hero', 0, 0, 8, 8);

  process(update, render);
  start();
}

function update(dt) {
  x += dx;
  y += dy;
  if (x + 30 === vw || x === 0) dx = -dx;
  if (y + 30 === vh || y === 0) dy = -dy;
}

function render() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, vw, vh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(1, 1);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, vw, vh);

  map.draw(ctx);

  ctx.fillStyle = '#09F';
  ctx.fillRect(x, y, 30, 30);

  spritesheet.draw(ctx, 'hero', x, y);

  font.printOutline(ctx, 'rebound 1.0', 40, 40, 'white', 'black');
}
