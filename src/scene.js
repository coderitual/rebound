const scenes = new Map();
const defult = { load: () => {}, render: () => {}, update: () => {} };
let active = defult;

function add(name, scene) {
  scenes.set(name, { ...defult, ...scene });
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
