import { setViewport } from './camera';

const img = document.getElementById('sprites');

const sprites = new Map();
const width = img.width;
const height = img.height;
const tileWidth = 8;
const tileHeight = 8;
const columns = Math.floor(width / tileWidth);
const rows = Math.floor(height / tileHeight);

function drawImage(ctx, ...args) {
  setViewport(ctx);
  ctx.drawImage(...args);
}

function posFromIndex(index) {
  return [(index % columns) * tileWidth, Math.floor(index / columns) * tileHeight];
}

function define(name, x, y, w, h) {
  sprites.set(name, { x, y, w, h });
}

function draw(ctx, name, x, y) {
  const sprite = sprites.get(name);

  if (!sprite) {
    console.warn(`Sprite ${name} is not defined`);
  }

  drawImage(ctx, img, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
}

function drawTile(ctx, id, x, y) {
  const [tileX, tileY] = posFromIndex(id);
  drawImage(
    ctx,
    img,
    tileX,
    tileY,
    tileWidth,
    tileHeight,
    x * tileWidth,
    y * tileHeight,
    tileWidth,
    tileHeight,
  );
}

export default {
  define,
  draw,
  drawTile,
};
