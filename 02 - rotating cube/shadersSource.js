export const vsSource = `
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

export const fsSource = `
  precision mediump float;

  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`;

// export const fsSource2 = `
// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform vec2 u_resolution;
// uniform float u_time;

// #define PI 3.14159265358979323846

// vec2 rotate2D(vec2 _st, float _angle){
//     _st -= 0.5;
//     _st =  mat2(cos(_angle),-sin(_angle),
//                 sin(_angle),cos(_angle)) * _st;
//     _st += 0.5;
//     return _st;
// }

// vec2 tile(vec2 _st, float _zoom){
//     _st *= _zoom;
//     return fract(_st);
// }

// float box(vec2 _st, vec2 _size, float _smoothEdges){
//     _size = vec2(0.5)-_size*0.5;
//     vec2 aa = vec2(_smoothEdges*0.5);
//     vec2 uv = smoothstep(_size,_size+aa,_st);
//     uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
//     return uv.x*uv.y;
// }

// void main(void){
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     vec3 color = vec3(0.0);

//     // Divide the space in 4
//     st = tile(st,4.);

//     // Use a matrix to rotate the space 45 degrees
//     st = rotate2D(st,PI*0.25);

//     // Draw a square
//     color = vec3(box(st,vec2(0.7),0.01));
//     // color = vec3(st,0.0);

//     gl_FragColor = vec4(color,1.0);
// }
// `;
