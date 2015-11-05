import React, { PropTypes } from 'react';
import { provide } from 'react-stateful-stream/provide';
import { Object3D } from 'react-three';
import Interval from 'react-imation/Interval';
import createFlake from './createFlake';

const MAX_DROPPED = 300;

const selectState = ({droppedCount}) => ({droppedCount});
const selectEdit = ({gameOver, addFlake}) => ({gameOver, addFlake});

function AddFlakesRandomly({width, droppedCount, gameOver, addFlake}) {
  const tickHandler = scheduleTick => {
      if (droppedCount > MAX_DROPPED) {
        return gameOver();
      }
      addFlake(createFlake(droppedCount + 'f', ~~(Math.random() * width - width/2)));
      scheduleTick(100 + ~~(Math.random() * 40));
    };

  return <Interval onTick={tickHandler} />;
}

AddFlakesRandomly.propTypes = {
  width: PropTypes.number.isRequired,
}

export default provide(selectState, selectEdit)(AddFlakesRandomly);
