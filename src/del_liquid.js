/*global Burner */
/**
 * Creates a new Liquid.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Liquid(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Liquid';
  Agent.call(this, options);
}
Utils.extend(Liquid, Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {string|Array} [opt_options.color = 105, 210, 231] Color.
 * @param {string|number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = 167, 219, 216] Border color.
 * @param {string} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = 147, 199, 196] Box-shadow color.
 */
Liquid.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Liquid._superClass.prototype.init.call(this, options);

  this.c = typeof options.c === 'undefined' ? 1 : options.c;
  this.mass = typeof options.mass === 'undefined' ? 50 : options.mass;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.width = typeof options.width === 'undefined' ? 100 : options.width;
  this.height = typeof options.height === 'undefined' ? 100 : options.height;
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.color = options.color || [105, 210, 231];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [167, 219, 216];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowSpread = typeof options.boxShadowSpread === 'undefined' ? this.width / 8 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [147, 199, 196];

  Burner.System.updateCache(this);
};
