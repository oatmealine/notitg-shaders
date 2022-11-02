#version 120

varying vec2 imageCoord;

uniform vec2 textureSize;
uniform vec2 imageSize;

uniform float amp;

uniform sampler2D sampler0;

// ------

bool isValidUV( vec2 v ) { return 0.0 < v.x && v.x < 1.0 && 0.0 < v.y && v.y < 1.0; }
vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

void main() {
  vec2 uv = imageCoord / 4.0;
  vec3 col = texture2D( sampler0, img2tex( uv ) ).xyz;
  col -= 0.1;

  col *= amp * vec3( 0.8, 0.9, 1.0 );

  bool a = mod( gl_FragCoord.x, 2.0 ) < 1.0 && mod( gl_FragCoord.y, 2.0 ) < 1.0;
  if ( a ) { col *= 2.0; }

  gl_FragColor = vec4( col, 1.0 );
}