// src/App.jsx
//import React from 'react';
import { Canvas } from '@react-three/fiber';
import WaterRippleScene from './components/WaterRippleScene';

export default function App() {
  return (
    <Canvas>
      <WaterRippleScene />
    </Canvas>
  );
}
