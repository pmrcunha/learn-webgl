import gl from './setupCanvas';
import shaderProgram from './shaderProgram';

// Locations in GPU memory
const mWorld = gl.getUniformLocation(shaderProgram, 'mWorld');
const mView = gl.getUniformLocation(shaderProgram, 'mView');
const mProj = gl.getUniformLocation(shaderProgram, 'mProj');

export default {
  mWorld,
  mView,
  mProj,
}