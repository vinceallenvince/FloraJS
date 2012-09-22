/*global exports */
/**
    A module representing an Oscillator.
    @module Oscillator
 */

/**
 * Creates a new Oscillator.
 * Oscillators simulate wave patterns and move according to
 * amplitude and period properties.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Oscillator options.
 * @param {Object} [opt_options.harmonicAmplitude = {x: 6, y: 6}] If isHarmonic = true, sets the motion's amplitude.
 * @param {Object} [opt_options.harmonicPeriod = {x: 150, y: 150}] If isHarmonic = true, sets the motion's period.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.maxSpeed = 30] Maximum speed
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 */
function Oscillator(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.harmonicAmplitude = options.harmonicAmplitude || exports.PVector.create(4, 0);
  this.harmonicPeriod = options.harmonicPeriod || exports.PVector.create(300, 1);
  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.maxSpeed = options.maxSpeed === 0 ? 0 : options.maxSpeed || 30;
  this.isStatic = !!options.isStatic;
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

  var world = exports.world,
      friction;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    // start -- APPLY FORCES

    if (world.c) { // friction
      friction = exports.Utils.clone(this.velocity);
      friction.mult(-1);
      friction.normalize();
      friction.mult(world.c);
      this.applyForce(friction);
    }

    this.applyForce(world.wind); // wind
    this.applyForce(world.gravity); // gravity


    if (this.isHarmonic) {
      this.velocity.x = this.harmonicAmplitude.x * Math.cos((Math.PI * 2) * exports.world.clock / this.harmonicPeriod.x);
      this.velocity.y = this.harmonicAmplitude.y * Math.cos((Math.PI * 2) * exports.world.clock / this.harmonicPeriod.y);
    }

    // end -- APPLY FORCES

    this.velocity.add(this.acceleration); // add acceleration

    if (this.maxSpeed) {
      this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
    }

    this.location.add(this.velocity); // add velocity

    if (this.pointToDirection) { // object rotates toward direction
      if (this.velocity.mag() > 0.1) { // rotate toward direction?
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
    }

    if (this.controlCamera) { // check camera after velocity calculation
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

    this.acceleration.mult(0); // reset acceleration
  }
};
exports.Oscillator = Oscillator;