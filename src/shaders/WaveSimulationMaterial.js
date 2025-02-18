// src/shaders/WaveSimulationMaterial.js
import * as THREE from 'three';

export class WaveSimulationMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uCurrent: { value: null },
        uPrevious: { value: null },
        uTexelSize: { value: new THREE.Vector2(1 / 512, 1 / 512) },
        uDelta: { value: 1.0 / 60.0 },
        uSpeed: { value: 1.0 },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uRadius: { value: 0.03 },
        uAmplitude: { value: 0.5 }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uCurrent;
        uniform sampler2D uPrevious;
        uniform vec2 uTexelSize;
        uniform float uDelta;
        uniform float uSpeed;
        uniform vec2 uMouse;
        uniform float uRadius;
        uniform float uAmplitude;

        void main() {
          vec2 uv = gl_FragCoord.xy * uTexelSize;

          // Lê valores da textura atual
          float center = texture2D(uCurrent, uv).r;
          float up = texture2D(uCurrent, uv + vec2(0.0, uTexelSize.y)).r;
          float down = texture2D(uCurrent, uv - vec2(0.0, uTexelSize.y)).r;
          float left = texture2D(uCurrent, uv - vec2(uTexelSize.x, 0.0)).r;
          float right = texture2D(uCurrent, uv + vec2(uTexelSize.x, 0.0)).r;

          float laplacian = (up + down + left + right - 4.0 * center);
          float prev = texture2D(uPrevious, uv).r;

          // Equação de onda
          float newVal = 2.0 * center - prev + (uSpeed * uSpeed) * (uDelta * uDelta) * laplacian;

          // Injeção de perturbação no local do mouse
          float distToMouse = distance(uv, uMouse);
          if (distToMouse < uRadius) {
            float falloff = 1.0 - (distToMouse / uRadius);
            newVal += falloff * uAmplitude;
          }

          gl_FragColor = vec4(newVal, 0.0, 0.0, 1.0);
        }
      `
    });
  }
}
