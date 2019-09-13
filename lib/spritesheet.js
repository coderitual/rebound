const spriteSheetImg = document.getElementById('sprites');

const sprites = new Map();
const spriteSheetWidth = spriteSheetImg.width;
const spriteSheetHeight = spriteSheetImg.height;
const spriteSheetTileWidth = 8;
const spriteSheetTileHeight = 8;
const spriteSheetColumns = Math.floor(spriteSheetWidth / spriteSheetTileWidth);
const spriteSheetRows = Math.floor(spriteSheetHeight / spriteSheetTileHeight);

function getSize() {
  return {
    width: spriteSheetWidth,
    height: spriteSheetHeight,
    tileWidth: spriteSheetTileWidth,
    tileHeight: spriteSheetTileHeight,
    columns: spriteSheetColumns,
    rows: spriteSheetRows,
  };
}

function posFromIndex(index) {
  return [
    (index % spriteSheetColumns) * spriteSheetTileWidth,
    Math.floor(index / spriteSheetColumns) * spriteSheetTileHeight,
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
    spriteSheetImg,
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
    spriteSheetImg,
    tileX,
    tileY,
    spriteSheetTileWidth,
    spriteSheetTileHeight,
    x * spriteSheetTileWidth,
    y * spriteSheetTileHeight,
    spriteSheetTileWidth,
    spriteSheetTileHeight
  );
}

export default {
  define,
  draw,
  drawTile,
  getSize,
};
