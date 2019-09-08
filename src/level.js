import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';
import camera from '/lib/camera';
import cls from '/lib/cls';
import cooldown from '/lib/cooldown';
import fx from './fx';
import agent from './agent';
import debug from '/lib/debug';
import input from '/lib/input';

let time = 1;
const cd = cooldown();

let offset = 0;
export function shake(ctx) {
  let fade = 0.95;
  let offsetx = 16 - Math.random() * 32;
  let offsety = 16 - Math.random() * 32;
  offsetx *= offset;
  offsety *= offset;

  camera(ctx, offsetx, offsety);
  offset *= fade;
  if (offset < 0.05) {
    offset = 0;
  }
}

function load() {
  agent.add({
    x: 0,
    y: 0,
    width: 4,
    height: 4,
    sprite: 'hero',
  });
}

function update(dt) {
  if (!cd.hasSet('explosion', 2)) {
    fx.explode(64, 64, 5, 100);
    offset = 0.3;
  }

  if (input.isDownOnce('KeyD')) {
    $globalConfig.isDebugDraw = !$globalConfig.isDebugDraw;
  }

  fx.update();
}

function render(ctx) {
  cls(ctx);

  camera(ctx, -20, -20, Math.cos(time++ / 200) * 10, Math.cos(time++ / 200) + 2);
  map(ctx);
  agent.draw(ctx);

  debug.drawGrid(ctx);

  shake(ctx);
  fx.draw(ctx);
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

export default { load, update, render };
