import Game from './Game';
import Process from '../lib/Process';

window.addEventListener(
  'load',
  () => {
    new Game();
    Process.start();
  },
  false,
);
