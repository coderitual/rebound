const img = document.getElementById('sprites');

const sprites = new Map();
const width = img.width;
const height = img.height;
const tileWidth = 8;
const tileHeight = 8;
const columns = Math.floor(width / tileWidth);
const rows = Math.floor(height / tileHeight);

function getSize() {
  return {
    width,
    height,
    tileWidth,
    tileHeight,
    columns,
    rows,
  };
}

function posFromIndex(index) {
  return [
    (index % columns) * tileWidth,
    Math.floor(index / columns) * tileHeight,
  ];
}

function define(name, x, y, w, h) {
  sprites.set(name, { x, y, w, h });
}

function draw(ctx, name, x, y) {
  const sprite = sprites.get(name);

  if (!sprite) {
    console.warn(`Sprite ${name} is not defined`);
  }

  ctx.drawImage(
    img,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    x,
    y,
    sprite.w,
    sprite.h
  );
}

function drawTile(ctx, id, x, y) {
  const [tileX, tileY] = posFromIndex(id);
  ctx.drawImage(
    img,
    tileX,
    tileY,
    tileWidth,
    tileHeight,
    x * tileWidth,
    y * tileHeight,
    tileWidth,
    tileHeight
  );
}

export default {
  define,
  draw,
  drawTile,
  getSize,
};
