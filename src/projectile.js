import engine from '/lib/engine';
import store from './store';

const list = new Set();

function add({
  x,
  y,
  velocity = { x: 0, y: 0 },
  drag = 0.985,
  idleVelocityMagnitude = 5.9,
  playerId = 0,
}) {
  const item = {
    x,
    y,
    drag,
    velocity,
    idleVelocityMagnitude,
    playerId,
  };

  list.add(item);
  return item;
}

function destroy(item) {
  store.onProjectileDied(item);
  list.delete(item);
}

function update(dt) {
  for (let item of list) {
    const { x, y, velocity, drag, idleVelocityMagnitude } = item;
    if (engine.vecLength(velocity) < idleVelocityMagnitude) {
      // Destroy on idle
      destroy(item);
      return;
    }

    let nVelocity = {
      x: velocity.x * drag,
      y: velocity.y * drag,
    };

    let nx = x + nVelocity.x * dt;
    let ny = y + nVelocity.y * dt;

    const collider = engine.getCollider(nx, ny, x, y, nVelocity);
    if (collider) {
      nVelocity = collider.velocity;

      nx = x + nVelocity.x * dt;
      ny = y + nVelocity.y * dt;
    }

    item.x = nx;
    item.y = ny;

    item.velocity = nVelocity;
  }
}

function draw(ctx) {
  for (let item of list) {
    const { x, y, velocity } = item;
    engine.drawRect(ctx, Math.round(x) - 1, Math.round(y) - 1, 2, 2, '#2f6528');
    console.log();
    engine.drawRect(ctx, Math.round(x) - 1, Math.round(y) - 1 * engine.vecLength(velocity) / 15, 2, 2, '#fff');
  }
}

export default { draw, update, add };
