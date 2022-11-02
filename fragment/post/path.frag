#version 120

varying vec2 textureCoord;
varying vec4 color;

uniform float phase = 1.0;
uniform float decay = 0.0;

uniform sampler2D sampler0;

void main() {
  vec4 tex = texture2D( sampler0, textureCoord );
  float alpha = tex.w;

  if ( phase < tex.x ) { discard; }

  if ( sin( ( textureCoord.x + textureCoord.y ) * 30.0 ) < decay * 2.0 - 1.0 ) { discard; }

  gl_FragColor = vec4( vec3( 1.0 ), alpha ) * color;
}