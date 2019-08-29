import { convertColorToTransparent } from './utils';

const fontImg = document.getElementById('font');
const img = convertColorToTransparent(fontImg, 0, 0, 0);

const width = 128;
const height = 85;
const size = 8;
const kerning = 5;
const letterSpacing = 1;
const columns = Math.floor(width / size);
const rows = Math.floor(height / size);
const fillStyle = '#000000';

function posFromIndex(index) {
  return [Math.floor(index % columns) * size, Math.floor(index / columns) * size];
}

function print(ctx, text, x, y, fillStyle) {
  Array.from(text).forEach((char, i) => {
    const [sx, sy] = posFromIndex(char.charCodeAt(0));

    ctx.drawImage(
      img,
      sx,
      sy,
      size,
      size,
      x + i * (size - kerning + letterSpacing),
      y,
      size,
      size,
    );
  });
}

export default {
  print,
};
