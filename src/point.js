/*global exports */
/**
 * Creates a new Point.
 *
 * @constructor
 * @extends Agent
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.color = [200, 200, 200]] Color.
 * @param {number} [opt_options.borderRadius = '100%'] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {number} [opt_options.borderStyle = 'solid'] Border style.
 * @param {number} [opt_options.borderColor = [60, 60, 60]] Border color.
 */
function Point(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 0;
  this.color = options.color || [200, 200, 200];
  this.borderRadius = options.borderRadius || '100%';
  this.borderWidth = options.borderWidth || 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [60, 60, 60];
}
exports.Utils.extend(Point, exports.Agent);

Point.prototype.name = 'Point';

exports.Point = Point;