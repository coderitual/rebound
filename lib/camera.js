const viewport = {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  width: 128,
  height: 128,
  originx: 64,
  originy: 64,
};

function degsToRads(degs) {
  return degs / (180 / Math.PI);
}
function radsToDegs(rads) {
  return rads * (180 / Math.PI);
}

export function setViewport(ctx) {
  const rads = degsToRads(viewport.rotation);

  ctx.resetTransform();

  ctx.translate(viewport.originx, viewport.originy);
  ctx.rotate(rads);
  ctx.scale(viewport.scale, viewport.scale);
  ctx.translate(-viewport.originx, -viewport.originy);
  ctx.translate(-viewport.x, -viewport.y);
}

export default function(x = 0, y = 0, rotation = 0, scale = 1) {
  viewport.x = x;
  viewport.y = y;
  viewport.rotation = rotation;
  viewport.scale = scale;
}
