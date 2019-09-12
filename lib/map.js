import mapinfo from '/assets/map.json';
import spritesheet from './spritesheet';
import * as math from '/lib/math';

const tileNormals = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

// This is fever dream based collision detection.
// Idea: Checking which edge normal is aligned best
// Sources:
// - Reflection: https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
export function getCollider(x, y, lastX, lastY, nextVelocity) {
  // Collider map
  const cmap = getCollisionMap();
  const tx = Math.floor((x / $globalConfig.width) * cmap.width);
  const ty = Math.floor((y / $globalConfig.height) * cmap.height);
  // World tile size
  const wts = $globalConfig.width / cmap.width;

  const index = tx + ty * cmap.width;
  // Collider value
  const cvalue = cmap.data[index];

  if (!cvalue) {
    return null;
  }

  // Tile Word position X
  const twx = (tx / cmap.width) * $globalConfig.width;
  const twy = (ty / cmap.height) * $globalConfig.height;

  const center = wts / 2;

  // Offsetting vertices to the center of each edge for better dot resolution where looking for most aligned edge normal
  const vertices = [
    { x: twx + center, y: twy },
    { x: twx + wts, y: twy + center },
    {
      x: twx + wts - center,
      y: twy + wts,
    },
    { x: twx, y: twy + wts - center },
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
    code: cvalue,
    tx: tx,
    ty: ty,
    x: twx + wts / 2,
    y: twy + wts / 2,
    velocity: math.vecReflect(nextVelocity, closestNormal),
  };
}

let collisionMapMemoize;
export function getCollisionMap() {
  if (collisionMapMemoize) {
    return collisionMapMemoize;
  }

  collisionMapMemoize = mapinfo.layers.find(layer => {
    return layer.name === 'collision';
  });

  return collisionMapMemoize;
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
