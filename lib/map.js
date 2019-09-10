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
  const cmap = getCollisionMap();
  const tileX = Math.floor((x / $globalConfig.width) * cmap.width);
  const tileY = Math.floor((y / $globalConfig.height) * cmap.height);
  const worldTileSize = $globalConfig.width / cmap.width;

  const index = tileX + tileY * cmap.width;
  const colliderValue = cmap.data[index];

  if (!colliderValue) {
    return null;
  }

  const tileWorldPosX = (tileX / cmap.width) * $globalConfig.width;
  const tileWorldPosY = (tileY / cmap.height) * $globalConfig.height;

  const center = worldTileSize / 2;

  // Offseting vertice to the center of each edge for better dot resolution where looking for most aligned edge normal
  const vertices = [
    { x: tileWorldPosX + center, y: tileWorldPosY },
    { x: tileWorldPosX + worldTileSize, y: tileWorldPosY + center },
    {
      x: tileWorldPosX + worldTileSize - center,
      y: tileWorldPosY + worldTileSize,
    },
    { x: tileWorldPosX, y: tileWorldPosY + worldTileSize - center },
  ];

  // This is only needed for debugging purpose.
  const edges = [
    // top edge
    [
      { x: tileWorldPosX, y: tileWorldPosY },
      { x: tileWorldPosX + worldTileSize, y: tileWorldPosY },
    ],
    // right edge
    [
      { x: tileWorldPosX + worldTileSize, y: tileWorldPosY },
      { x: tileWorldPosX + worldTileSize, y: tileWorldPosY + worldTileSize },
    ],
    // bottom edge
    [
      { x: tileWorldPosX + worldTileSize, y: tileWorldPosY + worldTileSize },
      { x: tileWorldPosX, y: tileWorldPosY + worldTileSize },
    ],
    // left edge
    [
      { x: tileWorldPosX, y: tileWorldPosY + worldTileSize },
      { x: tileWorldPosX, y: tileWorldPosY },
    ],
  ];

  var cloesestDot = -Number.MAX_VALUE;
  var closestIndex = 0;

  const lastPos = { x: lastX, y: lastY };

  // Think about sub-stepping!
  for (let i = 0; i < 4; i++) {
    const dir = math.vecSub(lastPos, vertices[i]);
    const dot = math.vecDot(dir, tileNormals[i]);

    // Take into account if specific edge is facing another tile. If so, block it as possible selection.
    // LAAAAAMEEE! We should validate against object being inside square. But whatever... works 99% of the time ;)
    if (dot > cloesestDot) {
      cloesestDot = dot;
      closestIndex = i;
    }
  }

  const closestNormal = tileNormals[closestIndex];
  const closestEdge = edges[closestIndex];

  return {
    code: colliderValue,
    tx: tileX,
    ty: tileY,
    x: tileWorldPosX + worldTileSize / 2,
    y: tileWorldPosY + worldTileSize / 2,
    edge: closestEdge,
    velocity: math.vecReflect(nextVelocity, closestNormal),
  };
}

let collisionMapMemoise;
export function getCollisionMap() {
  if (collisionMapMemoise) {
    return collisionMapMemoise;
  }

  collisionMapMemoise = mapinfo.layers.find(layer => {
    return layer.name === 'collision';
  });

  return collisionMapMemoise;
}

export default function(ctx) {
  mapinfo.layers.forEach(layer => {
    const { height, width, data, name } = layer;

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
