/*global Burner */
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
  Mover.call(this, options);
}
Utils.extend(Point, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.zIndex = 1] zIndex.
 * @param {Array} [opt_options.color = 200, 200, 200] Color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = 60, 60, 60] Border color.
 */
Point.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.width = typeof options.width === 'undefined' ? 10 : options.width;
  this.height = typeof options.height === 'undefined' ? 10 : options.height;
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.color = options.color || [200, 200, 200];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.borderWidth = typeof options.borderWidth === 'undefined' ? 2 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [60, 60, 60];
};
