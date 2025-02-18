// src/components/WaterRippleEffect.jsx
import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from '@react-three/postprocessing';
import { WaveSimulationPass } from '../shaders/WaveSimulationPass';
import { WaterRenderPass } from '../shaders/WaterRenderPass';

extend({ EffectComposer });

const WaterRippleEffect = () => {
  const { gl, size, clock } = useThree();
  const composerRef = useRef();
  const simulationPassRef = useRef();
  const renderPassRef = useRef();

  // Criação dos render targets para simulação (ping-pong)
  const [waveRT1] = useState(() =>
    new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    })
  );
  const [waveRT2] = useState(() => waveRT1.clone());
  const [currentRT, setCurrentRT] = useState(waveRT1);
  const [previousRT, setPreviousRT] = useState(waveRT2);

  // Criação de uma textura de fundo (por exemplo, azul-claro para simular água)
  const backgroundTexture = new THREE.TextureLoader().load('/textures/water_background.jpg');
  backgroundTexture.minFilter = THREE.LinearFilter;

  // Inicializa o simulation pass com o tamanho atual
  useEffect(() => {
    simulationPassRef.current = new WaveSimulationPass(size.width, size.height);
    // Configura o material com os render targets que serão atualizados a cada frame
    simulationPassRef.current.material.uniforms.uTexelSize.value.set(1 / size.width, 1 / size.height);
  }, [size]);

  // Configura o render pass (para renderizar a superfície final)
  useEffect(() => {
    renderPassRef.current = new WaterRenderPass();
    renderPassRef.current.material.uniforms.uBackground.value = backgroundTexture;
    renderPassRef.current.material.uniforms.uTexelSize.value.set(1 / size.width, 1 / size.height);
  }, [size, backgroundTexture]);

  // Captura a posição do mouse e converte para coordenadas UV [0..1]
  const onPointerMove = (event) => {
    const x = event.clientX / size.width;
    const y = 1 - event.clientY / size.height;
    // Atualiza a perturbação no shader de simulação
    if (simulationPassRef.current) {
      simulationPassRef.current.material.uniforms.uMouse.value.set(x, y);
    }
  };

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [size]);

  // Loop de animação: atualiza a simulação e faz o ping-pong dos render targets
  useFrame(() => {
    const delta = clock.getDelta();
    // Atualiza o uniform de tempo no simulation pass (se necessário)
    simulationPassRef.current.material.uniforms.uDelta.value = delta;

    // Renderiza o simulation pass: usa previousRT e currentRT para calcular o novo estado
    simulationPassRef.current.material.uniforms.uCurrent.value = currentRT.texture;
    simulationPassRef.current.material.uniforms.uPrevious.value = previousRT.texture;
    // Render simulation into a temporary render target (aqui, reutilizamos previousRT como saída)
    simulationPassRef.current.render(gl, null, previousRT, delta);

    // Inverte os render targets para o próximo frame (ping-pong)
    setCurrentRT(previousRT);
    setPreviousRT(currentRT);

    // Por fim, renderiza o WaterRenderPass utilizando o height map (currentRT)
    if (composerRef.current) {
      // Atualiza o compositor para usar a textura resultante da simulação
      composerRef.current.render(delta);
    }
  }, 1);

  return (
    <EffectComposer ref={composerRef} args={[gl]}>
      {/*
        Primeiro, o simulation pass é executado fora do composer tradicional.
        Depois, adicionamos o render pass que utiliza o resultado da simulação.
        Para simplificar, aqui usamos apenas o WaterRenderPass como o último passo,
        pois o simulation foi feita manualmente no useFrame.
      */}
      <primitive object={renderPassRef.current} attachArray="passes" />
    </EffectComposer>
  );
};

export default WaterRippleEffect;
