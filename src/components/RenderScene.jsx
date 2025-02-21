import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import PropTypes from "prop-types";
import TransitionEffect from "./TransitionEffect";

export default function RenderScene({ 
  currentSection: Current, 
  nextSection: Next, 
  transitioning, 
  fboFrom, 
  fboTo, 
  progress, 
  onComplete 
}) {
  const { size } = useThree();

  useEffect(() => {
    // Atualiza os render targets quando o tamanho da tela muda
    if (fboFrom.current && fboTo.current) {
      fboFrom.current.setSize(size.width, size.height);
      fboTo.current.setSize(size.width, size.height);
    }
  }, [size, fboFrom, fboTo]);

  return (
    <>
      {/* Renderiza a seção atual */}
      <Current renderTarget={fboFrom.current} />

      {/* Renderiza a próxima seção quando a transição estiver ativa */}
      {transitioning && <Next renderTarget={fboTo.current} />}

      {/* Exibe o efeito de transição */}
      {transitioning && (
        <TransitionEffect
          progress={progress}
          fromTexture={fboFrom.current.texture}
          toTexture={fboTo.current.texture}
          onComplete={onComplete}
        />
      )}
    </>
  );
}

// ✅ Adicionando validação de props
RenderScene.propTypes = {
  currentSection: PropTypes.elementType.isRequired,
  nextSection: PropTypes.elementType,
  transitioning: PropTypes.bool.isRequired,
  fboFrom: PropTypes.object.isRequired,
  fboTo: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};
