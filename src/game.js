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
  spritesheet.define('title', 0, 8, 56, 16);

  process(update, render);
  start();
}

function update(dt) {
  x += dx;
  y += dy;
  if (x + 8 === vw || x === 0) dx = -dx;
  if (y + 8 === vh || y === 0) dy = -dy;
}

function render() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, vw, vh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(1, 1);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, vw, vh);

  map.draw(ctx);

  spritesheet.draw(ctx, 'hero', x, y);

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
