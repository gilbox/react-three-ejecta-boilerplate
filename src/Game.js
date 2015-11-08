import React, { Component, PropTypes } from 'react';
import THREE, { Vector3 } from 'three';
import { Object3D, PerspectiveCamera, Scene } from 'react-three';
import { tween } from 'react-imation';
import { provide, Provide } from 'react-stateful-stream/provide';
import { AnimationFrame } from 'react-imation/animationFrame';
import { playRandomPfSound } from './sounds';
import AddFlakesRandomly from './AddFlakesRandomly';
import Flake from './Flake';

const { innerWidth: width,
        innerHeight: height } = window;

const aspectRatio = width / height;
const cameraProps =
  { fov:75,
    aspect:aspectRatio,
    near:1,
    far:5000,
    position:new THREE.Vector3(0,0,600),
    lookat:new THREE.Vector3(0,0,0) };

const bounds = 1.2*height;
const boundsKeyframes = { 0: bounds,
                        100: -bounds };

const selectFlakes = ({flakes}) => flakes;
const ___ = function() {};

const selectEdit =
  ({gameOver, explodeFlake}) =>
  ({gameOver, explodeFlake});

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
    const { explodeFlake, canvas } = this.props;

    return (
      <div> {/* <~~ div is never rendered, it is used as a container for
                components that don't need to be a child of Scene */}

        {/* i must b crzy...
              using components for application logic (◑ ‿ ◐) */}
        <AddFlakesRandomly width={width} />
        <FlakeTicker />

        <Scene {...{width,height,canvas}}
          transparent={true}
          ref={scene => {
            this.scene = scene;
            this.props.refScene(scene);
          }}
          camera="maincamera">

          <PerspectiveCamera name="maincamera" {...cameraProps} />

          <Provide select={selectFlakes}>
          {flakes =>
            <Object3D>

              {flakes.map((flake,index) =>
                <Flake
                  key={flake.id}
                  explodingTick={flake.explodingTick}
                  onSlash3D={event => {
                    if (!flake.explode) {
                      playRandomPfSound();
                      explodeFlake(index);
                    }
                  }}
                  materialIndex={flake.materialIndex}
                  spinningTick={flake.tick}
                  quaternion={flake.quaternionXY}
                  scale={flake.scale}
                  position={
                    new Vector3(
                      tween(flake.tick, flake.driftKeyframes),
                      tween(flake.tick, boundsKeyframes),
                      0
                    )}
                />)}

            </Object3D>
          }</Provide>

        </Scene>
      </div>
    )
  }
}
