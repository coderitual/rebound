export default class Font {
  constructor(ctx) {
    this.ctx = ctx;
    this.img = document.getElementById('font');
    const width = 128;
    const height = 85;

    this.size = 8;
    this.kerning = 5;
    this.letterSpacing = 1;

    this.columns = Math.floor(width / this.size);
    this.rows = Math.floor(height / this.size);

    this.fillStyle = '#000000';
  }

  posFromIndex(index) {
    return [
      Math.floor(index % this.columns) * this.size,
      Math.floor(index / this.columns) * this.size,
    ];
  }

  print(text, x, y, fillStyle) {
    this.ctx.fillStyle = fillStyle;
    Array.from(text).forEach((char, i) => {
      const [sx, sy] = this.posFromIndex(char.charCodeAt(0));
      this.ctx.drawImage(
        this.img,
        sx,
        sy,
        this.size,
        this.size,
        x + i * (this.size - this.kerning + this.letterSpacing),
        y,
        this.size,
        this.size,
        fillStyle,
      );
    });
  }
}
