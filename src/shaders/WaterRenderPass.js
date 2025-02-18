// src/shaders/WaterRenderPass.js
import { Pass } from 'postprocessing';
import { FullScreenQuad } from 'three-stdlib';
import { WaterRenderMaterial } from './WaterRenderMaterial';

export class WaterRenderPass extends Pass {
  constructor() {
    super();
    this.material = new WaterRenderMaterial();
    this.fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer, inputBuffer, outputBuffer) {
    // inputBuffer não é usado diretamente aqui.
    // O 'uHeightMap' é configurado externamente antes de chamarmos .render()
    renderer.setRenderTarget(outputBuffer);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
  }
}
