export default class Process {
  static ALL = [];
  #accumulatedTime = 0;
  #lastTime = 0;
  deltaTime = 1 / 60;

  constructor() {
    Process.ALL.push(this);
  }

  #internalUpdate = time => {
    this.#accumulatedTime += (time - this.#lastTime) / 1000;

    if (this.#accumulatedTime > 1) {
      this.#accumulatedTime = 1;
    }

    while (this.#accumulatedTime > this.deltaTime) {
      this.update(this.deltaTime);
      this.#accumulatedTime -= this.deltaTime;
    }

    this.render(this.deltaTime);
    this.#lastTime = time;
  };

  update(dt) {}
  render() {}

  static start() {
    requestAnimationFrame(Process.#updateAll);
  }

  static #updateAll(dt) {
    requestAnimationFrame(Process.#updateAll);
    Process.ALL.forEach(process => {
      process.#internalUpdate(dt);
    });
  }
}
