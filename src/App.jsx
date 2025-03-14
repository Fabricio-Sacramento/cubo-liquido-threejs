// src/App.jsx
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Glass from "./components/Glass";
import DynamicBackground from "./components/DynamicBackground";
import GlassCube from "./components/GlassCube";
import ConceptualCore from "./components/ConceptualCore";
import TransitionOverlay from "./components/TransitionOverlay";
import "./styles/style.css";

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  const handleTransitionComplete = () => {
    setShowOverlay(false); // Remove o overlay quando a animação terminar
  };

  return (
    <div>
      {/* Seção Hero com o Canvas 3D */}
      <section id="hero" style={{ height: "100vh", position: "relative" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
          <DynamicBackground />
          <Glass />
          <GlassCube />
          <ConceptualCore />
        </Canvas>
      </section>

      {/* Seção About Us */}
      <section id="about-us" style={{ height: "100vh", background: "#333" }}>
        <h1 style={{ color: "#FFF", textAlign: "center", paddingTop: "40vh" }}>
          About Us
        </h1>
      </section>

      {/* Overlay de Transição controlado pelo ScrollTrigger */}
      {showOverlay && <TransitionOverlay onComplete={handleTransitionComplete} />}
    </div>
  );
};

export default App;
