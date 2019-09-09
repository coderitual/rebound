import mapinfo from '/assets/map.json';
import spritesheet from './spritesheet';

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
