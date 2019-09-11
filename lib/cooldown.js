import process from '/lib/process';

const cooldowns = new Set();
let time = 0;

export default function cooldown() {
  const map = new Map();
  cooldowns.add(map);

  function has(name) {
    if (!map.has(name)) {
      return false;
    }

    const { value, created } = map.get(name);
    return time - created < value;
  }

  function set(name, value = 1) {
    map.set(name, {
      value: value,
      created: time,
    });
  }

  function hasSet(name, value) {
    if (has(name)) {
      return true;
    } else {
      set(name, value);
      return false;
    }
  }

  return {
    has,
    set,
    hasSet,
  };
}

process(dt => {
  time += dt;
});
