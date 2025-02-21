// src/App.jsx
import { useState, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import AboutUsWrapper from './components/AboutUsWrapper';
import WhatWeDo from './components/WhatWeDo';
import Work from './components/Work';
import Statement from './components/Statement';
import Clients from './components/Clients';
import Contact from './components/Contact';
import TransitionOverlay from './components/TransitionOverlay';
import useScrollProgress from './hooks/useScrollProgress';

function App() {
  // Define os pontos de início e fim para a transição
  const transitionStart = 0;
  const transitionEnd = window.innerHeight;
  const progress = useScrollProgress(transitionStart, transitionEnd);

  // Estado para controlar se o canvas 3D deve estar ativo
  const [canvasActive, setCanvasActive] = useState(true);

  // Callback para desativar o HeroSection quando AboutUs for revelado
  const handleAboutVisibilityChange = useCallback((isVisible) => {
    setCanvasActive(!isVisible);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="hero">
        <HeroSection canvasActive={canvasActive} />
      </section>

      {/* Transição visual das colunas */}
      <TransitionOverlay progress={progress} />

      {/* Seção AboutUs (monitora visibilidade para desligar o HeroSection) */}
      <AboutUsWrapper onVisibilityChange={handleAboutVisibilityChange} />

      {/* Restante das seções do site */}
      <section id="what-we-do">
        <WhatWeDo />
      </section>

      <section id="work">
        <Work />
      </section>

      <section id="statement">
        <Statement />
      </section>

      <section id="clients">
        <Clients />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
}

export default App;
