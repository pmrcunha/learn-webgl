import { mat4, glMatrix } from 'gl-matrix';
import * as geo from './boxVertices.js';
import { initBuffers } from './setupBuffer';
import gl from './setupCanvas';
import shaderProgram from './shaderProgram';
import setupBuffer from './setupBuffer';
import setTransformations from './transformations';
import render from './render';
import { clearScreen } from './utils';


const init = () => {
  clearScreen();
  gl.useProgram(shaderProgram);

  setupBuffer();
  setTransformations();
  render();
}

init();