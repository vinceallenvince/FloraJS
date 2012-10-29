/*global exports */
/**
 * Creates a new Camera.
 *
 * @constructor
 * @param {Object} [opt_options]
 * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location.
 * @param {Object} [opt_options.controlObj = null] The object that controls the camera.
 */
function Camera(opt_options) {

  'use strict';

  var options = opt_options || {};

  this.location = options.location || new exports.Vector(0, 0);
  this.controlObj = options.controlObj || null;
}

Camera.prototype.name = 'Camera';

exports.Camera = Camera;