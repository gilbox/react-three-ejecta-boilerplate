import stateful from 'react-stateful-stream';
import u from 'updeep';
import compose from 'lodash.compose';

const immutable = u({});

const flakeHasId = id => flake => flake.id === id;
const concat = newItem => items => items.concat(newItem);
const increment = x => x + 1;

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
        droppedCount: increment
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
          tick: x => x + flake.increment,
          explodingTick: u.if(flake.explode, increment),
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
