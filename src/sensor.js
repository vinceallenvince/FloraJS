/*global exports */
/**
    A module representing a Sensor object.
    @module Sensor
 */

/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = 'LOVE'] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 2] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the sensor's parent.
 * @param {number} [opt_options.offsetAngle = 30] The angle of rotation around the vehicle carrying the sensor.
 * @param {number} [opt_options.opacity = 1] Opacity.
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.
 */
function Sensor(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || 'LOVE';
  this.sensitivity = options.sensitivity === 0 ? 0 : options.sensitivity || 2;
  this.width = options.width === 0 ? 0 : options.width || 5;
  this.height = options.height === 0 ? 0 : options.height || 5;
  this.offsetDistance = options.offsetDistance === 0 ? 0 : options.offsetDistance|| 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.target = options.target || null;
  this.activated = !!options.activated;
}
exports.Utils.inherit(Sensor, exports.Mover);

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
Sensor.name = 'sensor';

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  'use strict';

  var check = false, maxSpeed = 10, i, max;

  if (this.type === "heat" && exports.heats.length > 0) {
    for (i = 0, max = exports.heats.length; i < max; i += 1) { // heat
      if (this.isInside(this, exports.heats[i], this.sensitivity)) {
        this.target = exports.heats[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;

      }
    }
  } else if (this.type === "cold" && exports.colds.length > 0) {
    for (i = 0, max = exports.colds.length; i < max; i += 1) { // cold
      if (this.isInside(this, exports.colds[i], this.sensitivity)) {
        this.target = exports.colds[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "predator" && exports.predators.length > 0) {
    for (i = 0, max = exports.predators.length; i < max; i += 1) { // predator
      if (this.isInside(this, exports.predators[i], this.sensitivity)) {
        this.target = exports.predators[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "light" && exports.lights.length > 0) {
    for (i = 0, max = exports.lights.length; i < max; i += 1) { // light
      if (this.isInside(this, exports.lights[i], this.sensitivity)) {
        this.target = exports.lights[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "oxygen" && exports.oxygen.length > 0) {
    for (i = 0, max = exports.oxygen.length; i < max; i += 1) { // oxygen
      if (this.isInside(this, exports.oxygen[i], this.sensitivity)) {
        this.target = exports.oxygen[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "food" && exports.food.length > 0) {
    for (i = 0, max = exports.food.length; i < max; i += 1) { // food
      if (this.isInside(this, exports.food[i], this.sensitivity)) {
        this.target = exports.food[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  }
  if (!check) {
    this.target = null;
    this.activated = false;
  }
  if (this.afterStep) {
    this.afterStep.apply(this);
  }

};

/**
 * Returns the force to apply the vehicle when its sensor is activated.
 *
 * @param {Object} params A list of properties.
 * @param {Object} params.mover The vehicle carrying the sensor.
 */
Sensor.prototype.getActivationForce = function(params) {

  'use strict';

  var distanceToTarget, m, steer;

  switch (this.behavior) {

    /**
     * Steers toward target
     */
    case "AGGRESSIVE":
      return this.seek(this.target);
    /**
     * Steers away from the target
     */
    case "COWARD":
      var forceCoward = this.seek(this.target);
      return forceCoward.mult(-1);
    /**
     * Arrives at target and keeps moving
     */
    case "LIKES":
      var dvLikes = exports.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      dvLikes.normalize();
      dvLikes.mult(0.5);
      return dvLikes;
    /**
     * Arrives at target and remains
     */
    case "LOVES":
      var dvLoves = exports.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();

      if (distanceToTarget > this.width) {
        m = distanceToTarget/params.mover.maxSpeed;
        dvLoves.mult(m);
        steer = exports.Vector.VectorSub(dvLoves, params.mover.velocity);
        steer.limit(params.mover.maxSteeringForce);
        return steer;
      }
      params.mover.velocity = new exports.Vector();
      params.mover.acceleration = new exports.Vector();
      params.mover.isStatic = true;
      return new exports.Vector();
    /**
     * Arrives at target but does not stop
     */
    case "EXPLORER":
      var dvExplorer = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();

      m = distanceToTarget/params.mover.maxSpeed;
      dvExplorer.mult(-m);
      steer = exports.Vector.VectorSub(dvExplorer, params.mover.velocity);
      steer.limit(params.mover.maxSteeringForce * 0.1);
      return steer;
    /**
     * Moves in the opposite direction as fast as possible
     */
    case "RUN":
      return this.flee(this.target);

    case "ACCELERATE":
      var forceAccel = params.mover.velocity.clone();
      forceAccel.normalize(); // get direction
      return forceAccel.mult(params.mover.minSpeed);

    case "DECELERATE":
      var forceDecel = params.mover.velocity.clone();
      forceDecel.normalize(); // get direction
      return forceDecel.mult(-params.mover.minSpeed);

    default:
      return new exports.Vector();
  }
};

/**
 * Checks if a sensor can detect a stimulator.
 *
 * @param {Object} params The sensor.
 * @param {Object} container The stimulator.
 * @param {number} sensitivity The sensor's sensitivity.
 */
Sensor.prototype.isInside = function(item, container, sensitivity) {

  'use strict';

  if (item.location.x + item.width/2 > container.location.x - container.width/2 - (sensitivity * container.width) &&
    item.location.x - item.width/2 < container.location.x + container.width/2 + (sensitivity * container.width) &&
    item.location.y + item.height/2 > container.location.y - container.height/2 - (sensitivity * container.height) &&
    item.location.y - item.height/2 < container.location.y + container.height/2 + (sensitivity * container.height)) {
    return true;
  }
  return false;
};
exports.Sensor = Sensor;