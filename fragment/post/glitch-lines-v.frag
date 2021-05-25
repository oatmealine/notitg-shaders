// glitch shader
// original creator nayoto, modified to add verticality by oat
// for original shader see glitch-lines.frag
// first seen in rya and oat's tung tiied

#version 120

uniform float amount; // strength [-1 : 1]
uniform float amounty; // strength, on the y axis [-1 : 1]
uniform vec2 shift; // shift the rgb channels by this much ([-1 : 1], [-1 : 1])

varying vec4 color;
varying vec2 imageCoord;

uniform float time;
uniform vec2 resolution;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform sampler2D sampler0;

float rand( vec2 co )
{
	return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 img2tex( vec2 v )
{
	return v / textureSize * imageSize;
}

void main()
{
	vec2 uv = imageCoord;
	vec2 uvn = uv;

	uv.x += rand( vec2(uvn.y / 10.0, time / 10.0) ) * amount;
	uv.x -= rand( vec2(uvn.y * 10.0, time * 10.0) ) * amount;

	uv.y += rand( vec2(uvn.x / 10.0, time / 10.0) ) * amounty;
	uv.y -= rand( vec2(uvn.x * 10.0, time * 10.0) ) * amounty;


	vec3 col;
	col.rg = texture2D( sampler0, img2tex(mod(uv + shift / resolution, 1.0)) ).rg;
	col.gb = texture2D( sampler0, img2tex(mod(uv - shift / resolution, 1.0)) ).gb;

	gl_FragColor = vec4( col, 1.0 ) * color;
}
