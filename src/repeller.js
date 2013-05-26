/*global exports */
/**
 * Creates a new Repeller.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} opt_options= A map of initial properties.
 */
function Repeller(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Repeller';
  exports.Agent.call(this, options);
}
exports.Utils.extend(Repeller, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} opt_options= A map of initial properties.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {Array} [opt_options.color = [250, 105, 0]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [224, 228, 204]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 8] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [250, 105, 0]] Box-shadow color.
 */
Repeller.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Repeller._superClass.prototype.init.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || -10;
  this.mass = options.mass === 0 ? 0 : options.mass || 1000;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [250, 105, 0];
  this.borderWidth = options.borderWidth || this.width / 4;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius || 100;
  this.boxShadowSpread = options.boxShadowSpread || this.width / 4;
  this.boxShadowColor = options.boxShadowColor || [250, 105, 0];

  Burner.System.updateCache(this);
};

Repeller.prototype.name = 'Repeller';

exports.Repeller = Repeller;