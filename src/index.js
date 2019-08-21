import { run } from './engine';

const init = () => {};
const update = () => {};
const draw = ctx => {
  ctx.fillRect(0, 0, 128, 128);
  ctx.save();

  ctx.fillStyle = '#09F';
  ctx.fillRect(15, 15, 120, 120);

  ctx.save();
  ctx.fillStyle = '#FFF';
  ctx.globalAlpha = 0.5;
  ctx.fillRect(30, 30, 90, 90);

  ctx.restore();
  ctx.fillRect(45, 45, 60, 60);

  ctx.restore();
  ctx.fillRect(60, 60, 30, 30);

  ctx.print('bounceback 1.0', 10, 10);
};

run(init, update, draw);
