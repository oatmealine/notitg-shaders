#version 120

// took the common heat.frag and integrated simplex noise into it
// now it looks better -oat

uniform float tx,ty,yo;

varying vec2 textureCoord;
varying vec4 color;
uniform sampler2D sampler0;

vec2 hash( vec2 p ) // replace this by something better
{
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2  i = floor( p + (p.x+p.y)*K1 );
  vec2  a = p - i + (i.x+i.y)*K2;
  float m = step(a.y,a.x); 
  vec2  o = vec2(m,1.0-m);
  vec2  b = a - o + K2;
	vec2  c = a - 1.0 + 2.0*K2;
  vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3  n = h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
  return dot( n, vec3(70.0) );
}

vec2 SineWave(vec2 p) {
  // wave distortion
  float x = noise(vec2(p.x, p.y) * 30.5 + tx) * 0.05 * yo;
  float y = noise(vec2(-p.y, p.x) * 29.3 - ty) * 0.05 * yo;
  return vec2(p.x+x, p.y+y);
}

void main() {
  vec4 col = texture2D(sampler0, SineWave(textureCoord));

  gl_FragColor = col * color;
}
