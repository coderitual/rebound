const img = document.getElementById('sprites');

const sprites = new Map();

function define(name, x, y, w, h) {
  sprites.set(name, { x, y, w, h });
}

function draw(ctx, name, x, y) {
  const sprite = map.get(name);

  if (!sprite) {
    console.warn(`Sprite ${name} is not defined`);
  }

  ctx.drawImage(
    img,
    sprite.x
    sprite.y,
    sprite.w,
    sprite.h,
    x,
    y,
    sprite.w,
    sprite.h,
  );
}
