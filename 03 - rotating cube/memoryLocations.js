import gl from "./setupCanvas";
import shaderProgram from "./shaderProgram";

// Locations in GPU memory
const mWorld = gl.getUniformLocation(shaderProgram, "mWorld");
const mView = gl.getUniformLocation(shaderProgram, "mView");
const mProj = gl.getUniformLocation(shaderProgram, "mProj");

// These are the uniforms of the more complex fragment shader fsSource2
const u_resolution = gl.getUniformLocation(shaderProgram, "u_resolution");
const u_time = gl.getUniformLocation(shaderProgram, "u_time");

export default {
  mWorld,
  mView,
  mProj,
  u_resolution,
  u_time
};
