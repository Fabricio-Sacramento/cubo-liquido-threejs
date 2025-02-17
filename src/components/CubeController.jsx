// src/components/CubeController.jsx
import { useRef } from "react";
import PropTypes from "prop-types";
import GlassCube from "./GlassCube";

const CubeController = ({ transformRef }) => {
  // Apenas renderiza o GlassCube; a rotação será controlada externamente
  const localRef = useRef();
  const groupRef = transformRef || localRef;

  return (
    <group ref={groupRef}>
      <GlassCube />
    </group>
  );
};

CubeController.propTypes = {
  transformRef: PropTypes.shape({
    current: PropTypes.any,
  }),
};

export default CubeController;
