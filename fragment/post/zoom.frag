#version 120

#define BARREL_ITER 10
#define BARREL_AMP 0.5
#define BARREL_DIFF 0.5

#define HUGE 9E16
#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)

// ------

varying vec2 imageCoord;

uniform vec2 textureSize;
uniform vec2 imageSize;

uniform float amp;

uniform sampler2D sampler0;

// ------

bool isValidUV( vec2 v ) { return 0.0 < v.x && v.x < 1.0 && 0.0 < v.y && v.y < 1.0; }
vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

vec3 barrel( float amp, vec2 uv ) {
	float corn = length( vec2( 0.5 ) );
	float a = min( 3.0 * sqrt( amp ), corn * PI );
	float zoom = corn / ( tan( corn * a ) + corn );
	vec2 p = saturate(
    ( uv + normalize( uv - 0.5 ) * tan( length( uv - 0.5 ) * a ) ) * zoom +
    0.5 * ( 1.0 - zoom )
  );
	return texture2D( sampler0, img2tex( vec2( p.x, p.y ) ) ).xyz;
}

// ------

void main() {
  vec2 uv = imageCoord;

  vec3 tex = vec3( 0.0 );

  for ( int i = 0; i < BARREL_ITER; i ++ ) {
    float fi = ( float( i ) + 0.5 ) / float( BARREL_ITER );
    vec3 a = saturate( vec3(
      1.0 - 3.0 * abs( 1.0 / 6.0 - fi ),
      1.0 - 3.0 * abs( 1.0 / 2.0 - fi ),
      1.0 - 3.0 * abs( 5.0 / 6.0 - fi )
    ) ) / float( BARREL_ITER ) * 4.0;
    tex += a * barrel( BARREL_AMP * amp + BARREL_DIFF * amp * fi, uv );
  }

  gl_FragColor = vec4( tex, 1.0 );
}