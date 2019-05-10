import { mat4 } from "gl-matrix";
import gl from "./setupCanvas";
import { boxIndices } from "./boxVertices";
import memLoc from "./memoryLocations";

const setUniforms = () => {
  // The values to pass to fsSource2
  const u_resolution = Float32Array.from([gl.canvas.width, gl.canvas.height]);
  const u_time = performance.now();

  // Bind the uniforms for fsSource2
  gl.uniform1f(memLoc.u_time, u_time);
  gl.uniform2fv(memLoc.u_resolution, u_resolution);
};

const render = () => {
  const worldMatrix = new Float32Array(16);
  const identityMatrix = new Float32Array(16);

  mat4.identity(identityMatrix);
  let angle = 0;
  let nrSecondsSinceWindowInit = 0;
  const loop = () => {
    nrSecondsSinceWindowInit = performance.now() / 1000;
    angle = (nrSecondsSinceWindowInit / 6) * 2 * Math.PI; // a full rotation every 6 seconds
    mat4.rotate(
      worldMatrix, // receiving matrix (output)
      identityMatrix, // the matrix to rotate
      angle,
      [0, 1, 0]
    ); // axis to rotate around
    mat4.scale(worldMatrix, worldMatrix, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(memLoc.mWorld, gl.FALSE, worldMatrix);

    setUniforms();

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
};

export default render;
