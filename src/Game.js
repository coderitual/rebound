import Process from '../lib/Process';
import Font from '../lib/Font';

export default class Game extends Process {
  x = 10;
  y = 40;
  dx = 1;
  dy = 1;

  constructor() {
    super();
    console.log(
      '%c %c %c %c Bounce Back ',
      'background: #666;',
      'background: #555;',
      'background: #444;',
      'background: #000; color: #fff',
    );

    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.font = new Font(this.ctx);

    this.ctx.imageSmoothingEnabled = false;

    this.ctx.print = (text, x, y, color) => {
      this.font.print(text, x, y, color);
    };
  }

  update(dt) {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + 30 === 128 || this.x === 0) this.dx = -this.dx;
    if (this.y + 30 === 128 || this.y === 0) this.dy = -this.dy;
  }

  render() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, 128, 128);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(1, 1);

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 128, 128);

    this.ctx.fillStyle = '#09F';
    this.ctx.fillRect(this.x, this.y, 30, 30);

    this.ctx.print('bounceback 1.0', 40, 40, 'red');
  }
}
