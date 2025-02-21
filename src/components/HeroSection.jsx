import { Html } from "@react-three/drei";
import WorldCanvas from "./WorldCanvas";
import "../styles/style.css";
import "../styles/HeroSection.module.css";

export default function HeroSection() {
  return (
    <group>
      {/* Renderiza o cenário de fundo */}
      <WorldCanvas />
      {/* Usa o componente Html para embutir o conteúdo HTML no Canvas */}
      <Html
        //position={[0, -0.1, 0]}
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          //alignItems: "center",
          //justifyContent: "flex-start",
        }}
        transform
        distanceFactor={1}
      >
        <div className="text-column">
          <h2 className="heading-small">DESIGNING</h2>
          <h2 className="heading-large">BRANDS</h2>
          <h2 className="heading-large">PRODUCTS</h2>
          <h2 className="heading-large">EXPERIENCES</h2>
        </div>
      </Html>
    </group>
  );
}
