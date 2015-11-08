import { flakeMaterials } from './materials';
import { Quaternion, Euler } from 'three';

const quaternionFromEuler = (...args) =>
  new Quaternion().setFromEuler(
    new Euler(...args)
  );

export default function createFlake(id, x) {
  const quaternionXY = quaternionFromEuler(
    Math.random()*0.5 - 0.25, Math.random()*0.5 - 0.25, 0, 'XYZ'
  );

  return ({
    id,
    tick: 0,
    explodingTick: 0,
    materialIndex: ~~(flakeMaterials.length * Math.random()),
    scale: 2 + (Math.random() * 3),
    // rotationSpeed: Math.random() * 90 - 20,
    quaternionXY,
    driftKeyframes: {
      0: x,
      100: x + ~~(Math.random() * 40) - 15 },
    increment: .1 + Math.random()*0.2,
  });
}
