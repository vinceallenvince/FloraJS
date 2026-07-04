/**
 * Creates a BiquadFilter.
 */
export default class BiquadFilter {
  node: BiquadFilterNode;

  /**
   * @param context A Web Audio context.
   * @param opt_options A map of initial properties.
   * @param [opt_options.Q = 0] The filter's quality.
   * @param [opt_options.type = 'lowpass'] The filter type.
   */
  constructor(context: AudioContext, opt_options?: { Q?: number, type?: string }) {
    var options = opt_options || {};
    this.node = context.createBiquadFilter();
    this.node.Q.value = options.Q || 0;
    this.node.type = (options.type || 'lowpass') as BiquadFilterType;
  }

  /**
   * Changes the filter's frequency.
   * @param val The frequency.
   */
  changeFrequency(val: number): void {
    this.node.frequency.value = val;
  }
}
