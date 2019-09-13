import engine from '/lib/engine';

const all = new Set();

const config = {
  range: 10,
  health: 30,
};

let time = 0;
let uniqueId = 0;

function add({ x, y, count, playerId }) {
  all.add({
    id: uniqueId++,
    x,
    y,
    count,
    playerId,
    offsetY: 0,
    range: config.range,
    health: config.health,
  });
}

function init() {
  engine.define('cow-red', 16, 24, 8, 8);
  engine.define('cow-blue', 24, 24, 8, 8);
  engine.define('soldier-red', 0, 24, 4, 5);
  engine.define('soldier-blue', 8, 24, 4, 5);
  engine.define('flag-red', 0, 32, 8, 8);
  engine.define('flag-blue', 8, 32, 8, 8);
}

function spriteForPlayer(id, sprite) {
  return `${sprite}-${id === 0 ? 'red' : 'blue'}`;
}

var frame = 0;

function update(dt) {
  if (frame % 12 === 0) {
    for (let army of all) {
      if (army.state === 'fight') {
        if (army.cid % 2) {
          if (army.offsetY === 1) {
            army.offsetY = 0;
          } else {
            army.offsetY = 1;
          }
        } else {
          if (army.offsetY === 0) {
            army.offsetY = -1;
          } else {
            army.offsetY = 0;
          }
        }
      }
    }
  }

  frame++;
  time += dt;
}

function draw(ctx) {
  for (let army of all) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.03;
    ctx.beginPath();
    ctx.arc(army.x, army.y, army.range, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();

    const radius = army.type === 'cow' ? 5 : 3;

    if (army.type) {
      // soldiers
      for (let i = 0; i < Math.ceil(army.health) / 10; i++) {
        const x = Math.round(Math.cos(((Math.PI * 2) / 3) * i) * radius) + army.x;
        const y = Math.round(Math.sin(((Math.PI * 2) / 3) * i) * radius) + army.y;

        engine.draw(
          ctx,
          spriteForPlayer(army.playerId, army.type),
          x - 2,
          y - 2 + army.offsetY
        );
      }
    }
  }
}

export default { draw, update, add, init, all };
