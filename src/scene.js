const scenes = new Map();
const empty = { load: () => {}, render: () => {}, update: () => {} };
let active = empty;

function add(name, scene) {
  scenes.set(name, { ...empty, ...scene });
}

function load(name) {
  const scene = scenes.get(name);
  if (!scene) {
    console.warn(`Loading "${name}" scene failed.`);
    return;
  }

  active = scene;
  scene.load();
}

function update(...args) {
  active.update(...args);
}

function render(...args) {
  active.render(...args);
}

export default { add, load, render, update };
