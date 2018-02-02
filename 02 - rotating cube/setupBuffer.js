import gl from './setupCanvas';
import shaderProgram from './shaderProgram';
import * as geo from './boxVertices';

// initializes the buffer with the points and other data that the shader program will execute upon
const setupBuffer = () => {

  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geo.triangleVertices), gl.STATIC_DRAW);

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

export default setupBuffer;