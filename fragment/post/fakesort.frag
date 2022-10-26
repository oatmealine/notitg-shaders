// https://www.shadertoy.com/view/wljyRz
// modified by oat to be more Funky; pixelation included

#version 120

uniform float a; // strength [0.0 : 1.0]

uniform float time;
uniform sampler2D sampler0;
uniform vec2 imageSize;
uniform vec2 textureSize;

varying vec2 textureCoord;

#define MAX_OFFSET 80.

float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }

vec2 img2tex(vec2 v) {
	return v / textureSize * imageSize;
}

void main() {
  vec2 uv = gl_FragCoord.xy / imageSize.xy;
  vec2 texel = 1. / imageSize.xy;

  vec4 img = texture2D(sampler0, textureCoord);

  float pixSize = imageSize.x / (5.0 * a);
  float x = floor(uv.x * pixSize) / pixSize;

  float step_y = texel.y*(rand(x)*MAX_OFFSET) * a;	// modulate offset
  step_y += rand(x*uv.y*time)*0.025*1.0;								// shake offset and modulate it
  step_y = mix(step_y, step_y*rand(x*time)*0.5, 1.0); 					// more noisy spikes

  if ( dot(img,  vec4(0.299, 0.587, 0.114, 0.) ) > 1.2*a ) {
    uv.y+=step_y;
  } else{
    uv.y-=step_y;
  }

  gl_FragColor = texture2D(sampler0, img2tex(clamp(uv, 0.0, 1.0)));
}
