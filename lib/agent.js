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

const FLAG_ALL = FLAG_COLLISION | FLAG_AVOIDANCE | FLAG_FORCES;

function add({ x, y, velocity, sprite, state = STATE_IDLE, flag = FLAG_ALL }) {
  agents.add({
    x,
    y,
    velocity,
    state,
    flag,
    sprite
  });
}

function remove(agent) {
  agents.remove(agent);
}

function update(dt) {}

function draw(ctx) {}
