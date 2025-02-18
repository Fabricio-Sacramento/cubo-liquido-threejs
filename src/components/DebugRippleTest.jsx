import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RippleMaterial } from '../shaders/RippleMaterial';

const DebugRipplePlane = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  // Cria uma textura chapada branca (pode trocar a cor)
  const solidTexture = createSolidTexture('#88c', 2, 2);

  useEffect(() => {
    if (materialRef.current) {
      // Se quiser ainda usar ruído em escala de cinza, carregue e atribua:
      // materialRef.current.uniforms.u_noise.value = grayscaleNoiseTexture;
      materialRef.current.uniforms.u_buffer.value = solidTexture;
      materialRef.current.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      materialRef.current.uniforms.u_renderpass.value = true;
    }
  }, [solidTexture]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const t = clock.getElapsedTime();
      materialRef.current.uniforms.u_time.value = t;
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 2]}>
      <planeGeometry args={[2, 2]} />
      <primitive object={new RippleMaterial()} ref={materialRef} attach="material" />
    </mesh>
  );
};

const DebugRippleTest = () => {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <color attach="background" args={['#000000']} />
      <DebugRipplePlane />
    </Canvas>
  );
};

export default DebugRippleTest;

// Função auxiliar para criar a textura chapada:
function createSolidTexture(color = '#ffffff', width = 2, height = 2) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
