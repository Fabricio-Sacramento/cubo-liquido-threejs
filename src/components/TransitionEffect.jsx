import { useRef, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import PropTypes from "prop-types";

// Define o material do shader com o efeito windowslice
const TransitionMaterial = shaderMaterial(
  { progress: 0, count: 10, smoothness: 0.5, from: null, to: null },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (efeito windowslice)
  `
    uniform float progress;
    uniform float count;
    uniform float smoothness;
    uniform sampler2D from;
    uniform sampler2D to;
    varying vec2 vUv;

    void main() {
      float pr = smoothstep(-smoothness, 0.0, vUv.x - progress * (1.0 + smoothness));
      float s = step(pr, fract(count * vUv.x));
      vec4 fromColor = texture2D(from, vUv);
      vec4 toColor = texture2D(to, vUv);
      gl_FragColor = mix(fromColor, toColor, s);
    }
  `
);

extend({ TransitionMaterial });

export default function TransitionEffect({
  progress,
  fromTexture,
  toTexture,
  onComplete,
}) {
  const transitionRef = useRef();

  useFrame(() => {
    if (transitionRef.current) {
      transitionRef.current.progress = progress;
    }
  });

  useEffect(() => {
    if (progress >= 1) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <transitionMaterial ref={transitionRef} from={fromTexture} to={toTexture} />
    </mesh>
  );
}

TransitionEffect.propTypes = {
  progress: PropTypes.number.isRequired,
  fromTexture: PropTypes.object.isRequired,
  toTexture: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};
