// Syncronizes multiple requestAnimationFrame calls into one
// this seems to improve react rendering performance, probably
// due to the batching strategy.

let index = 0;
let callbacks = [];

const tick = () => {
  const thisTicksCallbacks = [...callbacks];
  callbacks = [];
  thisTicksCallbacks.forEach(cbo => cbo.cb());
  requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

export function raf(cb) {
  index++;
  callbacks.push({index, cb});
  return index;
}

export function cancelRaf(index) {
  callbacks = callbacks.filter(cbo => cbo.index !== index);
}
