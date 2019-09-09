import spritesheet from '/lib/spritesheet';
import shape from '/lib/shape';
import input from '/lib/input';
import camera from '/lib/camera';
import * as math from '/lib/math';
import projectile from './projectile';

const DEBUG_COLOR = '#FF0000';

const items = new Set();

let config = {
  // Rendering
  baseSprite: 'base',
  shootEndSprite: 'shoot-end',
  baseWidth: 10,
  baseHeight: 11,
  shootEndWidth: 4,
  shootEndHeight: 4,
  maxShootWidth: 10,

  // Shooting behaviour
  angleSpeed: 5,
  powerSpeed: 0.025,
  defaultPower: 0,
  maxLenght: 25,
  maxProjectileVelocity: 150,
};

let offset = 0;
export function shake(ctx) {
  let fade = 0.95;
  let offsetx = 16 - Math.random() * 32;
  let offsety = 16 - Math.random() * 32;
  offsetx *= offset;
  offsety *= offset;

  camera(ctx, offsetx, offsety);
  offset *= fade;
  if (offset < 0.05) {
    offset = 0;
  }
}

function add({
  x,
  y,
  playerId,
  targetAngle = 0,
  angle = 0,
  power = 1,
  targetPower = 1,
}) {
  items.add({
    x,
    y,
    playerId,
    targetAngle,
    angle,
    power,
    targetPower,
  });
}

function init() {
  spritesheet.define(
    config.shootEndSprite,
    56,
    19,
    config.shootEndWidth,
    config.shootEndWidth
  );
  spritesheet.define(
    config.baseSprite,
    56,
    8,
    config.baseWidth,
    config.baseHeight
  );
}

function updateBase(dt) {
  for (let item of items) {
    const inputs = $globalConfig.playerInput[item.playerId];

    // Rotate
    if (input.isDown(inputs.moveUpKey)) {
      item.targetAngle = item.targetAngle || 0;
      item.targetAngle -= config.angleSpeed;
    }

    // Rotate
    if (input.isDown(inputs.moveDownKey)) {
      item.targetAngle = item.targetAngle || 0;
      item.targetAngle += config.angleSpeed;
    } else {
    }

    // Set Firing Power!
    if (input.isDown(inputs.powerKey)) {
      item.targetPower = item.targetPower || 0;
      item.targetPower = Math.min(item.targetPower + config.powerSpeed, 1);
    } else {
      item.targetPower = item.targetPower || 0;
      item.targetPower = Math.max(
        item.targetPower - config.powerSpeed,
        config.defaultPower
      );
    }

    // Fire!
    if (input.isUp(inputs.powerKey)) {
      const spawnCenter = {
        x: item.x + config.baseWidth / 2,
        y: item.y + config.baseHeight / 2,
      };

      $globalConfig.shakeOffset = 0.07 + item.targetPower * 0.05;

      const radians = math.toRadians(item.angle);
      const direction = math.vecFromAngle(radians);
      console.log(direction);

      const projectilePower = item.targetPower * config.maxProjectileVelocity;

      projectile.add({
        ...spawnCenter,
        velocity: {
          x: direction.x * projectilePower,
          y: direction.y * projectilePower,
        },
      });
    }
  }
}

function update(dt) {
  updateBase(dt);
  projectile.update(dt);
}

function drawBase(ctx) {
  for (let i of items) {
    if ($globalConfig.isDebugDraw) {
      shape.drawRect(
        ctx,
        i.x,
        i.y,
        config.baseWidth,
        config.baseHeight,
        DEBUG_COLOR
      );
    } else {
      spritesheet.draw(ctx, config.baseSprite, i.x, i.y);
    }
  }
}

function drawShootLine(ctx) {
  for (var item of items) {
    let { x, y, targetAngle, angle, power, targetPower } = item;

    x = Math.floor(x + config.baseWidth / 2);
    y = Math.floor(y + config.baseHeight / 2);

    angle = angle || 0;
    targetAngle = targetAngle || 0;
    angle = math.lerp(angle, targetAngle, 0.07);
    power = Math.min(math.lerp(power, targetPower, 0.07), 1);

    const width = 2;
    const length = config.maxLenght * power;

    // Projection

    ctx.save();
    ctx.beginPath();

    ctx.translate(x, y + Math.floor(width / 2));
    ctx.rotate(math.toRadians(angle));
    ctx.moveTo(0, 0);
    ctx.lineTo(config.maxLenght, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f4f4a88';
    ctx.stroke();
    ctx.restore();

    // Fill color

    ctx.save();
    ctx.beginPath();

    ctx.translate(x, y + Math.floor(width / 2));
    ctx.rotate(math.toRadians(angle));
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f4f4aaa';
    ctx.stroke();
    ctx.restore();

    // Current power
    ctx.save();
    ctx.beginPath();

    ctx.translate(x, y + Math.floor(width / 2));
    ctx.rotate((angle * Math.PI) / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.setLineDash([2, 2]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#86da04';
    ctx.stroke();
    ctx.restore();

    item.angle = angle;
    item.power = power;
  }
}

function draw(ctx) {
  drawBase(ctx);
  drawShootLine(ctx);
  projectile.draw(ctx);
}

export default { draw, update, add, init };
