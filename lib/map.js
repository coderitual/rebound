import mapinfo from '/assets/map.json';
import spritesheet from './spritesheet';

console.log(mapinfo);
function draw(ctx) {
  mapinfo.layers.forEach(layer => {
    const { height, width, data } = layer;

    data.forEach((tile, index) => {
      if (tile === 0) return;
      spritesheet.drawTile(ctx, tile - 1, index % width, Math.floor(index / width));
    });
  });
}

export default {
  draw,
};
