import React from 'react';
import { flakeMaterials, flakeQuartersMaterials } from './materials';
import THREE, { Vector3 } from 'three';
import { Object3D, Mesh } from 'react-three';
import { tween } from 'react-imation';

const quarters = [0,1,2,3];
const quarterPositions = [
  new Vector3(-2.5, 2.5, 0),  // TL
  new Vector3(2.5, 2.5, 0),   // TR
  new Vector3(-2.5, -2.5, 0), // BL
  new Vector3(2.5, -2.5, 0),  // BR
];

const geometry = new THREE.PlaneBufferGeometry( 10, 10, 1 );
const angleZKeyframes = { 0:0, 100: 25 };

const zaxis = new THREE.Vector3( 0, 0, 1 );
const angleZ = angle => {
  const quaternion = new THREE.Quaternion();
  return quaternion.setFromAxisAngle(zaxis, angle );
}

const quarterScaleKeyframes = {
  0: 0.5,
  60: 0,
};

export default function Flake({
  scale,
  quaternion,
  position,
  materialIndex,
  spinningTick,
  explodingTick,
  onSlash3D,
}) {
  const meshProps = {
    geometry,
    onSlash3D,
  };

  const quarterScale = explodingTick &&
    tween(explodingTick, quarterScaleKeyframes);

  return (
    <Object3D {...{ scale, quaternion, position }}>

      <Object3D quaternion={angleZ(tween(spinningTick, angleZKeyframes))}>

      {explodingTick ?
        quarters.map(quarter =>
          <Mesh
            {...meshProps}
            key={quarter}
            scale={new Vector3(quarterScale, quarterScale, 1)}
            material={flakeQuartersMaterials[quarter][materialIndex]}
            position={quarterPositions[quarter]} />)
        :
        <Mesh
          {...meshProps}
          material={flakeMaterials[materialIndex]} />}

      </Object3D>

    </Object3D>
  );
}
