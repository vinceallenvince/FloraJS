/*global exports */
/**
 * Creates a new Liquid.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} opt_options= A map of initial properties.
 */
function Liquid(opt_options) {

  var options = opt_options || {};
  exports.Agent.call(this, options);
  this.name = 'Liquid';
}
exports.Utils.extend(Liquid, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} opt_options= A map of initial properties.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {string|Array} [opt_options.color = [105, 210, 231]] Color.
 * @param {string|number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [167, 219, 216]] Border color.
 * @param {string} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [147, 199, 196]] Box-shadow color.
 */
Liquid.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Liquid._superClass.prototype.init.call(this, options);

  this.c = options.c === 0 ? 0 : options.c || 1;
  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 1;
  this.color = options.color || [105, 210, 231];
  this.borderWidth = options.borderWidth || this.width / 4;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [167, 219, 216];
  this.borderRadius = options.borderRadius || 100;
  this.boxShadowSpread = options.boxShadowSpread || this.width / 8;
  this.boxShadowColor = options.boxShadowColor || [147, 199, 196];

  Burner.System.updateCache(this);
};

exports.Liquid = Liquid;
