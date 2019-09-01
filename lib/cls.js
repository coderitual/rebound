export default function(ctx) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(1, 1);
}
