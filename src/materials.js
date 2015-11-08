import THREE, { Vector2, ImageUtils } from 'three';

const flakeImages = ['images/3BxEO8i.png',
                     'images/do8589m.png',
                     'images/jbSVFgy.png',
                     'images/TT2lmN4.png'];

const quarterFlakeRepeat =
  { repeat: new Vector2(0.5, 0.5) };

const createMaterial = offset => imageSrc =>
  new THREE.MeshBasicMaterial({
    transparent: true,
    depthWrite: false,
    map: Object.assign(
      ImageUtils.loadTexture( imageSrc ),
      offset && { offset },
      offset && quarterFlakeRepeat
    )
  });

export const flakeMaterials = flakeImages.map(createMaterial());

const flakeQuartersOffsets = [
  new Vector2(0,0.5),
  new Vector2(0.5,0.5),
  new Vector2(0,0),
  new Vector2(0.5,0),
];

export const flakeQuartersMaterials =
  flakeQuartersOffsets.map(
    offsets => flakeImages.map(createMaterial(offsets))
  );
