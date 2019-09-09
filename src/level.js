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

let time = 1;
const cd = cooldown();

function load() {
  input.init();
  army.init();
}

function update(dt) {
  army.update(dt);
  fx.update();
  time += dt;
}

function render(ctx) {
  cls(ctx);
  camera(ctx, 128, 0);
  map(ctx);
  army.draw(ctx);
  shape.drawGrid(ctx);
}

export default { load, update, render };
