// src/components/PostProcessingPipeline.jsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, RenderPass } from '@react-three/postprocessing';
import { RipplePass } from '../shaders/RipplePass';

const PostProcessingPipeline = () => {
  const { gl, scene, camera, size, clock } = useThree();
  const composerRef = useRef();
  // Cria uma instância do RipplePass
  const ripplePassRef = useRef(new RipplePass());

  // Atualiza o tamanho do EffectComposer quando o viewport mudar
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size]);

  // Atualiza o tempo (u_time) do RipplePass a cada frame para animar o efeito
  useFrame(() => {
    const t = clock.getElapsedTime();
    ripplePassRef.current.material.uniforms.u_time.value = t;
  });

  return (
    <EffectComposer ref={composerRef} args={[gl]}>
      {/* RenderPass: Renderiza a cena com a câmera */}
      <RenderPass attachArray="passes" scene={scene} camera={camera} />
      {/* RipplePass: Aplica o efeito de ripple por cima da cena renderizada */}
      <primitive object={ripplePassRef.current} attachArray="passes" />
    </EffectComposer>
  );
};

export default PostProcessingPipeline;
