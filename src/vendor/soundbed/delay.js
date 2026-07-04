/**
 * Creates a Delay.
 * @param {Object} context A Web Audio context.
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function Delay(context, opt_options) {
  var options = opt_options || {};
  this.node = context.createDelay();
}

/**
 * Sets the delay's delay time.
 * @param {number} val The delay time.
 */
Delay.prototype.setDelay = function(val) {
  this.node.delayTime.value = val;
};

module.exports = Delay;