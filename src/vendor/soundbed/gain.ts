/**
 * Creates a Gain. Use to control player volume.
 */
export default class Gain {
  node: GainNode;

  /**
   * @param context A Web Audio context.
   * @param opt_options A map of initial properties.
   * @param [opt_options.value = 0.1] The gain's initial value.
   */
  constructor(context: AudioContext, opt_options?: { value?: number }) {
    var options = opt_options || {};
    this.node = context.createGain();
    this.node.gain.value = typeof options.value === 'undefined' ? 0.1 : options.value;
  }

  /**
   * Changes the gain.
   * @param val The gain.
   */
  changeGain(val: number): void {
    this.node.gain.value = val;
  }
}
