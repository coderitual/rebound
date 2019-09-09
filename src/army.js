import spritesheet from '/lib/spritesheet';
import shape from '/lib/shape';
import input from '/lib/input';
import math from '/lib/math';

const armies = new Set();

function spawn({ x, y, soldiers, type }) {
  items.add(...arguments);
}

function init() {
  spritesheet.define('soldier-red', 32, 0, 4, 5);
  spritesheet.define('soldier-blue', 32, 8, 4, 5);
  spritesheet.define('flag-red', 40, 0, 8, 8);
  spritesheet.define('flag-blue', 40, 8, 8, 8);
}

function update(dt) {
  for (let army of armies) {
  }
}

function draw(ctx) {
  for (let army of armies) {
  }
}

export default { draw, update, spawn, init };
