// turns black spots of the image into transparency, useful for creating loads of fake players without performance issues
// source - unknown
// first seen in unknown

#version 120

varying vec2 textureCoord;
varying vec4 color;

uniform sampler2D sampler0;

float gray( vec3 c ) {
  return 0.299 * c.x + 0.587 * c.y + 0.114 * c.z;
}

void main() {
	vec3 col = texture2D(sampler0, textureCoord).xyz;
	float lumi = gray(col);
	gl_FragColor = vec4(col, smoothstep(0.0, 0.4, lumi)) * color;
}
