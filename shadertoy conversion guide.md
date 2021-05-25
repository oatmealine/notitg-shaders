# shadertoy to standard glsl/nitg conversion guide
*made by jill/oatmealine#1704*

## can i convert this shader?

the anwser is most likely yes! however:

* if the shader is multipass, you'll need general glsl knowledge. this guide is more aimed towards people who don't know glsl or shadertoy quirks
* if the shader uses audio, then it's likely unconvertable. keep in mind nitg shaders cant output audio, only video
  * shadertoy has audio shaders which produce just audio, and no video! those definetly wont work
* if the shader runs at a low fps on the site, then chances are it'll run about as well on NITG, so don't bother converting heavy shaders
* you'll likely need extra help if you want to use said shader as a filter, especially ones where you want to control the filter

## basic conversion

add this to the end of the shader:

```glsl
void main() {
	mainImage(gl_FragColor.rgba, gl_FragCoord.xy);
}
```

if needed, also add

```glsl
#VERSION 200
```

to the start of the shader

**HOWEVER!** do know this'll cause issues with backwards compatability, so try to decrease `200` as far down to `100` as possible with trial and error

## uniform values & iValues

if the shader uses values such as `iTime`, `iResolution` or `iMouse`, you will need to change them to something else. here are some common ways to convert them:

### iResolution

*The viewport resolution (z is pixel aspect ratio, usually 1.0)*

`iResolution` can be replaced with `imageSize`, as long as you add the following uniform value:

```glsl
uniform vec2 imageSize;
```

do note! this sometimes won't work as `iResolution` is a vec3, and you'll have to use `vec3(imageSize, 1.0)` instead

### iTime

*Current time in seconds*

`iTime` can be safely replaced with `time`, as long as you add the following uniform value:

```glsl
uniform float time;
```

dont worry, nitg will provide the time value for you

### iTimeDelta

*Time it takes to render a frame, in seconds*

`iTimeDelta` is the [deltatime](https://en.wikipedia.org/wiki/Delta_timing) between the last frame and the current one. i'm pretty sure nitg doesn't provide anything like this, so you'll have to manually provide this, however it should be semi-safe to just set it to `0.0`:

```glsl
const float iTimeDelta = 0.0;
```

if that doesnt work, try `0.00000001`, but it's likely not going to help

### iFrame

*Current frame*

`iFrame` can be safely replaced with `frame`, as long as you add the following uniform value:

```glsl
uniform float frame;
```

and then in nitg, run

```lua
shader:uniform1f('frame', frame)
```

every frame

note: nitg may provide the frame uniform by itself, but i'm not sure

### iFrameRate

*Number of frames rendered per second*

i dont actually know any shaders that use iFrameRate, but you can probably just set it to 60

### iFrameRate

*Number of frames rendered per second*

i dont actually know any shaders that use iFrameRate, but you can probably just set it to 60

### iMouse

*xy = current pixel coords (if LMB is down). zw = click pixel*

not really much you can do with iMouse, other than either set it to a constant value or use it as a uniform value

#### constant value

add this to the top of the file:

```glsl
const vec4 iMouse = vec3(0.0, 0.0, 0.0, 0.0);
```

#### uniform value

add this to the top of the file:

```glsl
uniform vec4 iMouse;
```

then, in your modfile, use:

```lua
shader:uniform4f('iMouse', x, y, z, w)
```

`x` and `y` are the mouse's x and y coordinates, ranging from 0.0 to 1.0, and `z` and `w` are the click pixel

play around with the shader on the site and find values you're most comfortable with

### iChannel{i}
*Sampler for input textures i*

channels/samplers are where things get messy so buckle up

if you see only one `iChannel` (so `iChannel0` only, without `iChannel1` or whatever), it's easy enough:

1. switch all instances of `iChannel0` to `sampler0`, and add a uniform value:

```glsl
uniform sampler2D sampler0;
```

2. switch `texture(` to `texture2D(`, and wrap the second atgument in functions with `img2tex()`. tldr: all code that looks like this:

```glsl
texture(iChannel0, uv);
```
must be changed to this:

```glsl
texture2D(sampler0, img2tex(uv));
```

3. add this function near your `mainImage` function, preferably above:

```glsl
vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }
```

4. also add the uniform values `imageSize` and `textureSize`:

```glsl
uniform vec2 textureSize;
uniform vec2 imageSize;
```

if theres more than one `iChannel` you can always try just adding more uniform values and replacing them, but it's not guaranteed that'll work as that usually means they use some outside image as one of the samplers

take this shader, for example: https://www.shadertoy.com/view/XtSGRG

it uses two `iChannel`s, one as the noise texture and the other as the input glitching texture (aka the webcam)

changing all `iChannel`s to just `sampler`s wont do, so you'll have to download the first channel's texture image, save it somewhere in your modfile, then change said sampler's variable name to something like `noiseSampler`, make it a uniform value (`uniform sampler2D noiseSampler`), and then in the modfile pass along the texture of a sprite that uses the texture:
```lua
shader:uniformTexture('noiseSampler', sprite:GetTexture())
```

**do note!**: if you want noise, NITG passes along a uniform value called `samplerRandom` so you dont need to pass along any uniform value:
```glsl
uniform sampler2D samplerRandom;
```

### iDate
*Year, month, day, time in seconds in .xyzw*

`iDate` is a vec3 consisting of the pc's date. i havent seen this used anywhere, but it should be safe to just

```glsl
const vec4 iDate = vec4(0.0);
```

### iSampleRate
*The sound sample rate (typically 44100)*

this is an audio shader value. what are you doing. stop

### iChannelTime[4]
*Time for channel (if video or sound), in seconds*

### iChannelResolution[4]
*Input texture resolution for each channel*

if these values are used, you can pretty much give up

keep in mind both of these are arrays, which is basically impossible to pass along as a uniform value
