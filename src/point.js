/** 
    A module representing a Point.
    @module Point
 */

/**
 * Creates a new Point.
 *
 * @constructor
 * @extends Mover 
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height. 
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 */
function Point(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.5;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 0;
  this.offsetAngle = options.offsetAngle || 0;
  this.length = options.length === 0 ? 0 : options.length|| 30;
}
exports.Utils.inherit(Point, exports.Mover);
exports.Point = Point;