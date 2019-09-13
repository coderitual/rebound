const processAllSet = new Set();

export default function process(update = () => {}, render = () => {}) {
  let accumulatedTime = 0;
  let lastTime = 0;
  let deltaTime = 1 / 60;

  function tick(time) {
    accumulatedTime += (time - lastTime) / 1000;

    if (accumulatedTime > 1) {
      accumulatedTime = 1;
    }

    while (accumulatedTime > deltaTime) {
      update(deltaTime);
      accumulatedTime -= deltaTime;
    }

    render(accumulatedTime / deltaTime);
    lastTime = time;
  }

  processAllSet.add(tick);
}

function processAll(time) {
  requestAnimationFrame(processAll);
  processAllSet.forEach(process => {
    process(time);
  });
}

export function start() {
  requestAnimationFrame(processAll);
}
