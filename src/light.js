/*global exports */
/**
 * Creates a new Light object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.85] Opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Light(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.85;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Light, exports.Agent);

/**
 * Define a name property.
 */
Light.prototype.name = 'light';

exports.Light = Light;