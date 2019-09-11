import spritesheet from '/lib/spritesheet';
import font from '/lib/font';

spritesheet.define('heart', 0, 5 * 8, 7, 7);

export default {
  health(ctx, x, y, value) {
    spritesheet.draw(ctx, 'heart', x, y);
    font.print(ctx, 10, 10, value);
  },
  cash(ctx, x, y, value) {
    font.printOutline(ctx, x, y, `$${value}`, '#ffa300');
  },
};
