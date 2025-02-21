//import { Canvas } from '@react-three/fiber';
import Glass from './Glass';
import DynamicBackground from './DynamicBackground';
import GlassCube from './GlassCube';
import ConceptualCore from './ConceptualCore';
import { OrbitControls, Environment } from '@react-three/drei';

export default function WorldCanvas() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <Environment preset="studio" background />
      <DynamicBackground />
      <Glass />
      <GlassCube />
      <ConceptualCore />
      <OrbitControls />
    </>
  );
}