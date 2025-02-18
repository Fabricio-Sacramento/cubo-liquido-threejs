// src/shaders/RipplePass.js
import { Pass } from 'postprocessing';
import { FullScreenQuad } from 'three-stdlib';
import { RippleMaterial } from './RippleMaterial';

export class RipplePass extends Pass {
  constructor() {
    super();
    this.material = new RippleMaterial();
    this.fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer, inputBuffer, outputBuffer) {
    // Atualiza o uniforme u_buffer com a textura do input (buffer da cena)
    this.material.uniforms.u_buffer.value = inputBuffer.texture;
    renderer.setRenderTarget(outputBuffer);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
  }
}
