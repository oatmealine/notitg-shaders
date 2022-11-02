#version 120

varying vec2 textureCoord;
varying vec4 color;
varying float vSphereY;

uniform float phaseColumn;
uniform sampler2D sampler0;

void main() {
  float k = phaseColumn * vSphereY;

  gl_FragColor = texture2D( sampler0, textureCoord ) * color;
  gl_FragColor.w *= 1.0 - smoothstep( 0.9, 1.0, k );
}