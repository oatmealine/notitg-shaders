// a nop.frag - a shader that renders a black screen
// meant to be used as a template or to disable a shader

#version 120

varying vec4 color;

void main(void) {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) * color;
}
