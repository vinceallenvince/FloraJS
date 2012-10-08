/*global exports */
/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Mover
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 1] Height.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {Object} [opt_options.parentA = null] The parent A object.
 * @param {Object} [opt_options.parentB = null] The parent B object.
 */
function Connector(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 1;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.zIndex = options.zIndex || 0;
  this.parentA = options.parentA || null;
  this.parentB = options.parentB || null;
  this.color = 'transparent';
}
exports.Utils.extend(Connector, exports.Mover);

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
Connector.prototype.name = 'connector';

/**
 * Called every frame, step() updates the instance's properties.
 */
Connector.prototype.step = function() {

  'use strict';

  var a = this.parentA.location, b = this.parentB.location;

  this.width = Math.floor(exports.Vector.VectorSub(this.parentA.location, this.parentB.location).mag());
  this.location = exports.Vector.VectorAdd(this.parentA.location, this.parentB.location).div(2); // midpoint = (v1 + v2)/2
  this.angle = exports.Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};

exports.Connector = Connector;