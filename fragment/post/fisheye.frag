// applies a fisheye effect (or antifisheye effect)
// source unknown

uniform float amount; // the strength of the fisheye effect [-1.0 : 1.0]

varying vec4 color;
varying vec2 imageCoord;
uniform vec2 resolution;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform sampler2D sampler0;

vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

void main()
{
	vec2 uv = imageCoord;
	uv -= 0.5;
	uv *= 1.0 - amount / 2.0;

	float r = sqrt(dot(uv,uv));
	uv *= 1.0 + r * amount;
	uv += 0.5;

	vec2 res = resolution;
	uv = clamp( uv, 1.0 / res, (res - 1.0) / res );

	vec3 col = texture2D( sampler0, img2tex(uv) ).rgb;

	gl_FragColor = vec4( col, 1.0 ) * color;
}
