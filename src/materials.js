import THREE from 'three';

const flakeImages = ["images/3BxEO8i.png",
                     "images/do8589m.png",
                     "images/jbSVFgy.png",
                     "images/TT2lmN4.png"];

const createMaterial = imageSrc => new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture( imageSrc ),
  transparent: true,
});

export const flakeMaterials = flakeImages.map(createMaterial);
