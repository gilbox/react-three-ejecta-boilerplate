import 'es6-shim';
import './react-three-ejecta';
import React from 'react';
import ReactTHREE from 'react-three';
import Game from './Game';
import appStateProvider from './appStateProvider';

const canvas = document.getElementById('canvas');

const AppComponent = () => <Game canvas={canvas} />

const initialState = module && module.hot && module.hot.data && module.hot.data.state;

// appStateProvider is our custom stateful decorator
const App = appStateProvider(initialState)(AppComponent)

// handles "mounting" but doesn't actually do anything to canvas,
// that's the job of <Scene />
const app = ReactTHREE.render(<App />, canvas);

const getAppState = () => app.state.atom.getState();

// setup HMR
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(data => {
    data.state = getAppState();
  });
}
