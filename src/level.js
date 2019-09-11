import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';
import camera from '/lib/camera';
import cls from '/lib/cls';
import cooldown from '/lib/cooldown';
import fx from './fx';
import shape from '/lib/shape';
import input from '/lib/input';
import army from './army';
import base from './base';
import events from './events';
import * as constants from './constants';

let time = 1;
const cd = cooldown();

const initialState = {
  player1: {
    health: 100,
    cash: 100,
  },
  player2: {
    health: 100,
    cash: 100,
  },
};

let state;

events.on(constants.EV_PROJECTILE_DIED, args => {
  console.log('projectile died', { args });
});

function load() {
  state = { ...initialState };
  cd.set('intro');

  input.init();
  army.init();
  base.init();

  base.add({
    playerId: 0,
    x: 110,
    y: 64 - 5,
    angle: 90,
    targetAngle: 180,
    power: 1,
    targetPower: 0,
  });

  base.add({
    playerId: 1,
    x: 4,
    y: 64 - 5,
    angle: -90,
    targetAngle: 0,
    power: 1,
    targetPower: 0,
  });

  army.add({ x: 84, y: 64, count: 8, player: 1 });
}

function update(dt) {
  army.update(dt);
  base.update(dt);
  fx.update();
  time += dt;
}

function render(ctx) {
  cls(ctx);
  camera(ctx, 0, 0);
  map(ctx);
  camera(ctx);
  base.draw(ctx);
  army.draw(ctx);
  shape.drawGrid(ctx);

  if (cd.has('intro')) {
    spritesheet.draw(ctx, 'title', (128 - 56) / 2, 50);
    font.printOutline(
      ctx,
      'compo edition',
      (128 - 'compo edition'.length * 4) / 2,
      70,
      'white',
      'black'
    );
  }
}

export default { load, update, render };
