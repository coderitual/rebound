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
import store from './store';
import ui from './ui';

let time = 1;
const cd = cooldown();

// Game logic

const initialState = {
  player: [
    { cash: 100, health: 100, fields: 0 },
    { cash: 100, health: 100, fields: 0 },
  ],
};

store.onProjectileDied = ({ x, y, playerId }) => {
  army.add({ x: Math.round(x), y: Math.round(y), count: 8, playerId });
};

store.canProjectileLaunch = playerId => {
  return store.state.player[playerId].cash >= 30;
};
store.onProjectileLaunch = playerId => {
  store.state.player[playerId].cash -= 30;
};

store.onHarvest = () => {
  const MAX_CASH = 200;
  // 1 by default because base generate cash
  for (let i = 0; i < 2; i++) {
    store.state.player[i].cash += store.state.player[i].fields + 1;
    if (store.state.player[i].cash > MAX_CASH) {
      store.state.player[i].cash = MAX_CASH;
    }
  }
};

// Lifecycyle

function load() {
  store.state = { ...initialState };
  cd.set('intro', 2);

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
}

function update(dt) {
  if (!cd.hasSet('harvest', 0.5)) {
    store.onHarvest();
  }

  // check army base collistions
  army.all.forEach(a => {
    base.all.forEach(b => {
      if (
        a.playerId !== b.playerId &&
        Math.hypot(a.x - b.x, a.y - b.y) < a.range + b.range
      ) {
        store.onBaseAttack(a, b);
      }
    });
  });

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
  ui.health(ctx, 104, 1, store.state.player[0].health, true);
  ui.cash(ctx, 110, 120, store.state.player[0].cash, true);
  ui.health(ctx, 1, 1, store.state.player[1].health);
  ui.cash(ctx, 1, 120, store.state.player[1].cash);
}

export default { load, update, render };
