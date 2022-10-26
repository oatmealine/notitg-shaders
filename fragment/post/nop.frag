// a nop.frag - a shader that does nothing
// meant to be used as a template or to disable a shader

#version 120

uniform sampler2D sampler0;
varying vec2 textureCoord;
varying vec4 color;

void main (void) {
  gl_FragColor = texture2D(sampler0, textureCoord) * color;
}
