/*jshint -W030 */

/**
 * Creates a BiquadFilter.
 * @param {Object} context A Web Audio context.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.type = 'sine'] The oscillator's shape.
 * @param {number} [opt_options.frequency = 400] Frequency.
 * @constructor
 */
function Oscillator(context, opt_options) {
  var options = opt_options || {};
  this.node = context.createOscillator();
  this.node.type = options.type || 'sine';
  this.node.frequency.value = typeof options.frequency !== 'undefined' ? options.frequency : 150;
  this._isPlaying = false;
}

/**
 * Plays an oscillator.
 */
Oscillator.prototype.play = function() {
  this.node.start(0);
};

/**
 * Stops an oscillator.
 */
Oscillator.prototype.stop = function() {
  this.node.stop(0);
};

/**
 * Toggles an oscillator between playing and stopping.
 */
Oscillator.prototype.toggle = function() {
  (this._isPlaying ? this.stop() : this.play());
  this._isPlaying = !this._isPlaying;
};

/**
 * Changes the filter's frequency.
 * @param {number} val The frequency.
 */
Oscillator.prototype.changeFrequency = function(val) {
  this.node.frequency.value = val;
};

module.exports = Oscillator;
