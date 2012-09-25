/*global exports */
/**
    A module representing an Oscillator.
    @module Oscillator
 */

/**
 * Creates a new Oscillator.
 * Oscillators simulate wave patterns and move according to
 * amplitude and angular velocity. As step() is called, the
 * object's location is determined by the output of the
 * sine function.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Oscillator options.
 * @param {Object} [opt_options.initialLocation = The center of the world] The object's initial location.
 * @param {Object} [opt_options.lastLocation = {x: 0, y: 0}] The object's last location. Used to calculate
 *    angle if pointToDirection = true.
 * @param {Object} [opt_options.amplitude = {x: 4, y: 0}] Sets amplitude, the distance from the object's
 *    initial location (center of the motion) to either extreme.
 * @param {Object} [opt_options.acceleration = {x: 0, y: 0}] The object's acceleration. Oscillators have a
 *    constant acceleration.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.isPerlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 */
function Oscillator(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.initialLocation = options.initialLocation ||
      new exports.Vector(exports.world.width/2, exports.world.height/2);
  this.lastLocation = new exports.Vector(0, 0);
  this.amplitude = options.amplitude || new exports.Vector(4, 0);
  this.acceleration = options.acceleration || new exports.Vector(0.01, 0);
  this.aVelocity = new exports.Vector(0, 0);
  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.isStatic = !!options.isStatic;

  this.isPerlin = !!options.isPerlin;
  this.perlinSpeed = options.perlinSpeed || 0.005;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow || -2;
  this.perlinAccelHigh = options.perlinAccelHigh || 2;
  this.perlinOffsetX = options.perlinOffsetX || Math.random() * 10000;
  this.perlinOffsetY = options.perlinOffsetY || Math.random() * 10000;
}
exports.Utils.inherit(Oscillator, exports.Mover);

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
Oscillator.name = 'oscillator';

/**
 * Called every frame, step() updates the instance's properties.
 */
Oscillator.prototype.step = function () {

  'use strict';

  var world = exports.world, velDiff;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    if (this.isPerlin) {
      this.perlinTime += this.perlinSpeed;
      this.aVelocity.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.aVelocity.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    } else {
      this.aVelocity.add(this.acceleration); // add acceleration
    }

    this.location.x = this.initialLocation.x + Math.sin(this.aVelocity.x) * this.amplitude.x;
    this.location.y = this.initialLocation.y + Math.sin(this.aVelocity.y) * this.amplitude.y;

    if (this.pointToDirection) { // object rotates toward direction
        velDiff = exports.Vector.VectorSub(this.location, this.lastLocation);
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(velDiff.y, velDiff.x));
    }

    if (this.controlCamera) {
      this.checkCameraEdges();
    }

    if (this.checkEdges || this.wrapEdges) {
      this.checkWorldEdges(world);
    }

    if (this.lifespan > 0) {
      this.lifespan -= 1;
    }

    if (this.afterStep) {
      this.afterStep.apply(this);
    }

    if (this.pointToDirection) {
      this.lastLocation.x = this.location.x;
      this.lastLocation.y = this.location.y;
    }
  }
};
exports.Oscillator = Oscillator;