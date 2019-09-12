const img = document.getElementById('font');

const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
const buffer = canvas.getContext('2d');

const width = 128;
const height = 85;
const size = 8;
const kerning = 5;
const letterSpacing = 1;
const columns = Math.floor(width / size);
const rows = Math.floor(height / size);

function posFromIndex(index) {
  return [
    Math.floor(index % columns) * size,
    Math.floor(index / columns) * size,
  ];
}

function print(ctx, text, x, y, color = '#ffffff') {
  buffer.clearRect(0, 0, 128, 128);
  buffer.globalCompositeOperation = 'source-over';

  Array.from(text).forEach((char, i) => {
    const [sx, sy] = posFromIndex(char.charCodeAt(0));
    buffer.drawImage(
      img,
      sx,
      sy,
      size,
      size,
      x + i * (size - kerning + letterSpacing),
      y,
      size,
      size
    );
  });

  const textWidth = (size - kerning + letterSpacing) * text.length;
  const textHeight = 8;

  buffer.globalCompositeOperation = 'source-in';
  buffer.fillStyle = color;
  buffer.fillRect(x, y, textWidth, textHeight);

  ctx.drawImage(
    canvas,
    x,
    y,
    textWidth,
    textHeight,
    x,
    y,
    textWidth,
    textHeight
  );
}

function printOutline(ctx, text, x, y, color = '#ffffff', outline = '#000000') {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!(i == 1 && j == 1)) {
        print(ctx, text, x + i, y + j, outline);
      }
    }
  }

  print(ctx, text, x + 1, y + 1, color);
}

export default {
  print,
  printOutline,
};
