const viewport = {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
};

function degsToRads(degs) {
  return degs / (180 / Math.PI);
}
function radsToDegs(rads) {
  return rads * (180 / Math.PI);
}

export function setViewport(ctx) {
  const rads = degsToRads(viewport.rotation);
  const sine = Math.sin(rads) * viewport.scale;
  const cosine = Math.cos(rads) * viewport.scale;

  ctx.resetTransform();
  ctx.setTransform(cosine, sine, -sine, cosine, viewport.x, viewport.y);
}

export default function(x = 0, y = 0, rotation = 0, scale = 1) {
  viewport.x = x;
  viewport.y = y;
  viewport.rotation = rotation;
  viewport.scale = scale;
}
