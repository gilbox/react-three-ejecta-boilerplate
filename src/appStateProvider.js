import stateful from 'react-stateful-stream';
import u from 'updeep';
import compose from 'lodash.compose';

const immutable = u({});

const flakeHasId = id => flake => flake.id === id;
const concat = newItem => items => items.concat(newItem);
const incrementByOne = x => x + 1;

// when the flake is exploding, spinning slows down
const spinningTickIncrementer = ({explode, increment, explodingTick}) =>
  x => x + (explode ? increment * ((60-explodingTick) / 60) : increment);

const tickIncrementer = ({explode, increment}) =>
  x => x + increment;

const defaultInitialState = immutable({
  flakes: [],
  droppedCount: 0,
  gameIsOver: false,
  score: 0
});

// These are our application state reducers...
// note that the signature of the `edit` function is simply:
//
//    {application state}  =>  {transformed application state}
//
const selectEdit = edit => ({
  addFlake: newFlake => {
    edit(u.if(
      ({flakes}) => flakes.length < 15
    , {
        flakes: concat(newFlake),
        droppedCount: incrementByOne
      }
    ))
  },

  removeFlake: flakeId => edit(u({
    flakes: u.reject(flakeHasId(flakeId))
  })),

  explodeFlake: index => edit(u({
    flakes: {
      [index]: { explode: true }
    }
  })),

  tickFlakes: () => edit(u({
    flakes: compose(
      u.reject(flake =>
        flake.tick > 100 ||
        flake.explodingTick > 60)
    , u.map(
        flake => u({
          tick: tickIncrementer(flake),
          spinningTick: spinningTickIncrementer(flake),
          explodingTick: u.if(flake.explode, incrementByOne),
        }, flake)
      )
    )
  })),

  playAgain: () => edit(u({
    gameIsOver: false,
    score: 0,
    flakes: [],
    droppedCount: 0
  })),

  gameOver: () => edit(u({
    gameIsOver: true
  })),

  addToScore: amount => edit(u({
    score: x => x + ~~amount
  })),
});

const options = { provider: true };

export default initialState => DecoratedComponent => initialState ?
  stateful(initialState, selectEdit, options)(DecoratedComponent) :
  stateful(defaultInitialState, selectEdit, options)(DecoratedComponent);
