/*global exports */
/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Agent
 * @param {Object} parentA The object that starts the connection.
 * @param {Object} parentB The object that ends the connection.
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.opacity = 1] Opacity.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.borderTopWidth = 0] Border top width.
 * @param {number} [opt_options.borderTopStyle = 'dotted'] Border top style.
 */
function Connector(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  if (!options.parentA || !options.parentB) {
    throw new Error('Connector: both parentA and parentB are required.');
  }
  this.parentA = options.parentA;
  this.parentB = options.parentB;

  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.zIndex = options.zIndex || 0;

  this.borderWidth = 2;
  this.borderRadius = '0%';
  this.borderStyle = 'none';
  this.borderColor = 'red';

  this.borderTopStyle = 'dotted';
  this.borderRightStyle = 'none';
  this.borderBottomStyle = 'none';
  this.borderLeftStyle = 'none';

  this.width = 0;
  this.height = 0;
  this.color = 'transparent';
}
exports.Utils.extend(Connector, exports.Agent);

Connector.prototype.name = 'Connector';

/**
 * Called every frame, step() updates the instance's properties.
 */
Connector.prototype.step = function() {

  'use strict';

  var a = this.parentA.location,
      b = this.parentB.location;

  this.width = Math.floor(exports.Vector.VectorSub(this.parentA.location,
      this.parentB.location).mag());

  this.location = exports.Vector.VectorAdd(this.parentA.location,
      this.parentB.location).div(2); // midpoint = (v1 + v2)/2

  this.angle = exports.Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};

exports.Connector = Connector;
