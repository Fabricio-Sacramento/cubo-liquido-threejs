import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import WhatWeDo from "./components/WhatWeDo";
import Work from "./components/Work";
import Statement from "./components/Statement";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import TransitionEffect from "./components/TransitionEffect";
import useThrottle from "./hooks/useThrottle";

export default function App() {
  const [transitioning, setTransitioning] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);

  // Lista de seções (componentes 3D)
  const sections = [
    HeroSection,
    AboutUs,
    WhatWeDo,
    Work,
    Statement,
    Clients,
    Contact,
  ];

  // Render targets para capturar as cenas
  const fboFrom = useRef(
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
  );
  const fboTo = useRef(
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
  );

  // Atualiza os render targets ao redimensionar a janela
  useEffect(() => {
    const updateSize = () => {
      fboFrom.current.setSize(window.innerWidth, window.innerHeight);
      fboTo.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Quando a transição completa, altera para a próxima seção
  const onComplete = useCallback(() => {
    setTransitioning(false);
    setCurrentSection((prev) => (prev + 1) % sections.length);
  }, [sections.length]);

  // Evento de scroll com throttle para disparar a transição
  const handleScroll = useThrottle((event) => {
    if (!transitioning) {
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextSection = currentSection + direction;
      if (nextSection >= 0 && nextSection < sections.length) {
        setTransitioning(true);
        setProgress(0);
      }
    }
  }, 500);

  // Atualiza o progress da transição até 1
  useEffect(() => {
    let frame;
    if (transitioning) {
      const animate = () => {
        setProgress((prev) => {
          const next = prev + 0.02;
          return next >= 1 ? 1 : next;
        });
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frame);
  }, [transitioning]);

  const CurrentSection = sections[currentSection];
  const NextSection = sections[currentSection + 1];

  return (
    <div onWheel={handleScroll} style={{ width: "100vw", height: "100vh" }}>
      {/* Um único Canvas para evitar problemas com múltiplos contexts */}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        {/* Renderiza a seção atual */}
        <CurrentSection renderTarget={fboFrom.current} />
        {/* Se estiver em transição, renderiza a próxima seção */}
        {transitioning && NextSection && (
          <NextSection renderTarget={fboTo.current} />
        )}
        {/* Exibe o efeito de transição */}
        {transitioning && (
          <TransitionEffect
            progress={progress}
            fromTexture={fboFrom.current.texture}
            toTexture={fboTo.current.texture}
            onComplete={onComplete}
          />
        )}
      </Canvas>
    </div>
  );
}
