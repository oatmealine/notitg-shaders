#version 120

varying vec3 pos;
varying vec3 col;
varying vec3 shape;

void main() {
  float s = step( length( shape.xy ), 0.5 );
  gl_FragColor = vec4( col, s );
}