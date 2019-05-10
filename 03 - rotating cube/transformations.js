import { mat4, glMatrix } from "gl-matrix";
import gl from "./setupCanvas";
import shaderProgram from "./shaderProgram";
import memLoc from "./memoryLocations";

const setTransformations = () => {
  // Matrices in RAM (CPU)
  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]); // TODO doc this
  mat4.perspective(
    projMatrix,
    glMatrix.toRadian(45),
    gl.canvas.width / gl.canvas.height,
    0.1,
    1000.0
  ); // TODO doc this

  // The values to pass to fsSource2
  const u_resolution = Float32Array.from([gl.canvas.width, gl.canvas.height]);
  const u_time = Date.now();

  // bind matrix data to GPU memory
  gl.uniformMatrix4fv(
    memLoc.mWorld,
    gl.FALSE, // transpose - always false in webGL (but not in openGL)
    worldMatrix
  );
  gl.uniformMatrix4fv(memLoc.mView, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(memLoc.mProj, gl.FALSE, projMatrix);

  // Bind the uniforms for fsSource2
  gl.uniform1f(memLoc.u_time, u_time);
  gl.uniform2fv(memLoc.u_resolution, u_resolution);
};

export default setTransformations;
