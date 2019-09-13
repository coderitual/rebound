import engine from '/lib/engine';

engine.define('heart', 0, 5 * 8, 7, 7);

export default {
  health(ctx, x, y, value) {
    engine.draw(ctx, 'heart', x, y);
    engine.printOutline(ctx, `${value}`, x + 10, y);
  },
  cash(ctx, x, y, value) {
    engine.printOutline(ctx, `$${value}`, x, y, '#ffa300');
  },
};
