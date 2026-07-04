/**
 * Creates a Delay.
 */
export default class Delay {
  node: DelayNode;

  /**
   * @param context A Web Audio context.
   * @param opt_options A map of initial properties.
   */
  constructor(context: AudioContext, opt_options?: { [key: string]: any }) {
    var options = opt_options || {};
    this.node = context.createDelay();
  }

  /**
   * Sets the delay's delay time.
   * @param val The delay time.
   */
  setDelay(val: number): void {
    this.node.delayTime.value = val;
  }
}
