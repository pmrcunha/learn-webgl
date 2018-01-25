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

const fsSource = `
  precision mediump float;

  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`;

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

  // if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
  //   console.error('Error validating shader program!', gl.getProgramInfoLog(shaderProgram));
  //   return null;
  // }

  return shaderProgram;
}

const initBuffers = (gl, shaderProgram) => {
  const triangleVertices = [
    // X, Y,    R,G,B,
    0.0, 0.5,   1.0, 1.0, 0.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5,  0.1, 1.0, 0.6
  ];

  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  // attribute locations in memory
  const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
  const colorAttribLocation = gl.getAttribLocation(shaderProgram, 'vertColor');
  {
    const elementsPerAttribute = 2;
    const typeOfElements = gl.FLOAT;
    const sizeOfIndividualVertex = 5 * Float32Array.BYTES_PER_ELEMENT;
    const offsetFromVertexStartToThisAttribute = 0;
    gl.vertexAttribPointer(
      positionAttribLocation,
      elementsPerAttribute,
      typeOfElements,
      gl.FALSE,
      sizeOfIndividualVertex,
      offsetFromVertexStartToThisAttribute
    );
  }
  {
    const elementsPerAttribute = 3;
    const typeOfElements = gl.FLOAT;
    const sizeOfIndividualVertex = 5 * Float32Array.BYTES_PER_ELEMENT;
    const offsetFromVertexStartToThisAttribute = 2 * Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(
      colorAttribLocation,
      elementsPerAttribute,
      typeOfElements,
      gl.FALSE,
      sizeOfIndividualVertex,
      offsetFromVertexStartToThisAttribute
    );
  }

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

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  initBuffers(gl, shaderProgram);

  gl.useProgram(shaderProgram);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

init();
