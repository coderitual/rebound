import mapinfo from '/assets/map.json';
import spritesheet from './spritesheet';
import * as math from '/lib/math';

const tileNormals = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

const spriteSize = spritesheet.getSize();

// For some reason tileset now has width of 32 and height of 16.
// So for now instead of relying on size values from map, it's fixed here.
const mapSize = 16;

// This is fever dream based collision detection.
// Idea: Checking which edge normal is aligned best
// Sources:
// - Reflection: https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
export function getCollider(x, y, lastX, lastY, nextVelocity) {
  // Collider map
  const cmap = getCollisionMap();

  const tx = Math.floor((x / spriteSize.width) * mapSize);
  const ty = Math.floor((y / spriteSize.height) * mapSize);
  const worldTileSize = spriteSize.tileWidth;

  const index = tx + ty * cmap.width;
  const value = cmap.data[index];

  if (!value) {
    return null;
  }

  // Tile Word position X
  const twx = (tx / mapSize) * spriteSize.width;
  const twy = (ty / mapSize) * spriteSize.height;

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
    const dir = math.vecSub(lastPos, vertices[i]);
    const dot = math.vecDot(dir, tileNormals[i]);

    // Take into account if specific edge is facing another tile. If so, block it as possible selection.
    // LAAAAAMEEE! We should validate against object being inside square. But whatever... works 99% of the time ;)
    if (dot > closestDot) {
      closestDot = dot;
      closestIndex = i;
    }
  }

  const closestNormal = tileNormals[closestIndex];

  return {
    code: value,
    tx: tx,
    ty: ty,
    x: twx + worldTileSize / 2,
    y: twy + worldTileSize / 2,
    velocity: math.vecReflect(nextVelocity, closestNormal),
  };
}

export function getCollisionMap() {
  return mapinfo.layers.find(layer => {
    return layer.name === 'collision';
  });
}

export default function(ctx) {
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
      spritesheet.drawTile(
        ctx,
        tile - 1,
        index % width,
        Math.floor(index / width)
      );
    });
  });
}
