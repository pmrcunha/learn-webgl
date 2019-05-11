import { mat4, glMatrix } from "gl-matrix";
import { setupShaderProgram } from "./shaderProgram";
import { setupAttributes } from "./setupAttributes";
import { objects as objectsArray, getBoxVertices } from "./objects";

const setupContext = () => {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    throw new Error("WebGL is not supported by your browser");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  // Enable features
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  return gl;
};

const clearScreen = gl => {
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

const setupUniforms = gl => shaderProgram => {
  // The values to pass to fsSource2
  const iResolution = Float32Array.from([gl.canvas.width, gl.canvas.height]);
  const iTime = performance.now();

  const iResolutionPtr = gl.getUniformLocation(shaderProgram, "u_resolution");
  const iTimePtr = gl.getUniformLocation(shaderProgram, "u_time");

  // Bind the uniforms for fsSource2
  gl.uniform1f(iTimePtr, iTime);
  gl.uniform2fv(iResolutionPtr, iResolution);
};

const setTransformations = gl => shaderProgram => {
  const mWorld = gl.getUniformLocation(shaderProgram, "mWorld");
  const mView = gl.getUniformLocation(shaderProgram, "mView");
  const mProj = gl.getUniformLocation(shaderProgram, "mProj");

  // Matrices in RAM (CPU)
  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  // setup camera
  mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
  // setup perspective
  mat4.perspective(
    projMatrix,
    glMatrix.toRadian(45),
    gl.canvas.width / gl.canvas.height,
    0.1,
    1000.0
  );

  // bind matrix data to GPU memory
  gl.uniformMatrix4fv(
    mWorld,
    gl.FALSE, // transpose - always false in webGL (but not in openGL)
    worldMatrix
  );
  gl.uniformMatrix4fv(mView, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(mProj, gl.FALSE, projMatrix);
};

const render = gl => shaderProgram => (
  indices,
  angle = 0,
  nrSecondsSinceWindowInit = 0
) => {
  const worldMatrix = new Float32Array(16);
  const identityMatrix = new Float32Array(16);

  const mWorld = gl.getUniformLocation(shaderProgram, "mWorld");

  mat4.identity(identityMatrix);

  nrSecondsSinceWindowInit = performance.now() / 1000;
  angle = (nrSecondsSinceWindowInit / 6) * 2 * Math.PI; // a full rotation every 6 seconds
  mat4.rotate(
    worldMatrix, // receiving matrix (output)
    identityMatrix, // the matrix to rotate
    angle,
    [0, 1, 0]
  ); // axis to rotate around
  mat4.scale(worldMatrix, worldMatrix, [0.5, 0.5, 0.5]);
  gl.uniformMatrix4fv(mWorld, gl.FALSE, worldMatrix);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

const renderObjects = gl => objects => {
  objects.forEach(obj => {
    const { vertices, indices, vertexShader, fragmentShader } = obj;

    const shaderProgram = setupShaderProgram(gl)(vertexShader, fragmentShader);

    gl.useProgram(shaderProgram);
    setupAttributes(gl)(vertices, indices, shaderProgram);
    setupUniforms(gl)(shaderProgram);
    setTransformations(gl)(shaderProgram);
    render(gl)(shaderProgram)(indices);
  });
};

const init = () => {
  const gl = setupContext();

  clearScreen(gl);

  const loop = () => {
    clearScreen(gl);

    const xInput = document.getElementById("change-x");
    const yInput = document.getElementById("change-y");
    const zInput = document.getElementById("change-z");

    const vertices = getBoxVertices(xInput.value, yInput.value, zInput.value, [
      1.0,
      0.0,
      0.0
    ]);
    const objs = [{ ...objectsArray[0], vertices }, objectsArray[1]];

    renderObjects(gl)(objs);
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
};

init();
