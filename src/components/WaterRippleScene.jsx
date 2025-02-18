// src/components/WaterRippleScene.jsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WaveSimulationPass } from '../shaders/WaveSimulationPass';
import { WaterRenderPass } from '../shaders/WaterRenderPass';

export default function WaterRippleScene() {
  const { gl, size, clock } = useThree();

  // Referências para os passes
  const simulationPassRef = useRef(null);
  const renderPassRef = useRef(null);

  // Criação dos 3 render targets
  const waveRT1Ref = useRef();
  const waveRT2Ref = useRef();
  const waveRT3Ref = useRef();

  // Carregamos a textura de fundo (por exemplo, uma imagem de água)
  const backgroundTexture = new THREE.TextureLoader().load('/textures/water_background.jpg');
  backgroundTexture.minFilter = THREE.LinearFilter;

  // Inicializa e configura os 3 render targets
  useEffect(() => {
    waveRT1Ref.current = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false
    });

    waveRT2Ref.current = waveRT1Ref.current.clone();
    waveRT3Ref.current = waveRT1Ref.current.clone();

    // Cria o WaveSimulationPass
    simulationPassRef.current = new WaveSimulationPass(size.width, size.height);
    simulationPassRef.current.material.uniforms.uTexelSize.value.set(1 / size.width, 1 / size.height);

    // Cria o WaterRenderPass
    renderPassRef.current = new WaterRenderPass();
    renderPassRef.current.material.uniforms.uBackground.value = backgroundTexture;
    renderPassRef.current.material.uniforms.uTexelSize.value.set(1 / size.width, 1 / size.height);

  }, [size, backgroundTexture]);

  // Função para capturar o mouse e injetar perturbações
  const handlePointerMove = (event) => {
    const x = event.clientX / size.width;
    const y = 1 - (event.clientY / size.height);

    if (simulationPassRef.current) {
      simulationPassRef.current.material.uniforms.uMouse.value.set(x, y);
    }
  };

  // Adiciona o listener de mouse
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [size]);

  // Loop de animação
  useFrame(() => {
    if (!simulationPassRef.current || !renderPassRef.current) return;

    const delta = clock.getDelta();
    const simMat = simulationPassRef.current.material;

    // Ajusta o delta time no shader
    simMat.uniforms.uDelta.value = delta;

    // waveRT1 = estado atual, waveRT2 = estado anterior
    // waveRT3 = será o buffer de saída
    const rt1 = waveRT1Ref.current;
    const rt2 = waveRT2Ref.current;
    const rt3 = waveRT3Ref.current;

    // 1) Simulação: lê (uCurrent = rt1, uPrevious = rt2) e escreve em rt3
    simMat.uniforms.uCurrent.value = rt1.texture;
    simMat.uniforms.uPrevious.value = rt2.texture;
    simulationPassRef.current.render(gl, null, rt3);

    // 2) Faz swap:
    //    rt2 = rt1 (o atual vira o anterior)
    //    rt1 = rt3 (o novo vira o atual)
    //    rt3 = rt2 (sobrou no "temp"? Precisamos armazenar em algo para não perder)
    waveRT2Ref.current = rt1;
    waveRT1Ref.current = rt3;
    waveRT3Ref.current = rt2;

    // 3) Render final: distorce usando waveRT1 como height map
    renderPassRef.current.material.uniforms.uHeightMap.value = waveRT1Ref.current.texture;
    gl.setRenderTarget(null);
    gl.clear();
    renderPassRef.current.render(gl, null, null);

  }, 1);

  return null;
}
