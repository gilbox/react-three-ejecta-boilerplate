import THREE from 'three';
import './react-three-ejecta';
import React, { Component } from 'react';
import ReactTHREE from 'react-three';
import Game from './Game';
import appStateProvider from './appStateProvider';

const canvas = document.getElementById('canvas');

const AppComponent = () => <Game canvas={canvas} />

// appStateProvider is our custom stateful decorator
const App = appStateProvider(AppComponent)

// handles "mounting" but doesn't actually do anything to canvas,
// that's the job of <Scene />
ReactTHREE.render(<App />, canvas);
