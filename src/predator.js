/** 
    A module representing a Predator object.
    @module Predator
 */

/**
 * Creates a new Predator object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 75] Width.
 * @param {number} [opt_options.height = 75] Height. 
 * @param {Object} [opt_options.color = {r: 200, g: 0, b: 0}] Color.
 * @param {number} [opt_options.opacity = 0.5] The particle's opacity.  
 */
function Predator(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 75;
  this.height = options.height || 75;
  this.color = options.color || {r: 200, g: 0, b: 0};
  this.opacity = options.opacity || 0.5;
}
exports.Utils.inherit(Predator, exports.Mover);
exports.Predator = Predator;