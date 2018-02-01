// vertex shader and fragment shader written GLSL
// the vertex shader is executed for each vertex of the shape

/*
In WebGL, values that apply to a specific vertex are stored in attributes. These are only available to the JavaScript code and the vertex shader. Attributes are referenced by an index number into the list of attributes maintained by the GPU
*/

const vsSource = `
  precision mediump float;

  attribute vec2 vertPosition;
  attribute vec3 vertColor;
  varying vec3 fragColor;

  void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
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
    0.0, 0.5,   1.0, 1.0, 0.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5,  0.1, 1.0, 0.6
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
    const elementsPerAttribute = 2;
    const typeOfElements = gl.FLOAT;
    const sizeOfIndividualVertex = 5 * Float32Array.BYTES_PER_ELEMENT; // 5 numbers times the memory size of each number
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
    const sizeOfIndividualVertex = 5 * Float32Array.BYTES_PER_ELEMENT;
    const offsetFromVertexStartToThisAttribute = 2 * Float32Array.BYTES_PER_ELEMENT; // skip the position values to get to the color values
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

const init = () => {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');

  if(!gl) {
    console.error('Tha webGlz doeznt workz... GET A PROPER BROWSER, you frig!!!');
    return;
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0); // sets the color that the screen will be cleared to
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clears the screen at all different depths (shapes render over previously rendered shapes)

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  initBuffers(gl, shaderProgram); // needs the shader program to get a pointer to the attributes

  gl.useProgram(shaderProgram); // sets a webGl / shader program to be used
  /*
  render primitives from array data
  gl.POINTS draws a single dot
  gl.LINES draws lines between 2 vertex
  gl.TRIANGLES draws a face/triangle from 3 vertex
  */
  gl.drawArrays(
    gl.TRIANGLES, // tyoe primitive to render. see above
    0, // starting index in the array of vertex points
    3 // number of indices to be rendered
  );
}

init();
