window.$globalConfig = {
  width: 128,
  height: 128,
  // Draw bbox around entities and grid for a map
  isDebugDraw: false,

  // Print each keystroke
  isDebugInput: true,

  // TODO: Add button mapping for keys
  playerInput: {
    0: {
      moveUpKey: 'ArrowUp',
      moveDownKey: 'ArrowDown',
      powerKey: 'ControlRight',
    },
    1: {
      moveUpKey: 'KeyW',
      moveDownKey: 'KeyS',
      powerKey: 'Space',
    },
  },
};

import { init } from './game';

window.addEventListener('load', init, false);
