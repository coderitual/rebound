import font from '/lib/font';
import camera from '/lib/camera';
import cls from '/lib/cls';
import cooldown from '/lib/cooldown';
import input from '/lib/input';
import scene from './scene';

const ACTION_START = Symbol('start');
const ACTION_HELP = Symbol('help');

const state = {
  buttons: [
    { action: ACTION_START, text: 'Begin Single Play' },
    { action: ACTION_HELP, text: 'How to Play' },
  ],
  active: 0,
};

const actions = {
  start() {
    scene.load('level');
  },
  help() {
    scene.load('help');
  },
};

export default {
  update() {},
  render(ctx) {
    cls(ctx);
    ctx.fillStyle = '#2f69bb';
    ctx.fillRect(0, 0, 128, 128);

    state.buttons.forEach(() => {});
  },
};
