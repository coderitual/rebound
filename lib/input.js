const keys = new Map();
let memoise = new Map();

const STATE_DOWN = 1;
const STATE_UP = 2;

function handleKeyDown(ev) {
  if ($globalConfig.isDebugInput) {
    console.log('[input] key down: ', ev);
  }

  keys.set(ev.code, {
    code: ev.code,
    state: STATE_DOWN,
  });
}

function handleKeyUp(ev) {
  if ($globalConfig.isDebugInput) {
    console.log('[input] key up: ', ev);
  }

  memoise.clear();

  keys.set(ev.code, {
    code: ev.code,
    state: STATE_UP,
  });
}

function init() {
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('keydown', handleKeyDown);
}

function isUp(code) {
  const key = keys.get(code);
  return !key || key.state & STATE_UP;
}

function isDown(code) {
  const key = keys.get(code);
  if (!key) return false;
  return key.state & STATE_DOWN;
}

function isDownOnce(code) {
  if (memoise.has(`isDownOnce_${code}`)) {
    return false;
  }

  const key = keys.get(code);

  if (key && key && key.state & STATE_DOWN) {
    memoise.set(`isDownOnce_${code}`, true);
    return true;
  }

  return false;
}

export default { init, isUp, isDown, isDownOnce };
