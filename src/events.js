const events = new Map();

function on(event, callback) {
  events.set(event, [...(events.get(event) || []), callback]);
}
function trigger(event, ...params) {
  if (!events.has(event)) {
    return;
  }
  events.get(event).forEach(callback => callback(...params));
}

export default {
  on,
  trigger,
};
