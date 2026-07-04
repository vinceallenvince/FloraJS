/**
 * Creates a BiquadFilter.
 * @param {Object} context A Web Audio context.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.Q = 0] The filter's quality.
 * @param {number} [opt_options.type = 'lowpass'] The filter type.
 * @constructor
 */
function BiquadFilter(context, opt_options) {
  var options = opt_options || {};
  this.node = context.createBiquadFilter();
  this.node.Q.value = options.Q || 0;
  this.node.type = options.type || 'lowpass';
}

/**
 * Changes the filter's frequency.
 * @param {number} val The frequency.
 */
BiquadFilter.prototype.changeFrequency = function(val) {
  this.node.frequency.value = val;
};

module.exports = BiquadFilter;