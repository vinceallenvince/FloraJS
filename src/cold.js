/*global exports */
/**
 * Creates a new Cold.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [0, 89, 102]] Border color.
 * @param {string} [opt_options.borderRadius = '100%'] Border radius.
 */
function Cold(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [0, 89, 102];
  this.borderRadius = options.borderRadius || '100%';

  exports.Mantle.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Cold, exports.Agent);

Cold.prototype.name = 'Cold';

exports.Cold = Cold;