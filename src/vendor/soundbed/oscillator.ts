/**
 * Creates an Oscillator.
 */
export default class Oscillator {
  node: OscillatorNode;
  _isPlaying: boolean;

  /**
   * @param context A Web Audio context.
   * @param opt_options A map of initial properties.
   * @param [opt_options.type = 'sine'] The oscillator's shape.
   * @param [opt_options.frequency = 150] Frequency.
   */
  constructor(context: AudioContext, opt_options?: { type?: string, frequency?: number }) {
    var options = opt_options || {};
    this.node = context.createOscillator();
    this.node.type = (options.type || 'sine') as OscillatorType;
    this.node.frequency.value = typeof options.frequency !== 'undefined' ? options.frequency : 150;
    this._isPlaying = false;
  }

  /**
   * Plays an oscillator.
   */
  play(): void {
    this.node.start(0);
  }

  /**
   * Stops an oscillator.
   */
  stop(): void {
    this.node.stop(0);
  }

  /**
   * Toggles an oscillator between playing and stopping.
   */
  toggle(): void {
    (this._isPlaying ? this.stop() : this.play());
    this._isPlaying = !this._isPlaying;
  }

  /**
   * Changes the filter's frequency.
   * @param val The frequency.
   */
  changeFrequency(val: number): void {
    this.node.frequency.value = val;
  }
}
