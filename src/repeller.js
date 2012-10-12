/*global exports */
/**
 * Creates a new Repeller object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.G = -10] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 */
function Repeller(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || -10;
  this.mass = options.mass === 0 ? 0 : options.mass || 100;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
}
exports.Utils.extend(Repeller, exports.Agent);

/**
 * Define a name property.
 */
Repeller.prototype.name = 'repeller';

exports.Repeller = Repeller;