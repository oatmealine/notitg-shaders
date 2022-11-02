#version 120

#define SMRES vec2(640.0,480.0)

varying vec2 textureCoord;
varying vec2 imageCoord;

uniform vec2 textureSize;
uniform vec2 imageSize;

uniform float time;
uniform float beat;

uniform vec2 displaySize;

uniform sampler2D sampler0;
uniform vec2 sampler0Reso;

uniform sampler2D samplerRandom;
uniform vec2 samplerRandomReso;
uniform float pixelsPerParticle;

uniform sampler2D samplerColor;

uniform float amp;
uniform float deltaBeat;
uniform float velScale;
uniform float accz;

uniform bool init;

bool uvvalid( vec2 v ) { return abs( v.x - 0.5 ) < 0.5 && abs( v.y - 0.5 ) < 0.5; }
mat2 rotate2D( float t ) { return mat2( cos( t ), sin( t ), -sin( t ), cos( t ) ); }
vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

float gray( vec3 c ) {
  return 0.299 * c.x + 0.587 * c.y + 0.114 * c.z;
}

vec3 float2rgb( float _f ) {
  float f = _f + 32768.0;
  return vec3(
    mod( floor( f * 256.0 ), 256.0 ),
    mod( floor( f ), 256.0 ),
    mod( floor( f / 256.0 ), 256.0 )
  ) / 255.0;
}

float rgb2float( vec3 v ) {
  return (
    v.x * 255.0 / 256.0 + v.y * 255.0 + v.z * 255.0 * 256.0
  ) - 32768.0;
}

float hash( float i ) {
  return fract( sin( i * 682.16 ) * 198.45 );
}

vec3 harza3( vec2 v, float s ) {
  vec3 tex = texture2D( samplerRandom, v / samplerRandomReso ).xyz;
  return vec3(
    hash( tex.x + s ),
    hash( tex.y + s ),
    hash( tex.z + s )
  );
}

void main() {
  vec2 p = gl_FragCoord.xy;
  p.x = floor( p.x / pixelsPerParticle ) * pixelsPerParticle + 0.5;
  int dir = int( mod( gl_FragCoord.x, pixelsPerParticle ) );

  vec3 pos = vec3( 0.0 );
  vec3 vel = vec3( 0.0 );
  vec3 col = vec3( 0.0 );
  float life = rgb2float( texture2D( sampler0, ( p + vec2( 7.0, 0.0 ) ) / sampler0Reso ).xyz );

  if ( life <= 0.0 || init ) {
    pos = vec3(
      rgb2float( harza3( p + vec2( 0.0, 0.0 ), time ) ),
      rgb2float( harza3( p + vec2( 1.0, 0.0 ), time ) ),
      0.0
    ) / 65536.0 * 1000.0;

    col = texture2D( samplerColor, img2tex( ( pos.xy * vec2( 1.0, -1.0 ) + SMRES / 2.0 ) / SMRES ) ).xyz;
    
    vel = vec3(
      rgb2float( harza3( p + vec2( 3.0, 0.0 ), time ) ),
      rgb2float( harza3( p + vec2( 4.0, 0.0 ), time ) ),
      rgb2float( harza3( p + vec2( 5.0, 0.0 ), time ) )
    ) / 65536.0 * 10.0;

    if ( col == vec3( 0.0 ) && hash( vel.z ) < 0.01 ) {
      col = vec3( 0.3, 0.4, 0.5 );
      pos.z = rgb2float( harza3( p + vec2( 2.0, 0.0 ), time ) ) / 65536.0 * 1000.0;
      life = 0.5;
    } else if ( init ) {
      life = texture2D( samplerRandom, ( p + vec2( 7.0, 0.0 ) ) / samplerRandomReso ).x;
    } else {
      life = max( col.x, max( col.y, col.z ) );
    }
  } else {
    pos = vec3(
      rgb2float( texture2D( sampler0, ( p + vec2( 0.0, 0.0 ) ) / sampler0Reso ).xyz ),
      rgb2float( texture2D( sampler0, ( p + vec2( 1.0, 0.0 ) ) / sampler0Reso ).xyz ),
      rgb2float( texture2D( sampler0, ( p + vec2( 2.0, 0.0 ) ) / sampler0Reso ).xyz )
    );

    vel = vec3(
      rgb2float( texture2D( sampler0, ( p + vec2( 3.0, 0.0 ) ) / sampler0Reso ).xyz ),
      rgb2float( texture2D( sampler0, ( p + vec2( 4.0, 0.0 ) ) / sampler0Reso ).xyz ),
      rgb2float( texture2D( sampler0, ( p + vec2( 5.0, 0.0 ) ) / sampler0Reso ).xyz )
    );

    col = texture2D( sampler0, ( p + vec2( 6.0, 0.0 ) ) / sampler0Reso ).xyz;
  }

  vec3 acc = ( texture2D( samplerRandom, pos.xy * 0.00001 + 0.5 ).xyz - 0.5 );
  acc.xy = rotate2D( 0.0001 * pos.z + time ) * acc.xy;
  vel += 40.0 * deltaBeat * acc;

  pos += deltaBeat * vel * velScale;
  pos.z -= accz * deltaBeat;
  life = max( 0.0, life - 0.4 * deltaBeat );

  vec3 texPart = (
    dir == 0 ? float2rgb( pos.x ) :
    dir == 1 ? float2rgb( pos.y ) :
    dir == 2 ? float2rgb( pos.z ) :
    dir == 3 ? float2rgb( vel.x ) :
    dir == 4 ? float2rgb( vel.y ) :
    dir == 5 ? float2rgb( vel.z ) :
    dir == 6 ? col :
    float2rgb( life )
  );

  gl_FragColor = vec4( texPart, 1.0 );
}