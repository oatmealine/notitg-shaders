#version 120

// forces every color to the closest color in a specified palette
// palette size should probably be kept to 16; the higher the size,
// the laggier the shader will become
// -oat

varying vec2 textureCoord;
varying vec4 color;
uniform sampler2D sampler0;

#define RGB(r,g,b) (vec3(r,g,b) / 255.0)

// see https://oat.zone/palette
#define PALETTE_SIZE 16
vec3 colors[PALETTE_SIZE] = vec3[](
  RGB(77,  0,   76 ),
  RGB(143, 0,   118),
  RGB(199, 0,   131),
  RGB(245, 0,   120),
  RGB(255, 71,  100),
  RGB(255, 147, 147),
  RGB(255, 213, 204),
  RGB(255, 243, 240),
  RGB(0,   7,   40 ),
  RGB(0,   80,  96 ),
  RGB(0,   187, 255),
  RGB(7,   94,  0  ),
  RGB(80,  199, 0  ),
  RGB(136, 230, 86 ),
  RGB(70, 20, 50),
  RGB(145, 70, 100)
);

vec3 getPalette(vec3 col) {
  // comparasion
  float minDist = 9e9;
  vec3 newCol;

  for (int i = 0; i < PALETTE_SIZE; i++) {
    vec3 compareCol = colors[i];

    vec3 distVec = abs(col - compareCol);
    float dist = (distVec.r + distVec.g + distVec.b) / 3.0;

    if (dist < minDist) {
      newCol = compareCol;
      minDist = dist;
    }
  }

  return newCol;
}

void main() {
  vec4 col = texture2D(sampler0, textureCoord);
  gl_FragColor = vec4(getPalette(col.rgb), col.a) * color;
}
