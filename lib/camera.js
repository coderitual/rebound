const viewport = {
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

export default function(ctx, x = 0, y = 0, rotation = 0, scale = 1) {
  const rads = degsToRads(rotation);
  ctx.resetTransform();
  ctx.translate(viewport.originx, viewport.originy);
  ctx.rotate(rads);
  ctx.scale(scale, scale);
  ctx.translate(-viewport.originx, -viewport.originy);
  ctx.translate(-x, -y);
}
