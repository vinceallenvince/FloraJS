/*global Burner */
/**
 * Creates a new Repeller.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Repeller(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Repeller';
  Agent.call(this, options);
}
Utils.extend(Repeller, Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
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

  this.G = options.G === undefined ? -10 : options.G;
  this.mass = options.mass === undefined ? 1000 : options.mass;
  this.isStatic = options.isStatic === undefined ? true : options.isStatic;
  this.width = options.width === undefined ? 100 : options.width;
  this.height = options.height === undefined ? 100 : options.height;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.zIndex = options.zIndex === undefined ? 10 : options.zIndex;
  this.color = options.color || [250, 105, 0];
  this.borderWidth = options.borderWidth === undefined ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.boxShadowSpread = options.boxShadowSpread === undefined ? this.width / 4 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [250, 105, 0];

  Burner.System.updateCache(this);
};
