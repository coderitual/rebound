import shape from '/lib/shape';
import * as math from '/lib/math';
import { getCollider } from '/lib/map';

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

let lastCollision = null;

function sphereCollide(source, velocity, target) {
  var delta = { x: target.x - source.x, y: target.y - source.y };
  var normD = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
  var normV = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  var v = { x: velocity.x / normV, y: velocity.y / normV };
  delta.x = delta.x / normD;
  delta.y = delta.y / normD;
  var alpha = delta.x * v.x + delta.y * v.y;
  var g = 2 * alpha * normV;
  delta.x = g * delta.x;
  delta.y = g * delta.y;
  return {
    x: velocity.x - delta.x,
    y: velocity.y - delta.y,
    alpha: alpha,
  };
}

function update(dt) {
  for (let item of list) {
    const { x, y, velocity, drag, idleVelocityMagnitude } = item;
    if (math.vecLength(velocity) < idleVelocityMagnitude) {
      // Destroy on idle
      destroy(item);
      return;
    }

    let nvelocity = {
      x: velocity.x * drag,
      y: velocity.y * drag,
    };

    let nx = x + nvelocity.x * dt;
    let ny = y + nvelocity.y * dt;

    const collider = getCollider(nx, ny, x, y, nvelocity);
    if (collider) {
      lastCollision = collider;
      const pos = { x, y };
      const npos = { x: nx, y: ny };
      const dir = math.vecSub(collider, npos);
      // nvelocity = sphereCollide(item, nvelocity, collider);
      nvelocity = collider.velocity;

      nx = x + nvelocity.x * dt;
      ny = y + nvelocity.y * dt;
    }

    item.x = nx;
    item.y = ny;

    item.velocity = nvelocity;
  }
}

function draw(ctx) {
  ctx.fillStyle = '#ff0000';

  if (lastCollision) {
    shape.drawCircle(ctx, lastCollision.x, lastCollision.y, 1);
    shape.drawLine(ctx, lastCollision.edge[0], lastCollision.edge[1]);
  }

  ctx.fillStyle = '#ffffff';
  for (let item of list) {
    const { x, y } = item;
    shape.drawCircle(ctx, x, y, 2);
  }
}

export default { draw, update, add };
