import spritesheet from '/lib/spritesheet';
import shape from '/lib/shape';
import input from '/lib/input';
import math from '/lib/math';

const armies = new Set();

const config = {
  range: 20,
};

let time = 0;

function add({ x, y, count, playerId }) {
  armies.add({ x, y, count, playerId });
}

function init() {
  spritesheet.define('soldier-red', 0, 24, 4, 5);
  spritesheet.define('soldier-blue', 8, 24, 4, 5);
  spritesheet.define('flag-red', 0, 32, 8, 8);
  spritesheet.define('flag-blue', 8, 32, 8, 8);
}

function spriteForPlayer(id, sprite) {
  return `${sprite}-${id === 0 ? 'red' : 'blue'}`;
}

function update(dt) {
  time += dt;
  for (let army of armies) {
  }
}

function draw(ctx) {
  for (let army of armies) {
    spritesheet.draw(
      ctx,
      spriteForPlayer(army.playerId, 'flag'),
      army.x - 2,
      army.y - 3
    );

    ctx.lineWidth = 1;

    // cripsy dotted area
    for (let i = 0; i < 8; i++) {
      const x =
        Math.round(Math.cos(((Math.PI * 2) / 8) * i + time) * config.range) +
        army.x;
      const y =
        Math.round(Math.sin(((Math.PI * 2) / 8) * i + time) * config.range) +
        army.y;

      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, 1, 1);
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y + 1, 1, 1);
    }

    // soldiers
    for (let i = 0; i < 3; i++) {
      const x = Math.round(Math.cos(((Math.PI * 2) / 3) * i) * 3) + army.x + 7;
      const y = Math.round(Math.sin(((Math.PI * 2) / 3) * i) * 3) + army.y + 10;

      spritesheet.draw(
        ctx,
        spriteForPlayer(army.playerId, 'soldier'),
        x - 2,
        y - 2
      );
    }
  }
}

export default { draw, update, add, init };
