import spritesheet from '/lib/spritesheet';
import shape from '/lib/shape';
import input from '/lib/input';
import math from '/lib/math';

const armies = new Set();

const config = {
  range: 20,
};

function add({ x, y, count, player }) {
  armies.add({ x, y, count, player });
}

function init() {
  spritesheet.define('soldier-red', 0, 24, 4, 5);
  spritesheet.define('soldier-blue', 8, 24, 4, 5);
  spritesheet.define('flag-red', 0, 32, 8, 8);
  spritesheet.define('flag-blue', 8, 32, 8, 8);
}

function update(dt) {
  for (let army of armies) {
  }
}

function draw(ctx) {
  for (let army of armies) {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(100, 60, 50, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();

    spritesheet.draw(ctx, 'flag-red', army.x, army.y);
  }
}

export default { draw, update, add, init };
