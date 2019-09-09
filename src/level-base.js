import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';
import camera from '/lib/camera';
import cls from '/lib/cls';
import cooldown from '/lib/cooldown';
import fx from './fx';
import shape from '/lib/shape';
import input from '/lib/input';
import base from './base';

let time = 1;
const cd = cooldown();

window.$globalConfig = window.$globalConfig || {};
$globalConfig.shakeOffset = 0;

export function shake(ctx) {
  let fade = 0.96;
  let offsetx = 8 - Math.random() * 16;
  let offsety = 8 - Math.random() * 16;
  offsetx *= $globalConfig.shakeOffset;
  offsety *= $globalConfig.shakeOffset;

  camera(ctx, offsetx, offsety);
  $globalConfig.shakeOffset *= fade;
  if ($globalConfig.shakeOffset < 0.08) {
    $globalConfig.shakeOffset = 0;
  }
}

function load() {
  input.init();
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
  base.update(dt);
  fx.update();
  time += dt;
}

function render(ctx) {
  cls(ctx);
  shake(ctx);
  map(ctx);
  base.draw(ctx);
  shape.drawGrid(ctx);

  if (time < 2.5) {
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
