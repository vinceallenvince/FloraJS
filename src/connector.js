/*global exports */
/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Mover
 * @param {Object} parentA The object that starts the connection.
 * @param {Object} parentB The object that ends the connection.
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 */
function Connector(parentA, parentB, opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  if (!parentA || !parentB) {
    throw new Error('Connector: both parentA and parentB are required.');
  }
  this.parentA = parentA;
  this.parentB = parentB;
  this.width = 0;
  this.height = 0;
  this.color = 'transparent';

  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.zIndex = options.zIndex || 0;

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

  var a = this.parentA.location,
      b = this.parentB.location;

  this.width = Math.floor(exports.Vector.VectorSub(this.parentA.location, this.parentB.location).mag());
  this.location = exports.Vector.VectorAdd(this.parentA.location, this.parentB.location).div(2); // midpoint = (v1 + v2)/2
  this.angle = exports.Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};

exports.Connector = Connector;