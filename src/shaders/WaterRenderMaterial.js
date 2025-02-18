// src/shaders/WaterRenderMaterial.js
import * as THREE from 'three';

export class WaterRenderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uHeightMap: { value: null },
        uBackground: { value: null },
        uTexelSize: { value: new THREE.Vector2(1 / 512, 1 / 512) },
        uDistortionFactor: { value: 0.03 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uHeightMap;
        uniform sampler2D uBackground;
        uniform vec2 uTexelSize;
        uniform float uDistortionFactor;
        varying vec2 vUv;

        void main() {
          float h = texture2D(uHeightMap, vUv).r;
          // Desloca UV baseado na altura
          vec2 distortedUV = vUv + vec2(h, h) * uDistortionFactor;
          vec4 bgColor = texture2D(uBackground, distortedUV);
          gl_FragColor = bgColor;
        }
      `
    });
  }
}
