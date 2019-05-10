import gl from "./setupCanvas";
import shaderProgram from "./shaderProgram";
import setupBuffer from "./setupBuffer";
import setTransformations from "./transformations";
import render from "./render";
import { clearScreen } from "./utils";

const init = () => {
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);

  clearScreen();

  gl.useProgram(shaderProgram);
  setupBuffer();
  setTransformations();
  render();
};

init();
