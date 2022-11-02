#version 120

#define PI 3.14159265

attribute vec4 TextureMatrixScale;

varying vec3 pos;
varying vec3 col;
varying float life;
varying vec3 shape;

uniform mat4 modelMatrix;
uniform vec2 resolution;

uniform float scale;
uniform float rotx;
uniform float roty;

uniform sampler2D sampler0;
uniform vec2 sampler0Reso;

mat2 rotate2D( float t ) { return mat2( cos( t ), sin( t ), -sin( t ), cos( t ) ); }

float rgb2float( vec3 v ) {
  return (
    v.x + v.y * 255.0 + v.z * 256.0 * 255.0
  ) - 32768.0;
}

void main() {
  vec2 p = gl_Vertex.xy;

  pos = vec3(
    rgb2float( texture2D( sampler0, ( p + vec2( 0.0, 0.0 ) ) / sampler0Reso ).xyz ),
    rgb2float( texture2D( sampler0, ( p + vec2( 1.0, 0.0 ) ) / sampler0Reso ).xyz ),
    rgb2float( texture2D( sampler0, ( p + vec2( 2.0, 0.0 ) ) / sampler0Reso ).xyz )
  );
  col = texture2D( sampler0, ( p + vec2( 6.0, 0.0 ) ) / sampler0Reso ).xyz;
  life = rgb2float( texture2D( sampler0, ( p + vec2( 7.0, 0.0 ) ) / sampler0Reso ).xyz );

  pos.zx = rotate2D( roty ) * pos.zx;
  pos.yz = rotate2D( rotx ) * pos.yz;

  vec4 vert = vec4( pos, 1.0 );

  shape = (
    gl_Vertex.z ==  0.0 ? vec3(  0.9, -0.5,  0.0 ) :
    gl_Vertex.z ==  1.0 ? vec3( -0.9, -0.5,  0.0 ) :
                          vec3(  0.0,  1.0,  0.0 )
  );
  vert.xyz += shape * scale * life;

  gl_Position = (gl_ModelViewProjectionMatrix * vert);
}