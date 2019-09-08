import spritesheet from '/lib/spritesheet';

/**
 * Entity that implements basic physics and movement characteristics.
 *  - Colison
 *  - Follow
 *  - Wander
 *  - Projectile (initial catapult/projectial/throw/shoot of units)
 */

const agents = new Set();

/**
 * CONSTANT: STATES
 */

// Not reacting to any physics. Stops any transforms immedietly.
const STATE_IDLE = 1;

// Just executing last applied attributes ie. velocity.
const STATE_MOVING = 2;

// Randomly wandering about within specific radius
const STATE_WANDERING = 4;

// Chase specific target. Target position needs to be defined. If target is reached, keep 'attack' distance.
const STATE_CHASE = 8;

/**
 * CONSTANT: FLAGS
 */

// Collision enabled
const FLAG_COLLISION = 1;

// Avoidance enabled. Agent is trying to avoid collision
const FLAG_AVOIDANCE = 2;

// Forces enabled. Agent reacts to outside forces
const FLAG_FORCES = 4;

// Enables debug drawing using red circle.
const FLAG_DEBUG = 8;

const FLAG_ALL = FLAG_COLLISION | FLAG_AVOIDANCE | FLAG_FORCES;

/**
 * CONSTANT: SHAPES
 * Used for collision detection.
 */

const SHAPE_CIRLCE = 1;

const SHAPE_SQUARE = 2;

/**
 * CONSTANTS: DEBUG PROPS
 */

const DEBUG_RADIUS = 2;

const DEBUG_COLOR = '#FF0000';

function add({
  x,
  y,
  velocity,
  sprite,
  state = STATE_IDLE,
  flag = FLAG_ALL,
  shape = SHAPE_CIRLCE,
  width,
  height,
}) {
  agents.add(...arguments);
}

function remove(agent) {
  agents.remove(agent);
}

function update(dt) {}

function draw(ctx) {
  for (let a of agents) {
    if ($globalConfig.isDebugDraw) {
      const height = a.height || a.width;
      ctx.beginPath();
      ctx.rect(a.x, a.y, a.width, height);
      ctx.fillStyle = DEBUG_COLOR;
      ctx.fill();
    } else {
      spritesheet.draw(ctx, a.sprite, a.x, a.y);
    }
  }
}

export default {
  update,
  draw,
  add,
  FLAG_DEBUG,
};
