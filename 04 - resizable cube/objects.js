export const objects = [
  {
    vertices: [
        // X, Y, Z           R, G, B
  // Top
		-1.0, 1.0, -1.0,   0.0, 0.0, 1.0,
		-1.0, 1.0, 1.0,    0.0, 0.0, 1.0,
		1.0, 1.0, 1.0,     0.0, 0.0, 1.0,
		1.0, 1.0, -1.0,    0.0, 0.0, 1.0,

		// Left
		-1.0, 1.0, 1.0,    0.0, 0.0, 1.0,
		-1.0, -1.0, 1.0,   0.0, 0.0, 1.0,
		-1.0, -1.0, -1.0,  0.0, 0.0, 1.0,
		-1.0, 1.0, -1.0,   0.0, 0.0, 1.0,

		// Right
		1.0, 1.0, 1.0,    1.0, 0.0, 0.0,
		1.0, -1.0, 1.0,   1.0, 0.0, 0.0,
		1.0, -1.0, -1.0,  1.0, 0.0, 0.0,
		1.0, 1.0, -1.0,   1.0, 0.0, 0.0,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.0,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.0,

		// Back
		1.0, 1.0, -1.0,    1.0, 0.0, 0.0,
		1.0, -1.0, -1.0,    1.0, 0.0, 0.0,
		-1.0, -1.0, -1.0,    1.0, 0.0, 0.0,
		-1.0, 1.0, -1.0,    1.0, 0.0, 0.0,

		// Bottom
		-1.0, -1.0, -1.0,   1.0, 0.0, 0.0,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
		1.0, -1.0, 1.0,     1.0, 0.0, 0.0,
		1.0, -1.0, -1.0,    1.0, 0.0, 0.0,
    ],
    indices: [
        // Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
    ],
    vertexShader: `
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
  `,
    fragmentShader: `
    precision mediump float;
  
    varying vec3 fragColor;
  
    void main() {
      gl_FragColor = vec4(fragColor, 1.0);
    }
  `,
    transformIds: {
      scale: ['box-scale-x', 'box-scale-y', 'box-scale-z'],
      translate: ['box-translate-x', 'box-translate-y', 'box-translate-z'],
      rotate: ['box-rotate-x', 'box-rotate-y', 'box-rotate-z']
    }
  },
  // triangle
  {
    vertices: [
        // X, Y,    R,G,B,
	-0.5, 0.5, 0.0,   1.0, 1.0, 0.0, 
	0.5, 0.5, 0.0, 0.7, 0.0, 1.0, 
	0.5, -0.5, 0.0,  0.1, 1.0, 0.6, 
	-0.5, -0.5, 0.0,  0.1, 1.0, 0.6,
    ],
    indices: [
    0, 1, 2, 
	2, 3, 0
    ],
    vertexShader: `
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
  `,
    fragmentShader: `
    precision mediump float;
  
    varying vec3 fragColor;
  
    void main() {
      gl_FragColor = vec4(fragColor, 1.0);
    }
  `,
  transformIds: {
    scale: ['triangle-scale-x', 'triangle-scale-y', 'triangle-scale-z'],
    translate: ['triangle-translate-x', 'triangle-translate-y', 'triangle-translate-z'],
    rotate: ['triangle-rotate-x', 'triangle-rotate-y', 'triangle-rotate-z']
  }
}
];

export const getBoxVertices = (x,y,z, color) => ([
      // Top
-x / 2.0, y/2.0, -z/2.0,   ...color,
-x / 2.0, y/2.0, z/2.0,    ...color,
x / 2.0, y / 2.0, z / 2.0,     ...color,
x / 2.0, y / 2.0, -z / 2.0,    ...color,

// Left
-x /2.0, y /2.0, z /2.0,    ...color,
-x /2.0, -y /2.0, z /2.0,   ...color,
-x /2.0, -y /2.0, -z /2.0,  ...color,
-x /2.0, y /2.0, -z /2.0,   ...color,

// Right
x / 2.0, y / 2.0, z / 2.0,    ...color,
x / 2.0, -y / 2.0, z / 2.0,   ...color,
x / 2.0, -y / 2.0, -z / 2.0,  ...color,
x / 2.0, y / 2.0, -z / 2.0,   ...color,

// Front
x / 2.0, y / 2.0, z / 2.0,    ...color,
x / 2.0, -y / 2.0, z / 2.0,    ...color,
-x / 2.0, -y / 2.0, z / 2.0,    ...color,
-x / 2.0, y / 2.0, z / 2.0,    ...color,

// Back
x / 2.0, y / 2.0, -z / 2.0,    ...color,
x / 2.0, -y / 2.0, -z / 2.0,    ...color,
-x / 2.0, -y / 2.0, -z / 2.0,    ...color,
-x / 2.0, y / 2.0, -z / 2.0,    ...color,

// Bottom
-x / 2.0, -y / 2.0, -z / 2.0,   ...color,
-x / 2.0, -y / 2.0, z / 2.0,    ...color,
x / 2.0, -y / 2.0, z / 2.0,     ...color,
x / 2.0, -y / 2.0, -z / 2.0,    ...color,
  ]);
