import gl from './setupCanvas';
import * as shaders from './shadersSource';

// loadShader takes the source code for a shader, compiles it, and logs errors
const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('compiling a shader went to 💩', gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

// link the compiled shaders into a webGL program
export const initShaderProgram = () => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, shaders.vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, shaders.fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Error linking shader program!', gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  // NOTE this validates doesnt work for some reason
  // if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
  //   console.error('Error validating shader program!', gl.getProgramInfoLog(shaderProgram));
  //   return null;
  // }

  return shaderProgram;
}

export default initShaderProgram();