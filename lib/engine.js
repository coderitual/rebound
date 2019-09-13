const fontResource = document.getElementById('font');

const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
const buffer = canvas.getContext('2d');

const fontWidth = 128;
const fontSize = 8;
const kerning = 5;
const letterSpacing = 1;
const fontColumns = Math.floor(fontWidth / fontSize);

function posFromIndex(index) {
  return [
    Math.floor(index % fontColumns) * fontSize,
    Math.floor(index / fontColumns) * fontSize,
  ];
}

function print(ctx, text, x, y, color = '#ffffff') {
  buffer.clearRect(0, 0, 128, 128);
  buffer.globalCompositeOperation = 'source-over';

  Array.from(text).forEach((char, i) => {
    const [sx, sy] = posFromIndex(char.charCodeAt(0));
    buffer.drawImage(
      fontResource,
      sx,
      sy,
      fontSize,
      fontSize,
      x + i * (fontSize - kerning + letterSpacing),
      y,
      fontSize,
      fontSize
    );
  });

  const textWidth = (fontSize - kerning + letterSpacing) * text.length;
  const textHeight = 8;

  buffer.globalCompositeOperation = 'source-in';
  buffer.fillStyle = color;
  buffer.fillRect(x, y, textWidth, textHeight);

  ctx.drawImage(
    canvas,
    x,
    y,
    textWidth,
    textHeight,
    x,
    y,
    textWidth,
    textHeight
  );
}

function printOutline(ctx, text, x, y, color = '#ffffff', outline = '#000000') {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!(i == 1 && j == 1)) {
        print(ctx, text, x + i, y + j, outline);
      }
    }
  }

  print(ctx, text, x + 1, y + 1, color);
}

// INPUT

const keys = new Map();
let inputMemoize = new Map();

const STATE_DOWN = 1;
const STATE_UP = 2;

function handleKeyDown(ev) {
  if ($globalConfig.isDebugInput) {
    console.log('[engine] key down: ', ev);
  }

  keys.set(ev.code, {
    code: ev.code,
    state: STATE_DOWN,
  });
}

function handleKeyUp(ev) {
  if ($globalConfig.isDebugInput) {
    console.log('[engine] key up: ', ev);
  }

  inputMemoize.clear();

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
  if (!key) return false;
  return key.state & STATE_UP;
}

function isDown(code) {
  const key = keys.get(code);
  if (!key) return false;
  return key.state & STATE_DOWN;
}

function isDownOnce(code) {
  if (inputMemoize.has(`isDownOnce_${code}`)) {
    return false;
  }

  const key = keys.get(code);

  if (key && key && key.state & STATE_DOWN) {
    inputMemoize.set(`isDownOnce_${code}`, true);
    return true;
  }

  return false;
}

function clear() {
  keys.forEach((value, key) => {
    if (value.state & STATE_UP) {
      keys.delete(key);
    }
  });
}

// Shape and Math

function drawGrid(ctx, spacing = 8) {
  if (!$globalConfig.isDebugDraw) {
    return;
  }

  ctx.beginPath();

  for (var x = 0.5; x < 128; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 128);
  }

  for (var y = 0.5; y < 128; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(128, y);
  }

  ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)';
  ctx.stroke();
}

function drawRect(ctx, x, y, width, height, fill) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawCircle(ctx, x, y, r, fillStyle) {
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }

  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLine(ctx, startPos, endPos, strokeStyle = '#FF0000') {
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

const vecDot = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

const vecSub = (v1, v2) => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

const vecLength = v => Math.sqrt(vecDot(v, v));

const vecFromAngle = radians => ({
  x: Math.cos(radians),
  y: Math.sin(radians),
});

const vecMultScalar = (v1, scalar) => ({
  x: v1.x * scalar,
  y: v1.y * scalar,
});

// r=d−2(d⋅n)n
const vecReflect = (v1, normal) => {
  const dot = vecDot(v1, normal);
  let result = vecMultScalar(normal, dot);
  result = vecMultScalar(result, 2);
  return vecSub(v1, result);
};

const toRadians = angle => angle * (Math.PI / 180);

// SPRITE SHEET!

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
  print,
  printOutline,
  init, isUp, isDown, isDownOnce, clear,
  drawGrid, drawRect, drawCircle, drawLine, lerp, vecDot, vecSub, vecLength, vecFromAngle, vecMultScalar, vecReflect, toRadians,
  define, draw, drawTile, getSize
};
