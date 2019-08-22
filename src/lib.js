export const convertTransparentToAlpha = (img, tr, tg, tb) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, img.width, img.height);

  for (let i = 0, len = pixels.data.length; i < len; i += 4) {
    const r = pixels.data[i];
    const g = pixels.data[i + 1];
    const b = pixels.data[i + 2];

    if (r == tr && g == tg && b == tb) {
      pixels.data[i + 3] = 0;
    }
  }

  ctx.putImageData(pixels, 0, 0);
  return canvas;
};
