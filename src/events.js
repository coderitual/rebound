const events = new Map();

function on(name, callback) {
  events.set(name, [...(events.get(name) || []), callback]);
}
function trigger(name, ...params) {
  if (!events.has(name)) {
    return;
  }
  events.get(name).forEach(callback => callback(...params));
}

export default { on, trigger };
