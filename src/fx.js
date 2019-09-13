const particles = new Set();

for (let i = 0; i < 200; i++) {
  particles.add({
    x: 0,
    y: 0,
    velx: 0,
    vely: 0,
    mass: 0,
    r: 0,
    alive: false,
  });
}

function explode(x, y, r, amount) {
  let selected = 0;
  for (let p of particles) {
    if (!p.alive) {
      p.x = x;
      p.y = y;
      p.velx = -1 + Math.random() * 2;
      p.vely = -1 + Math.random() * 2;
      p.mass = 0.5 + Math.random() * 2;
      p.r = 0.5 + Math.random() * r;
      p.mass = 0.5 + Math.random() * 2;
      p.alive = true;
      selected++;
      if (selected === amount) {
        break;
      }
    }
  }
}

function update() {
  for (let p of particles) {
    if (p.alive) {
      p.x += p.velx / p.mass;
      p.y += p.vely / p.mass;
      p.r -= 0.1;
      if (p.r < 0.1) {
        p.alive = false;
      }
    }
  }
}

function draw(ctx) {
  ctx.fillStyle = '#FFEC27';
  for (let p of particles) {
    if (p.alive) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

export default { update, draw, explode };
