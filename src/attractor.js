/*global exports */
/**
 * Creates a new Attractor object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {string|Array} [opt_options.color = [32, 102, 63]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [224, 228, 204]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Attractor(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || 10;
  this.mass = options.mass === 0 ? 0 : options.mass || 1000;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [92, 187, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius || '100%';

  exports.Mantle.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Attractor, exports.Agent);

Attractor.prototype.name = 'Attractor';

exports.Attractor = Attractor;