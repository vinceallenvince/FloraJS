/*global exports */
/**
 * Creates a new Food object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {number} [opt_options.zIndex = 10] zIndex.
 * @param {string|Array} [opt_options.color = [57, 28, 0]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [115, 255, 0]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Food(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [57, 128, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [115, 255, 0];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Food, exports.Agent);

Food.prototype.name = 'Food';

exports.Food = Food;