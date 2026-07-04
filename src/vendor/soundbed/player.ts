import Convolver from './convolver';
import Delay from './delay';
import Gain from './gain';
import Oscillator from './oscillator';
import SimplexNoise from '../quietriot';
import Utils from '../drawing-utils-lib';

// TODO: create play/pause methods

export interface PlayerOptions {
  [key: string]: any;
}

/**
 * Creates a Player.
 */
export default class Player {
  /** The shared audio context, created at module load. */
  static audio_context: AudioContext = (function() {
    try {
      return new AudioContext();
    } catch (e) {
      throw new Error('No web audio support in this browser');
    }
  })();

  name: string;
  gain: Gain | null;
  oscA: Oscillator | null;
  oscB: Oscillator | null;
  convolver: Convolver | null;
  delay: Delay | null;
  clock: number;

  perlin: boolean;
  reverb: number;
  delayTime: number;
  oscAFreq: number;
  oscBFreq: number;
  oscARate: number;
  oscBRate: number;
  freqMin: number;
  freqMax: number;
  volume: number;
  volumeMin: number;
  volumeMax: number;
  beforeStep: (this: Player) => void;

  constructor() {
    this.name = 'Player';
    this.gain = null;
    this.oscA = null;
    this.oscB = null;
    this.convolver = null;
    this.delay = null;
    this.clock = 0;
  }

  /**
   * Configures an audio context.
   * @param {Object} [opt_options=] A map of initial properties.
   * @param {boolean} [opt_options.perlin = true] When set to true, the oscillators' frequencies cycle via Perlin noise.
   * @param {number} [opt_options.reverb = 4] Reverb level.
   * @param {number} [opt_options.delayTime = 0] Delay time.
   * @param {number} [opt_options.oscAFreq = 150] Oscillator A's initial frequency.
   * @param {number} [opt_options.oscBFreq = 200] Oscillator B's initial frequency.
   * @param {number} [opt_options.oscARate = 0.001] Oscillator A's cycle rate through its frequency min/max.
   * @param {number} [opt_options.oscBRate = -0.001] Oscillator B's cycle rate through its frequency min/max.
   * @param {number} [opt_options.freqMin = 150] The oscillators' minimum frequency.
   * @param {number} [opt_options.freqMax = 200] The oscillators' maximum frequency.
   * @param {number} [opt_options.volume = 0.25] The player's initial volume. Valid values between 0 and 1.
   * @param {number} [opt_options.volumeMin = 0.1] The player's minimum volume. Valid values between 0 and 1.
   * @param {number} [opt_options.volumeMax= 0.25] The player's maximum volume. Valid values between 0 and 1.
   * @param {Function} [opt_options.beforeStep = function() {}] A function called at the beginning of each animation frame.
   */
  init(opt_options?: PlayerOptions): void {
    var options = opt_options || {};
    var audio_context = Player.audio_context;

    this.perlin = typeof options.perlin !== 'undefined' ? options.perlin : true;
    this.reverb = typeof options.reverb !== 'undefined' ? options.reverb : 4;
    this.delayTime = options.delayTime || 0;
    this.oscAFreq = typeof options.oscAFreq !== 'undefined' ? options.oscAFreq : 150;
    this.oscBFreq = typeof options.oscBFreq !== 'undefined' ? options.oscBFreq : 200;
    this.oscARate = typeof options.oscARate !== 'undefined' ? options.oscARate : 0.001;
    this.oscBRate = typeof options.oscBRate !== 'undefined' ? options.oscBRate : -0.001;
    this.freqMin = typeof options.freqMin !== 'undefined' ? options.freqMin : 150;
    this.freqMax = typeof options.freqMax !== 'undefined' ? options.freqMax : 200;
    this.volume = typeof options.volume !== 'undefined' ? options.volume : 0.25;
    this.volumeMin = typeof options.volumeMin !== 'undefined' ? options.volumeMin : 0.5;
    this.volumeMax = typeof options.volumeMax !== 'undefined' ? options.volumeMax : 0.75;
    this.beforeStep = options.beforeStep || function() {};

    this.gain = new Gain(audio_context);
    this.oscA = new Oscillator(audio_context);
    this.oscB = new Oscillator(audio_context);
    this.convolver = new Convolver(audio_context);
    this.delay = new Delay(audio_context);

    this.oscA.toggle();
    this.oscB.toggle();
    this.convolver.setEffect(this.reverb);
    this.delay.setDelay(this.delayTime);
    this.gain.changeGain(this.volume);
    this.oscA.changeFrequency(this.oscAFreq);
    this.oscB.changeFrequency(this.oscBFreq);

    this.configure(audio_context);

    if (this.perlin) {
      this._loop();
    }
  }

  /**
   * Sets audio node configuration.
   * @param context A Web Audio context.
   */
  configure(context: AudioContext): void {
    this._connect(this.gain.node, context.destination);
    this._connect(this.delay.node, this.gain.node);
    this._connect(this.convolver.node, this.delay.node);
    this._connect(this.oscA.node, this.convolver.node);
    this._connect(this.oscB.node, this.convolver.node);
  }

  /**
   * Connects audio nodes.
   * @param nodeA A Web Audio node.
   * @param nodeB A Web Audio node.
   * @private
   */
  _connect(nodeA: AudioNode, nodeB: AudioNode): void {
    nodeA.connect(nodeB);
  }

  /**
   * Updates audio node properties.
   * @private
   */
  _loop(): void {
    this.beforeStep.call(this);

    var valA = Utils.map(SimplexNoise.noise(this.clock * this.oscARate, 0),
      -1, 1, this.freqMin, this.freqMax);

    this.oscA.changeFrequency(valA);

    var valB = Utils.map(SimplexNoise.noise(this.clock * this.oscBRate, 0),
      -1, 1, this.freqMin, this.freqMax);

    var volume = Utils.map(SimplexNoise.noise(this.clock * this.oscARate, 0),
      -1, 1, this.volumeMin, this.volumeMax);

    this.oscB.changeFrequency(valB);
    this.gain.changeGain(volume);

    this.clock++;

    window.requestAnimationFrame(this._loop.bind(this));
  }
}
