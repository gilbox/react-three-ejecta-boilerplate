// Syncronizes multiple requestAnimationFrame calls into one
// this seems to improve react rendering performance, probably
// due to the batching strategy.

let callbacks = [];
const invoke = fn => fn();
const tick = () => {
  const thisTicksCallbacks = [...callbacks];
  callbacks = [];
  thisTicksCallbacks.forEach(invoke);
  requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

export default function raf(cb) {
  callbacks.push(cb);
}
