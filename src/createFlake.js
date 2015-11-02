import { flakeMaterials } from './materials';

export default function createFlake(id, x) {
  return ({
    id,
    cacheKey:id,
    x,
    tick: 0,
    materialIndex: ~~(flakeMaterials.length * Math.random()),
    scale: 1 + (Math.random() * 3),
    rotationSpeed: Math.random() * 90 - 20,
    rotateX: ~~(Math.random()*1),
    rotateY: ~~(Math.random()*.7),
    // left: ~~(Math.random() * 100) + '%',
    drift: ~~(Math.random() * 40) - 15,
    increment: .1 + Math.random()*0.2,
  });
}
