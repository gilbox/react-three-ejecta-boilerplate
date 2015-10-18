import THREE from 'three';
import './react-three-ejecta';
import React, {Component} from 'react';
import ReactTHREE, {Object3D, PerspectiveCamera, Scene, Mesh} from 'react-three';
import {tween, combine} from 'react-imation';
import timelineFactory from 'react-imation/timeline/timeline';
import raf from './raf';
import stateful from 'react-stateful-stream';
import u from 'updeep';
const immutable = u({});

// for perf tuning:
// import random from './random';
// Math.random = random;

const {Timeline} = timelineFactory(React, raf);

const MAX_DROPPED = 300;

const canvas = document.getElementById('canvas');

const { innerWidth: width,
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
const flakeImages = ["images/3BxEO8i.png",
                     "images/do8589m.png",
                     "images/jbSVFgy.png",
                     "images/TT2lmN4.png"];

// const flakeTextures = flakeImages.map(THREE.ImageUtils.loadTexture);

const createMaterial = imageSrc => new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture( imageSrc ),
  transparent: true,
});

// const fmaterial = createMaterial(flakeImages[1]);
const flakeMaterials = flakeImages.map(createMaterial);

const zaxis = new THREE.Vector3( 0, 0, 1 );
const angleZ = angle => {
  const quaternion = new THREE.Quaternion();
  return quaternion.setFromAxisAngle(zaxis, angle );
}

const mult = 1;

const createFlake = (id, x) =>
  ({
    id,
    cacheKey:id,
    x,
    materialIndex: ~~(flakeImages.length * Math.random()),
    scale: 1 + (Math.random() * 3),
    rotationSpeed: Math.random() * 90 - 20,
    rotateX: ~~(Math.random()*1),
    rotateY: ~~(Math.random()*.7),
    // left: ~~(Math.random() * 100) + '%',
    drift: ~~(Math.random() * 40) - 15,
    // image: flakeImages[~~(flakeImages.length * Math.random())],
    increment: .1*mult + Math.random()*0.2,
  });

const pffSounds = [1,2,3].map(i => new Audio(`sounds/pf${i}.mp3`));
const pffSoundsCount = pffSounds.length;
const crrSound = new Audio('sounds/crr.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');

const randi = limit => ~~(Math.random() * limit);
const playRandomPfSound = () => pffSounds[randi(pffSoundsCount)].play();

const bounds = 1.2*height;
const boundsKeyframes = { 0: bounds,
                        105: -bounds };
const angleZKeyframes = { 0:0, 105: 25 };

const flakeHasId = id => flake => flake.id === id;
const concat = newItem => items => items.concat(newItem);
const lengthIsLessThan = length => items => items.length < length;
const increment = x => x + 1;
const decrement = x => x - 1;

@stateful(
  immutable(
    { flakes: [],
      droppedCount: 0,
      gameIsOver: false,
      score: 0
    }),
  edit => ({
    addFlake: newFlake => edit(u({flakes: u.if(lengthIsLessThan(21),concat(newFlake)),
                            droppedCount: increment })),
    removeFlake: flakeId => edit(u({flakes: u.reject(flakeHasId(flakeId)) })),
    explodeFlake: index => edit(u({flakes: { [index]: { explode: true } } })),
    playAgain: () => edit(u({gameIsOver: false, score: 0, flakes: [], droppedCount: 0})),
    gameOver: () => edit(u({gameIsOver: true})),
    addToScore: amount => edit(u({score: x => x + ~~amount })),
  }))
class App extends Component {
  constructor(props) {
    super(props)
    this.state = { a: 0 };
  }

  componentDidMount() {
    const {addFlake, gameOver} = this.props;

    // these ids are arbitrary, what's import is that they are unique
    let lastFlakeId = 0;

    // here we randomly create new flakes every so often
    const tick = () => {
      if (lastFlakeId > MAX_DROPPED) {
        return gameOver();
      }

      addFlake(createFlake(++lastFlakeId + 'f', ~~(Math.random() * width - width/2)));
      setTimeout(tick, 100 / mult + ~~(Math.random() * 40));
    }
    tick();

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
    const {flakes, removeFlake} = this.props;

    return (
      <Scene {...{width,height,canvas}}
        ref={scene => this.scene = scene}
        camera="maincamera">

        <PerspectiveCamera name="maincamera" {...cameraProps} />

        {flakes.map(({id, x, scale, increment, materialIndex}) =>
          {return <Timeline
            increment={increment}
            key={id}
            playOnMount={true}
            max={105}
            onComplete={() => removeFlake(id)}>
          {({tween}) =>

            <Object3D
              position={new THREE.Vector3(x, tween(boundsKeyframes), 0)}>

              <Mesh
                geometry={geometry}
                material={flakeMaterials[materialIndex]}
                onSlash3D={event => {
                  playRandomPfSound();
                  removeFlake(id)}}
                scale={scale}
                quaternion={angleZ(tween(angleZKeyframes))} />

            </Object3D>

          }</Timeline>})}

      </Scene>
    )
  }
}

// handles "mounting" but doesn't actually do anything to canvas,
// that's the job of <Scene />
ReactTHREE.render(<App />, canvas);
