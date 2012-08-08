/** 
    A module representing a Liquid object.
    @module Liquid
 */

/**
 * Creates a new Liquid.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height. 
 * @param {Object} [opt_options.color = {r: 97, g: 210, b: 214}] The liquid's color.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.  
 */
function Liquid(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.c = options.c || 1;
  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 100;
  this.height = options.height || 100;
  this.color = options.color  || {r: 97, g: 210, b: 214};
  this.opacity = options.opacity || 0.75;
}
exports.Utils.inherit(Liquid, exports.Mover);
exports.Liquid = Liquid;