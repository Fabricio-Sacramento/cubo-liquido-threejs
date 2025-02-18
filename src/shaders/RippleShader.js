// src/shaders/RippleShader.js
import * as THREE from 'three';

export const RippleShader = {
  uniforms: {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    // Você pode adicionar outros uniformes, como intensidade, se necessário
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 vUv;
    
    // Exemplo simples de ripple: distorce o UV com uma função senoidal
    void main() {
      vec2 uv = vUv;
      
      // Cria um efeito ripple baseado no tempo e na distância do mouse
      float dist = distance(uv, u_mouse / u_resolution);
      float ripple = sin((dist - u_time * 2.0) * 30.0) * 0.005;
      
      uv.y += ripple;
      
      // Para efeito de demonstração, usamos uma cor baseada no UV
      vec3 color = vec3(uv, 0.5 + 0.5 * sin(u_time));
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
