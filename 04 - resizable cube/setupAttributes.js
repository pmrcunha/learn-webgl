export const setupAttributes = gl => (
  verticesArray,
  indicesArray,
  shaderProgram
) => {
  const vertices = new Float32Array(verticesArray);

  const boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const indices = new Uint16Array(indicesArray);

  const boxIndicesBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndicesBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const positionAttribLocation = gl.getAttribLocation(
    shaderProgram,
    "vertPosition"
  );
  const colorAttribLocation = gl.getAttribLocation(shaderProgram, "vertColor");

  // Setup attributes
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
  {
    const elementsPerAttribute = 3;
    const typeOfElements = gl.FLOAT;
    const sizeOfIndividualVertex = 6 * Float32Array.BYTES_PER_ELEMENT;
    const offsetFromVertexStartToThisAttribute =
      3 * Float32Array.BYTES_PER_ELEMENT; // skip the position values to get to the color values
    gl.vertexAttribPointer(
      colorAttribLocation,
      elementsPerAttribute,
      typeOfElements,
      gl.FALSE,
      sizeOfIndividualVertex,
      offsetFromVertexStartToThisAttribute
    );
  }

  // Enable attributes
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
};
