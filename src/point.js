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
 * @param {Object} [opt_options.color = {r: 0, g: 255, b: 0}] Color.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 */
function Point(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.color = {r: 0, g: 255, b: 0};
  this.zIndex = options.zIndex || 0;
  this.opacity = options.opacity || 0.25;
  this.width = options.width || 5;
  this.height = options.height || 5;
  this.isStatic = options.isStatic || true;
}
exports.Utils.inherit(Point, exports.Mover);
exports.Point = Point;