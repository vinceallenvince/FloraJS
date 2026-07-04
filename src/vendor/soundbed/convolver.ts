/**
 * Creates a Convolver.
 */
export default class Convolver {
  context: AudioContext;
  node: ConvolverNode;

  /**
   * @param context A Web Audio context.
   * @param opt_options A map of initial properties.
   */
  constructor(context: AudioContext, opt_options?: { [key: string]: any }) {
    var options = opt_options || {};
    this.context = context;
    this.node = context.createConvolver();
    this.node.normalize = true;
  }

  /**
   * Sets the type of Convolver effect.
   * @param type Sets the reverb level.
   * @example
   * 0 - none
   * 1 - inverse
   * 2 - small
   * 3 - medium
   * 4 - large
   * 5 - huge
   */
  setEffect(type: number): void {
    var noiseBuffer;

    switch (type) {
      case 1:
        noiseBuffer = this.context.createBuffer(2, 0.01 * this.context.sampleRate,
            this.context.sampleRate);
        break;

      case 2:
        noiseBuffer = this.context.createBuffer(2, 1 * this.context.sampleRate,
            this.context.sampleRate);
        break;

      case 3:
        noiseBuffer = this.context.createBuffer(2, 3 * this.context.sampleRate,
            this.context.sampleRate);
        break;

      case 4:
        noiseBuffer = this.context.createBuffer(2, 6 * this.context.sampleRate,
            this.context.sampleRate);
        break;

      case 5:
        noiseBuffer = this.context.createBuffer(2, 12 * this.context.sampleRate,
            this.context.sampleRate);
        break;
      default:
        this.node.buffer = null;
        return;
    }

    var left = noiseBuffer.getChannelData(0),
        right = noiseBuffer.getChannelData(1);

    for (var i = 0, max = noiseBuffer.length; i < max; i++) {
      left[i] = Math.random() * 2 - 1;
      right[i] = Math.random() * 2 - 1;
    }

    this.node.buffer = noiseBuffer;
  }
}
