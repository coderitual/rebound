import mapinfo from '../assets/map';

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

function mapPosFromIndex(index) {
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
  const [tileX, tileY] = mapPosFromIndex(id);
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

// PROCESS

const processAllSet = new Set();

function process(update = () => {}, render = () => {}) {
  let accumulatedTime = 0;
  let lastTime = 0;
  let deltaTime = 1 / 60;

  function tick(time) {
    accumulatedTime += (time - lastTime) / 1000;

    if (accumulatedTime > 1) {
      accumulatedTime = 1;
    }

    while (accumulatedTime > deltaTime) {
      update(deltaTime);
      accumulatedTime -= deltaTime;
    }

    render(accumulatedTime / deltaTime);
    lastTime = time;
  }

  processAllSet.add(tick);
}

function processAll(time) {
  requestAnimationFrame(processAll);
  processAllSet.forEach(process => {
    process(time);
  });
}

function start() {
  requestAnimationFrame(processAll);
}

// COOLDOWN

const cooldowns = new Set();
let time = 0;

function cooldown() {
  const map = new Map();
  cooldowns.add(map);

  function has(name) {
    if (!map.has(name)) {
      return false;
    }

    const { value, created } = map.get(name);
    return time - created < value;
  }

  function set(name, value = 1) {
    map.set(name, {
      value: value,
      created: time,
    });
  }

  function hasSet(name, value) {
    if (has(name)) {
      return true;
    } else {
      set(name, value);
      return false;
    }
  }

  return {
    has,
    set,
    hasSet,
  };
}

process(dt => {
  time += dt;
});

// CLS

function cls(ctx) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

// CAMERA

const cameraViewport = {
  width: 128,
  height: 128,
  originx: 64,
  originy: 64,
};

function camera(ctx, x = 0, y = 0, rotation = 0, scale = 1) {
  const rads = toRadians(rotation);
  ctx.resetTransform();
  ctx.translate(cameraViewport.originx, cameraViewport.originy);
  ctx.rotate(rads);
  ctx.scale(scale, scale);
  ctx.translate(-cameraViewport.originx, -cameraViewport.originy);
  ctx.translate(-x, -y);
}

// MAP

const mapTileNormals = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const mapSpriteSize = getSize();

// For some reason tileset now has width of 32 and height of 16.
// So for now instead of relying on size values from map, it's fixed here.
const mapSize = 16;

// This is fever dream based collision detection.
// Idea: Checking which edge normal is aligned best
// Sources:
// - Reflection: https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
function getCollider(x, y, lastX, lastY, nextVelocity) {
  // Collider map
  const cmap = getCollisionMap();

  const tx = Math.floor((x / mapSpriteSize.width) * mapSize);
  const ty = Math.floor((y / mapSpriteSize.height) * mapSize);
  const worldTileSize = mapSpriteSize.tileWidth;

  const index = tx + ty * cmap.width;
  const value = cmap.data[index];

  if (!value) {
    return null;
  }

  // Tile Word position X
  const twx = (tx / mapSize) * mapSpriteSize.width;
  const twy = (ty / mapSize) * mapSpriteSize.height;

  const center = worldTileSize / 2;

  // Offsetting vertices to the center of each edge for better dot resolution where looking for most aligned edge normal
  const vertices = [
    { x: twx + center, y: twy },
    { x: twx + worldTileSize, y: twy + center },
    {
      x: twx + worldTileSize - center,
      y: twy + worldTileSize,
    },
    { x: twx, y: twy + worldTileSize - center },
  ];

  var closestDot = -Number.MAX_VALUE;
  var closestIndex = 0;

  const lastPos = { x: lastX, y: lastY };

  // Think about sub-stepping!
  for (let i = 0; i < 4; i++) {
    const dir = vecSub(lastPos, vertices[i]);
    const dot = vecDot(dir, mapTileNormals[i]);

    // Take into account if specific edge is facing another tile. If so, block it as possible selection.
    // LAAAAAMEEE! We should validate against object being inside square. But whatever... works 99% of the time ;)
    if (dot > closestDot) {
      closestDot = dot;
      closestIndex = i;
    }
  }

  const closestNormal = mapTileNormals[closestIndex];

  return {
    code: value,
    tx: tx,
    ty: ty,
    x: twx + worldTileSize / 2,
    y: twy + worldTileSize / 2,
    velocity: vecReflect(nextVelocity, closestNormal),
  };
}

function getCollisionMap() {
  return mapinfo.layers.find(layer => {
    return layer.name === 'collision';
  });
}

function map(ctx) {
  mapinfo.layers.forEach(layer => {
    const { width, data, name } = layer;

    if (name === 'collision') {
      if (!$globalConfig.isDebugDraw) {
        return;
      }
      ctx.globalAlpha = 0.3;
    } else {
      ctx.globalAlpha = 1;
    }

    data.forEach((tile, index) => {
      if (tile === 0) return;
      drawTile(ctx, tile - 1, index % width, Math.floor(index / width));
    });
  });
}

export default {
  print,
  printOutline,
  init,
  isUp,
  isDown,
  isDownOnce,
  clear,
  drawGrid,
  drawRect,
  drawCircle,
  drawLine,
  lerp,
  vecDot,
  vecSub,
  vecLength,
  vecFromAngle,
  vecMultScalar,
  vecReflect,
  toRadians,
  define,
  draw,
  drawTile,
  getSize,
  start,
  process,
  processAll,
  cooldown,
  cls,
  camera,
  map,
  getCollisionMap,
  getCollider,
};
