import { run } from './engine';

let x = 10;
let y = 40;
let dx = 1;
let dy = 1;

const init = () => {};
const update = () => {
  x += dx;
  y += dy;
  if (x + 30 === 128 || x === 0) dx = -dx;
  if (y + 30 === 128 || y === 0) dy = -dy;
};

const draw = ctx => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, 128, 128);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(1, 1);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#09F';
  ctx.fillRect(x, y, 30, 30);

  ctx.print('bounceback 1.0', 40, 40, 'red');
};

window.addEventListener(
  'load',
  () => {
    run(init, update, draw);
  },
  false,
);
