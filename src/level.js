import font from '/lib/font';
import spritesheet from '/lib/spritesheet';
import map from '/lib/map';
import camera from '/lib/camera';
import cls from '/lib/cls';
import cooldown from '/lib/cooldown';
import fx from './fx';
import shape from '/lib/shape';

let time = 1;
const cd = cooldown();

let offset = 0;
export function shake(ctx) {
  let fade = 0.95;
  let offsetX = 16 - Math.random() * 32;
  let offsetY = 16 - Math.random() * 32;
  offsetX *= offset;
  offsetY *= offset;

  camera(ctx, offsetX, offsetY);
  offset *= fade;
  if (offset < 0.05) {
    offset = 0;
  }
}

function load() {}

function update(dt) {
  if (!cd.hasSet('explosion', 2)) {
    fx.explode(64, 64, 5, 100);
    offset = 0.3;
  }

  fx.update();
}

function render(ctx) {
  cls(ctx);

  camera(
    ctx,
    -20,
    -20,
    Math.cos(time++ / 200) * 10,
    Math.cos(time++ / 200) + 2
  );
  map(ctx);
  shape.drawGrid(ctx);

  shake(ctx);
  fx.draw(ctx);
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

export default { load, update, render };
