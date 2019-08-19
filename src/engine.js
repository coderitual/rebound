export const run = (init = v => v, update = v => v, draw = v => v) => {
  console.log(
    '%c %c %c %c Bounce Back ',
    'background: #666;',
    'background: #555;',
    'background: #444;',
    'background: #000; color: #fff',
  );

  const canvas = document.getElementById('game');

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const loop = dt => {
    requestAnimationFrame(loop);
    update(dt);
    draw(ctx, dt);
  };
  init();
  loop();
};
