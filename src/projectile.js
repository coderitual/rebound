import shape from '/lib/shape';
import * as math from '/lib/math';

function update(dt) {}

const list = new Set();

function add({
  x,
  y,
  velocity = { x: 0, y: 0 },
  drag = 0.985,
  idleVelocityMagnitude = 3.5,
}) {
  const item = {
    x,
    y,
    drag,
    velocity,
    idleVelocityMagnitude,
  };

  list.add(item);
  return item;
}

function destroy(item) {
  list.delete(item);
}

function update(dt) {
  for (let item of list) {
    const { x, y, velocity, drag, idleVelocityMagnitude } = item;

    if (math.vecLength(velocity) < idleVelocityMagnitude) {
      // Destroy on idle
      destroy(item);
      return;
    }

    const nvelocity = {
      x: velocity.x * drag,
      y: velocity.y * drag,
    };

    item.x = x + nvelocity.x * dt;
    item.y = y + nvelocity.y * dt;
    item.velocity = nvelocity;
  }
}

function draw(ctx) {
  ctx.fillStyle = '#ffffff';

  for (let item of list) {
    const { x, y } = item;
    shape.drawCircle(ctx, x, y, 2);
  }
}

export default { draw, update, add };
