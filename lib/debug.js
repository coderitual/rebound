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

  ctx.strokeStyle = "rgba(255, 0, 0, 0.25)";
  ctx.stroke();
}

export default { drawGrid };
