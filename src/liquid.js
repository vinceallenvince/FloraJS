/*global exports */
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
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 */
function Liquid(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.c = options.c === 0 ? 0 : options.c || 1;
  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
}
exports.Utils.inherit(Liquid, exports.Mover);

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
Liquid.name = 'liquid';

exports.Liquid = Liquid;