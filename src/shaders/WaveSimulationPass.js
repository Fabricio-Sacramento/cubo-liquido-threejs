// src/shaders/WaveSimulationPass.js
import { Pass } from 'postprocessing';
import { FullScreenQuad } from 'three-stdlib';
import { WaveSimulationMaterial } from './WaveSimulationMaterial';

export class WaveSimulationPass extends Pass {
  constructor(width, height) {
    super();
    this.material = new WaveSimulationMaterial();
    this.fsQuad = new FullScreenQuad(this.material);
    this.width = width;
    this.height = height;
  }

  render(renderer, inputBuffer, outputBuffer) {
    renderer.setRenderTarget(outputBuffer);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
  }
}
