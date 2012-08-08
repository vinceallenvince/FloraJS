/** 
    A module representing a Cold object.
    @module Cold
 */

/**
 * Creates a new Cold object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height. 
 * @param {Object} [opt_options.color = {r: 132, g: 192, b: 201}] Color.
 * @param {number} [opt_options.opacity = 0.5] Opacity.  
 */
function Cold(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || {r: 132, g: 192, b: 201};
  this.opacity = options.color || 0.5;
}
exports.Utils.inherit(Cold, exports.Mover);
exports.Cold = Cold;