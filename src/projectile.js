import engine from '/lib/engine';
import store from './store';

const list = new Set();

function add({
  x,
  y,
  velocity = { x: 0, y: 0 },
  drag = 0.985,
  idleVelocityMagnitude = 3.5,
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
  ctx.fillStyle = '#fff';

  for (let item of list) {
    const { x, y } = item;
    engine.drawCircle(ctx, Math.round(x), Math.round(y), 1);
  }
}

export default { draw, update, add };
