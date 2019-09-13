import process, { start } from '/lib/process';
import spritesheet from '/lib/engine';
import cls from '/lib/cls';
import input from '/lib/engine';
import scene from './scene';
import level from './level';

let canvas;
let ctx;
let vw;
let vh;

export function init() {
  console.log(
    '%c %c %c %c REBOUND ',
    'background: #666;',
    'background: #555;',
    'background: #444;',
    'background: #000; color: #fff'
  );

  canvas = document.getElementById('game');
  vw = canvas.width;
  vh = canvas.height;
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  input.init();

  spritesheet.define('title', 0, 8, 56, 16);

  scene.add('level', level);
  scene.load('level');

  process(update, render);
  start();
}

function update(dt) {
  scene.update(dt);

  if (input.isDownOnce('Backquote')) {
    $globalConfig.isDebugDraw = !$globalConfig.isDebugDraw;
  }
}

function render() {
  cls(ctx);
  scene.render(ctx);

  // Required to handle properly keyUpOnce
  input.clear();
}
