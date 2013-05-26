/*global exports */
/**
 * Creates a new Oxygen.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} opt_options= A map of initial properties.
 */
function Oxygen(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Oxygen';
  exports.Agent.call(this, options);
}
exports.Utils.extend(Oxygen, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} opt_options= A map of initial properties.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {number} [opt_options.zIndex = 1] zIndex.
 * @param {Array} [opt_options.color = [0, 174, 239]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [64, 255, 255]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [0, 174, 239]] Box-shadow color.
 */
Oxygen.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Oxygen._superClass.prototype.init.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 1;
  this.color = options.color || [0, 174, 239];
  this.borderWidth = options.borderWidth || this.width / 4;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [0, 50, 200];
  this.borderRadius = options.borderRadius || 100;
  this.boxShadowSpread = options.boxShadowSpread || this.width / 4;
  this.boxShadowColor = options.boxShadowColor || [0, 174, 239];

  Burner.System.updateCache(this);
}

Oxygen.prototype.name = 'Oxygen';

exports.Oxygen = Oxygen;