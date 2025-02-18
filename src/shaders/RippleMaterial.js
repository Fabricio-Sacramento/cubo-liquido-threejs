// src/shaders/RippleMaterial.js
import * as THREE from 'three';

export class RippleMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        // u_mouse: x e y representam posição normalizada; u_mouse.z atua como flag para interação (1 = ativo)
        u_mouse: { value: new THREE.Vector3(0.5, 0.5, 0) },
        // Textura de ruído para eventuais variações no efeito (deve ser carregada externamente)
        u_noise: { value: null },
        // Render target que conterá a cena renderizada (o buffer que o efeito utiliza para distorcer)
        u_buffer: { value: null },
        // Flag para definir se é o render pass do ripple ou não
        u_renderpass: { value: false },
        u_frame: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform vec3 u_mouse;
        uniform float u_time;
        uniform sampler2D u_noise;
        uniform sampler2D u_buffer;
        uniform bool u_renderpass;
        uniform int u_frame;
        varying vec2 vUv;

        #define PI 3.141592653589793
        #define TAU 6.283185307179586
        #define delta 0.005

        // Função simplificada para gerar o efeito de ripple
        vec4 renderRipples() {
          // Calcula as coordenadas normalizadas
          vec2 uv = gl_FragCoord.xy / u_resolution;
          // Gera uma ondulação simples com base na soma das coordenadas e no tempo
          float ripple = sin((uv.x + uv.y) * 20.0 + u_time * 5.0) * 0.03;
          // Aplica a distorção ao UV e recupera a cor do buffer
          vec4 color = texture2D(u_buffer, uv + ripple);
          return color;
        }

        void main() {
          vec4 fragColor;
          if(u_renderpass) {
            // Se for o render pass do efeito, aplica o ripple
            fragColor = renderRipples();
          } else {
            // Caso contrário, simplesmente passa a cor original do buffer
            fragColor = texture2D(u_buffer, vUv);
          }
          gl_FragColor = fragColor;
        }
      `,
      extensions: {
        derivatives: true,
      }
    });
  }
}
