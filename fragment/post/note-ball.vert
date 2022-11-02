#version 120

#define PI 3.14159265
#define RECEPTOR_Y 115.0

varying vec3 normal;
varying vec4 color;
varying vec2 textureCoord;

varying float vSphereY;

uniform vec2 resolution;

uniform float time;
uniform bool isHold;
uniform int iCol;
uniform int iPlayfield;

uniform float phaseSpin;
uniform float phaseColumn;
uniform float amp;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

mat2 rotate2D( float t ) { return mat2( cos( t ), sin( t ), -sin( t ), cos( t ) ); }

void main() {
  gl_TexCoord[0] = gl_TextureMatrix[0] * gl_MultiTexCoord0;
  textureCoord = gl_TexCoord[0].xy;

  mat4 mat = modelMatrix; // get model matrix (contains translate, rotate, scale and skew)
  vec4 vert = mat * vec4( gl_Vertex.xyz, 1.0 ); // get vertex data and apply the matrix

  mat4 matT = mat;
  matT[ 3 ] = vec4( 0.0, 0.0, 0.0, 1.0 ); // kills the translation
  vec4 vertT = mat * vec4( gl_Vertex.xyz, 1.0 ); // translate-killed vertices

  float posY = 0.0;
  if ( isHold ) { posY = vert.y; }
  else { posY = modelMatrix[ 3 ].y; }

  // ------

  // center position of rotation
  vec3 center = vec3(
    resolution.x / 4.0 * ( 2.0 * float( iPlayfield ) + 1.0 ),
    resolution.y / 2.0,
    0.0
  );

  // rotation theta for each column
  float theta = PI * (
    iCol == 0 ? -0.5 :
    iCol == 1 ?  1.0 :
    iCol == 2 ?  0.0 :
                 0.5
  );

  vert.xyz -= center.xyz;

  float sphereR = resolution.y / 2.0 - RECEPTOR_Y;
  float sphereY = abs( posY - resolution.y / 2.0 ) / sphereR;
  vSphereY = sphereY;
  vert.z += (
    sphereY < 1.0
    ? sphereR * sqrt( 1.0 - sphereY * sphereY ) * phaseColumn
    : 0.0
  );

  vert.zx = rotate2D( theta * phaseColumn + 0.1 * ( posY - RECEPTOR_Y ) * phaseColumn ) * vert.zx;
  vert.xy = rotate2D( phaseSpin ) * vert.xy;
  vert.yz = rotate2D( -PI * 2.0 * phaseSpin ) * vert.yz;
  vert.xy = rotate2D( -phaseSpin ) * vert.xy;

  vert.xyz += center.xyz;

  // -------

  center.x = resolution.x / 2.0;

  vert.xyz -= center.xyz;

  vert.yz = rotate2D( 3.0 * phaseSpin ) * vert.yz;
  vert.zx = rotate2D( PI * 4.0 * phaseSpin ) * vert.zx;
  vert.yz = rotate2D( -3.0 * phaseSpin ) * vert.yz;

  vert.xyz += center.xyz;

  vert.z -= 300.0 * sin( PI * phaseSpin );

  // ------

  gl_Position = projectionMatrix * viewMatrix * vert;

  gl_FrontColor = gl_Color;
  color = gl_Color;
}