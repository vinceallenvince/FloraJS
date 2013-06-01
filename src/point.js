/*global exports, Burner */
/**
 * Creates a new Point.
 *
 * @constructor
 * @extends Mover
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Point(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Point';
  exports.Mover.call(this, options);
}
exports.Utils.extend(Point, exports.Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.zIndex = 1] zIndex.
 * @param {Array} [opt_options.color = [200, 200, 200]] Color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [60, 60, 60]] Border color.
 */
Point.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 1;
  this.color = options.color || [200, 200, 200];
  this.borderRadius = options.borderRadius === 0 ? 0 : 100;
  this.borderWidth = options.borderWidth === 0 ? 0 : 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [60, 60, 60];
};

Point.prototype.name = 'Point';

exports.Point = Point;