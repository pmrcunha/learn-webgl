import { mat4 } from 'gl-matrix';
import gl from './setupCanvas';
import shaderProgram from './shaderProgram';
import memLoc from './memoryLocations';

const render = () => {
  const worldMatrix = new Float32Array(16);
  const identityMatrix = new Float32Array(16);
  
  mat4.identity(identityMatrix);
  let angle = 0;
  let nrSecondsSinceWindowInit = 0;
  const loop = () => {
    nrSecondsSinceWindowInit = performance.now() / 1000;
    angle = nrSecondsSinceWindowInit / 6 * 2 * Math.PI; // a full rotation every 6 seconds
    mat4.rotate(
      worldMatrix, // receiving matrix (output)
      identityMatrix, // the matrix to rotate
      angle,
      [0, 1, 0]); // axis to rotate around
    gl.uniformMatrix4fv(memLoc.mWorld, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

export default render;