// src/components/RippleEffect.jsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RipplePass } from '../shaders/RipplePass';

const RippleEffect = () => {
  // Referência para o EffectComposer e para o RipplePass
  const composerRef = useRef();
  const ripplePassRef = useRef(new RipplePass());
  
  // Acesso às propriedades do renderer, tamanho da tela e clock
  const { gl, size, clock } = useThree();

  // Carrega a textura de ruído necessária para o efeito ripple
  // Certifique-se de que o arquivo '/textures/noise.png' esteja disponível no seu projeto
  const noiseTexture = useLoader(THREE.TextureLoader, '/textures/noise.png');

  // No useEffect, após a textura ser carregada e quando as dimensões mudam,
  // atribuímos a textura de ruído e configuramos a resolução do shader.
  useEffect(() => {
    const material = ripplePassRef.current.material;
    material.uniforms.u_noise.value = noiseTexture;
    // Atualiza a resolução com as dimensões atuais do canvas
    material.uniforms.u_resolution.value.set(size.width, size.height);
  }, [noiseTexture, size]);

  // Sempre que o tamanho do canvas mudar, atualizamos o composer para manter a renderização correta
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size]);

  // No loop de animação, atualizamos o tempo (u_time) para animar o efeito ripple.
  // Se desejar incluir outras atualizações (como u_mouse, se interativo), faça aqui.
  useFrame(() => {
    const t = clock.getElapsedTime();
    ripplePassRef.current.material.uniforms.u_time.value = t;
  });

  return (
    // O EffectComposer recebe o renderer e aplica o RipplePass como um post-processamento
    <EffectComposer ref={composerRef} args={[gl]}>
      <primitive object={ripplePassRef.current} attachArray="passes" />
    </EffectComposer>
  );
};

export default RippleEffect;
