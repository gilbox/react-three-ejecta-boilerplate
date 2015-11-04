import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import { Object3D, PerspectiveCamera, Scene, Mesh } from 'react-three';
import { tween, combine } from 'react-imation';
import { provide, Provide } from 'react-stateful-stream/provide';
import { playRandomPfSound } from './sounds';
import { flakeMaterials } from './materials';
import { AnimationFrame } from './animationFrame';
import Interval from './Interval';
import AddFlakesRandomly from './AddFlakesRandomly';

const { requestAnimationFrame: raf,
        innerWidth: width,
        innerHeight: height } = window;

const halfHeight = height/2;
const offset = -height/2;
const aspectRatio = width / height;
const cameraProps =
  { fov:75,
    aspect:aspectRatio,
    near:1,
    far:5000,
    position:new THREE.Vector3(0,0,600),
    lookat:new THREE.Vector3(0,0,0) };

const geometry = new THREE.PlaneBufferGeometry( 15, 15, 1 );
const bounds = 1.2*height;
const boundsKeyframes = { 0: bounds,
                       105: -bounds };
const angleZKeyframes = { 0:0, 105: 25 };

const zaxis = new THREE.Vector3( 0, 0, 1 );
const angleZ = angle => {
  const quaternion = new THREE.Quaternion();
  return quaternion.setFromAxisAngle(zaxis, angle );
}

const selectFlakes = ({flakes}) => flakes;
const selectDroppedCount = ({droppedCount}) => droppedCount;
const ___ = function() {};

const selectEdit =
  ({addFlake, gameOver, removeFlake}) =>
  ({addFlake, gameOver, removeFlake});

const selectTickFlakes = ({tickFlakes}) => ({tickFlakes});

const FlakeTicker = provide(___, selectTickFlakes)(
  ({tickFlakes}) => <AnimationFrame onTick={tickFlakes} />
);

@provide(___, selectEdit)
export default class Game extends Component {
  static propTypes = {
    refScene: PropTypes.func,
  }

  static defaultProps = {
    refScene: function(){},
  }

  componentDidMount() {
    // The <Scene />'s `pointerEvents` prop doesn't work with Ejecta,
    // so we need to attach events directly to `document`.
    // This solution is "universal", b/c it works in the browser as well.
    const projectPointerEvent = this.scene.projectPointerEvent
    const handleEvent = eventName => event => projectPointerEvent(event, eventName);
    document.addEventListener('touchstart', handleEvent('onSlash'));
    document.addEventListener('touchmove', handleEvent('onSlash'));
    document.addEventListener('mousemove', handleEvent('onSlash'));
  }

  render() {
    const { removeFlake, canvas, addFlake, gameOver } = this.props;

    return (
      <div> {/* <~~ div is never rendered, it is used as a container for
                components that don't need to be a child of Scene */}

        {/* i must b crzy...
              using components for application logic (◑ ‿ ◐) */}
        <AddFlakesRandomly width={width} />
        <FlakeTicker />

        <Scene {...{width,height,canvas}}
          ref={scene => {
            this.scene = scene;
            this.props.refScene(scene);
          }}
          camera="maincamera">

          <PerspectiveCamera name="maincamera" {...cameraProps} />

          <Provide select={selectFlakes}>
          {flakes =>
            <Object3D>

              {flakes.map(({id, x, scale, increment, materialIndex, tick}) =>
                <Object3D
                  key={id}
                  position={new THREE.Vector3(x, tween(tick, boundsKeyframes), 0)}>
                  <Mesh
                    geometry={geometry}
                    material={flakeMaterials[materialIndex]}
                    onSlash3D={event => {
                      playRandomPfSound();
                      removeFlake(id)}}
                    scale={scale}
                    quaternion={angleZ(tween(tick, angleZKeyframes))} />
                </Object3D>)}

            </Object3D>
          }</Provide>

        </Scene>
      </div>
    )
  }
}
