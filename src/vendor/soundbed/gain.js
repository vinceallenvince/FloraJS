/**
 * Creates a Gain. Use to control player volume.
 * @param {Object} context A Web Audio context.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.value = 0.1] The gain's initial value.
 * @constructor
 */
function Gain(context, opt_options) {
  var options = opt_options || {};
  this.node = context.createGain();
  this.node.gain.value = typeof options.value === 'undefined' ? 0.1 : options.value;
}

/**
 * Changes the gain.
 * @param {number} val The gain.
 */
Gain.prototype.changeGain = function(val) {
  this.node.gain.value = val;
};

module.exports = Gain;
