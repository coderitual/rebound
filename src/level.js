import engine from '/lib/engine';
import fx from './fx';
import army from './army';
import base from './base';
import store from './store';
import ui from './ui';

let time = 1;
const cd = engine.cooldown();

window.$globalConfig = window.$globalConfig || {};
$globalConfig.shakeOffset = 0;

export function shake(ctx) {
  let fade = 0.96;
  let offsetx = 8 - Math.random() * 16;
  let offsety = 8 - Math.random() * 16;
  offsetx *= $globalConfig.shakeOffset;
  offsety *= $globalConfig.shakeOffset;

  engine.camera(ctx, offsetx, offsety);
  $globalConfig.shakeOffset *= fade;
  if ($globalConfig.shakeOffset < 0.08) {
    $globalConfig.shakeOffset = 0;
  }
}

// Game logic

const fields = {
  all: [
    { x: 48, y: 24, range: 8 },
    { x: 100, y: 12, range: 12 },
    { x: 60, y: 116, range: 12 },
  ],
};

const initialState = {
  player: [
    { cash: 100, health: 100, fields: 0 },
    { cash: 100, health: 100, fields: 0 },
  ],
  winner: 0,
  gameover: false,
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

store.onArmyFight = (a, b) => {
  if (a.state === 'dead' || b.state === 'dead') {
    return;
  }

  a.state = 'fight';
  b.state = 'fight';

  a.health -= Math.round(Math.random() * 3);
  b.health -= Math.round(Math.random() * 3);
  a.cid = 0;
  b.cid = 1;

  if (a.health <= 0) {
    a.state = 'dead';
    // army.all.delete(a);
  }

  if (b.health <= 0) {
    b.state = 'dead';
    // army.all.delete(b);
  }
};

store.onBaseAttack = (a, b) => {
  if (a.state === 'dead' || store.state.player[b.playerId].state === 'dead') {
    return;
  }
  store.state.player[b.playerId].health -= Math.round(Math.random() * 3);
  a.health -= Math.round(Math.random() * 5);

  store.state.player[b.playerId].state = 'fight';
  a.state = 'fight';

  if (a.health <= 0) {
    a.state = 'dead';
    // army.all.delete(a);
  }

  if (store.state.player[b.playerId].health <= 0) {
    store.state.player[b.playerId].state = 'dead';
    // army.all.delete(a);
    store.state.player[b.playerId].health = 0;
    store.onGameOver(a.playerId);
  }
};

store.onGameOver = winner => {
  store.state.winner = winner;
  store.state.gameover = true;
  cd.set('gameover', 3);
};

// Lifecycyle

function load() {
  store.state = JSON.parse(JSON.stringify(initialState));
  cd.set('intro', 2);

  engine.init();
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
  army.all.forEach(a => {
    a.type = 'soldier';

    fields.all.forEach(b => {
      if (Math.hypot(a.x - b.x, a.y - b.y) < a.range + b.range) {
        a.type = 'cow';
      }
    });
  });

  // check army - base collisions
  if (!cd.hasSet('collisions', 0.5)) {

    if (store.state.player[0].state !== 'dead') {
      store.state.player[0].state = 'idle';
    }

    if (store.state.player[1].state !== 'dead') {
      store.state.player[1].state = 'idle';
    }


    // check army - army collisions
    army.all.forEach(a => {
      if (a.state === 'fight' && a.state !== 'dead') {
        a.state = 'idle';
      }

      army.all.forEach(b => {
        if (
          a.playerId !== b.playerId &&
          Math.hypot(a.x - b.x, a.y - b.y) < a.range + b.range
        ) {
          store.onArmyFight(a, b);
        }
      });
    });


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

    // calculate fields usage
    store.state.player[0].fields = 0;
    store.state.player[1].fields = 0;
    army.all.forEach(a => {
      fields.all.forEach(b => {
        if (Math.hypot(a.x - b.x, a.y - b.y) < a.range + b.range) {
          store.state.player[a.playerId].fields++;
        }
      });
    });
  }

  if (!cd.hasSet('harvest', 0.5)) {
    store.onHarvest();
  }

  army.update(dt);
  base.update(dt);
  fx.update();
  time += dt;
}

function render(ctx) {
  engine.cls(ctx);
  shake(ctx);
  engine.map(ctx);
  base.draw(ctx);
  army.draw(ctx);

  if (cd.has('intro')) {
    engine.draw(ctx, 'title', (128 - 56) / 2, 50);
    engine.printOutline(
      ctx,
      'compo edition',
      (128 - 'compo edition'.length * 4) / 2,
      70,
      'white',
      'black'
    );
  }

  if (store.state.gameover) {
    if (cd.has('gameover')) {
      const text = `${store.state.winner === 0 ? 'red' : 'blue'} won!`;
      engine.printOutline(
        ctx,
        text,
        (128 - text.length * 4) / 2,
        50,
        'white',
        'black'
      );
    } else {
      store.state.gameover = false;
      store.state = JSON.parse(JSON.stringify(initialState));
      army.all.clear();
    }
  }

  ui.health(ctx, 104, 1, store.state.player[0].health, true);
  ui.cash(ctx, 110, 120, store.state.player[0].cash, true);
  ui.health(ctx, 1, 1, store.state.player[1].health);
  ui.cash(ctx, 1, 120, store.state.player[1].cash);
}

export default { load, update, render };
