import { mat4, glMatrix } from 'gl-matrix';

const vsSource = `
  precision mediump float;

  attribute vec3 vertPosition;
  attribute vec3 vertColor;
  varying vec3 fragColor;
  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProj;

  void main() {
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  }
`;
// the fragment shader is executed for each pixel to be rendered
const fsSource = `
  precision mediump float;

  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`;

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
const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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

// initializes the buffer with the points and other data that the shader program will execute upon
const initBuffers = (gl, shaderProgram) => {
  const triangleVertices = [
    // X, Y,    R,G,B,
    0.0, 0.5, 0.0,   1.0, 1.0, 0.0,
    -0.5, -0.5, 0.0, 0.7, 0.0, 1.0,
    0.5, -0.5, 0.0,  0.1, 1.0, 0.6
  ];

  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject); // gl.ARRAY_BUFFER is a binding point, to which we are binding our webGL buffer object

  // Javascript's number type is always a 64 bit float (or something like that)
  // Float32Array casts the numbers in the array to 32 bit floats
  // initializes the buffer at the target/binding point and stores data in it
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  // static draw means that the contents of the buffer are likely to be used often, but rarely changed
  // gl.DYNAMIC_DRAW should be used for buffers that are used often and change often
  // gl.STREAM_DRAW should be used for buffers that are rarely used but change often

  // attribute locations in memory
  const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
  const colorAttribLocation = gl.getAttribLocation(shaderProgram, 'vertColor');
  {
    const elementsPerAttribute = 3;
    const typeOfElements = gl.FLOAT;
    const sizeOfIndividualVertex = 6 * Float32Array.BYTES_PER_ELEMENT; // 5 numbers times the memory size of each number
    const offsetFromVertexStartToThisAttribute = 0;
    // specifies the memory layout of the buffer
    gl.vertexAttribPointer(
      positionAttribLocation,
      elementsPerAttribute,
      typeOfElements,
      gl.FALSE, // gl boolean specifying whether integer data values should be normalized into a certain range when being casted to a float
      sizeOfIndividualVertex,
      offsetFromVertexStartToThisAttribute
    );
  }
  // block scoping is awesome
  {
    const elementsPerAttribute = 3;
    const typeOfElements = gl.FLOAT;
    const sizeOfIndividualVertex = 6 * Float32Array.BYTES_PER_ELEMENT;
    const offsetFromVertexStartToThisAttribute = 3 * Float32Array.BYTES_PER_ELEMENT; // skip the position values to get to the color values
    gl.vertexAttribPointer(
      colorAttribLocation,
      elementsPerAttribute,
      typeOfElements,
      gl.FALSE,
      sizeOfIndividualVertex,
      offsetFromVertexStartToThisAttribute
    );
  }

  /*
  Attributes must be enabled before they can be used by other methods
  */
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
}

const setTransformations = (gl, shaderProgram, canvas) => {
  // Locations in GPU memory
  const matWorldUniformLocation = gl.getUniformLocation(shaderProgram, 'mWorld');
  const matViewUniformLocation = gl.getUniformLocation(shaderProgram, 'mView');
  const matProjUniformLocation = gl.getUniformLocation(shaderProgram, 'mProj');

  // Matrices in RAM (CPU)
  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]); // TODO doc this
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0); // TODO doc this

  // bind matrix data to GPU memory
  gl.uniformMatrix4fv(
    matWorldUniformLocation,
    gl.FALSE, // transpose - always false in webGL (but not in openGL)
    worldMatrix,
  );
  gl.uniformMatrix4fv(
    matViewUniformLocation,
    gl.FALSE, // transpose - always false in webGL (but not in openGL)
    viewMatrix,
  );
  gl.uniformMatrix4fv(
    matProjUniformLocation,
    gl.FALSE, // transpose - always false in webGL (but not in openGL)
    projMatrix,
  );
}

const init = () => {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');

  if(!gl) {
    console.error('Tha webGlz doeznt workz... GET A PROPER BROWSER, you frig!!!');
    return;
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  initBuffers(gl, shaderProgram); // needs the shader program to get a pointer to the attributes

  gl.useProgram(shaderProgram); // sets a webGl / shader program to be used

  setTransformations(gl, shaderProgram, canvas);

  const matWorldUniformLocation = gl.getUniformLocation(shaderProgram, 'mWorld');
  const worldMatrix = new Float32Array(16);

  const identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  let angle = 0;
  let nrSecondsSinceWindowInit = 0;
  const loop = () => {
    nrSecondsSinceWindowInit = performance.now() / 1000;
    angle = nrSecondsSinceWindowInit / 0.2 * 2 * Math.PI; // a full rotation every 6 seconds
    mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]); // TODO doc this
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

init();
