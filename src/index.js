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
      rotateLeft: 'ArrowLeft',
      rotateRight: 'ArrowRight',
      powerKey: 'ControlRight',
    },
    1: {
      rotateLeft: 'KeyA',
      rotateRight: 'KeyD',
      powerKey: 'KeyQ',
    },
  },
};

import { init } from './game';

window.addEventListener('load', init, false);
