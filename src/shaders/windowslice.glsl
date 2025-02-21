uniform float progress;
uniform float count;
uniform float smoothness;
uniform sampler2D from;
uniform sampler2D to;
varying vec2 vUv;

void main() {
  float pr = smoothstep(-smoothness, 0.0, vUv.x - progress * (1.0 + smoothness));
  float s = step(pr, fract(count * vUv.x));
  vec4 fromColor = texture2D(from, vUv);
  vec4 toColor = texture2D(to, vUv);
  gl_FragColor = mix(fromColor, toColor, s);
}
