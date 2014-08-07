var Mover = require('./Mover').Mover,
    Utils = require('Burner').Utils,
    System = require('Burner').System,
    Vector = require('Burner').Vector;

/**
 * Creates a new Agent.
 *
 * Agents are basic Flora elements that respond to forces like gravity, attraction,
 * repulsion, etc. They can also chase after other Agents, organize with other Agents
 * in a flocking behavior, and steer away from obstacles. They can also follow the mouse.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
 * @param {number} [opt_options.maxSteeringForce = 10] Set the maximum strength of any steering force.
 * @param {Object} [opt_options.seekTarget = null] An object to seek.
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {Array} [opt_options.sensors = ] A list of sensors attached to this object.
 * @param {number} [opt_options.motorSpeed = 2] Motor speed
 * @param {Array} [opt_options.color = 197, 177, 115] Color.
 * @param {number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {number} [opt_options.borderRadius = 0] Border radius.
 *
 * @constructor
 * @extends Mover
 */
function Agent(opt_options) {
  Mover.call(this);
  var options = opt_options || {};
  this.name = options.name || 'Agent';

  this.followMouse = !!options.followMouse;
  this.maxSteeringForce = typeof options.maxSteeringForce === 'undefined' ? 5 : options.maxSteeringForce;
  this.seekTarget = options.seekTarget || null;
  this.flocking = !!options.flocking;
  this.separateStrength = typeof options.separateStrength === 'undefined' ? 0.3 : options.separateStrength;
  this.alignStrength = typeof options.alignStrength === 'undefined' ? 0.2 : options.alignStrength;
  this.cohesionStrength = typeof options.cohesionStrength === 'undefined' ? 0.1 : options.cohesionStrength;
  this.flowField = options.flowField || null;

  this.sensors = options.sensors || [];
  this.motorSpeed = options.motorSpeed || 0;

  this.color = options.color || [197, 177, 115];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = options.borderRadius || 0;
}
Utils.extend(Agent, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
Agent.prototype.init = function(world, opt_options) {
  Agent._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.separateSumForceVector = new Vector(); // used in Agent.separate()
  this.alignSumForceVector = new Vector(); // used in Agent.align()
  this.cohesionSumForceVector = new Vector(); // used in Agent.cohesion()
  this.followTargetVector = new Vector(); // used in Agent.applyAdditionalForces()
  this.followDesiredVelocity = new Vector(); // used in Agent.follow()
  this.motorDir = new Vector(); // used in Agent.applyAdditionalForces()

  this.desiredSeparation = typeof options.desiredSeparation === 'undefined' ? this.width * 2 : options.desiredSeparation;

  this.borderRadius = options.borderRadius || this.sensors.length ? 100 : 0;

  if (!this.velocity.mag()) {
    this.velocity.x = 1; // angle = 0;
    this.velocity.y = 0;
    this.velocity.normalize();
    this.velocity.rotate(Utils.degreesToRadians(this.angle));
    this.velocity.mult(this.motorSpeed);
  }

  for (var i = 0, max = this.sensors.length; i < max; i++) {
    this.sensors[i].parent = this;
  }
};

/**
 * Applies Agent-specific forces.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.applyAdditionalForces = function() {

  var i, max, sensorActivated, sensor, r, theta, x, y;

  /*if (this.sensors.length > 0) { // Sensors
    for (i = 0, max = this.sensors.length; i < max; i += 1) {

      sensor = this.sensors[i];

      r = sensor.offsetDistance; // use angle to calculate x, y
      theta = Utils.degreesToRadians(this.angle + sensor.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      sensor.location.x = this.location.x;
      sensor.location.y = this.location.y;
      sensor.location.add(new Vector(x, y)); // position the sensor

      if (i) {
        sensor.borderStyle = 'none';
      }

      if (sensor.activated) {
        if (typeof sensor.behavior === 'function') {
          this.applyForce(sensor.behavior.call(this, sensor, sensor.target));
        } else {
          this.applyForce(sensor.getBehavior().call(this, sensor, sensor.target));
        }
        sensorActivated = true;
      }

    }
  }*/

  /**
   * If no sensors were activated and this.motorSpeed != 0,
   * apply a force in the direction of the current velocity.
   */
  if (!sensorActivated && this.motorSpeed) {
    this.motorDir.x = this.velocity.x;
    this.motorDir.y = this.velocity.y;
    this.motorDir.normalize();
    if (this.velocity.mag() > this.motorSpeed) { // decelerate to defaultSpeed
      this.motorDir.mult(-this.motorSpeed);
    } else {
      this.motorDir.mult(this.motorSpeed);
    }
    this.applyForce(this.motorDir); // constantly applies a force
  }

  // TODO: cache a vector for new location
  if (this.followMouse) { // follow mouse
    var t = {
      location: new Vector(System.mouse.location.x,
          System.mouse.location.y)
    };
    this.applyForce(this._seek(t));
  }

  if (this.seekTarget) { // seek target
    this.applyForce(this._seek(this.seekTarget));
  }

  /*if (this.flowField) { // follow flow field
    var res = this.flowField.resolution,
      col = Math.floor(this.location.x/res),
      row = Math.floor(this.location.y/res),
      loc, target;

    if (this.flowField.field[col]) {
      loc = this.flowField.field[col][row];
      if (loc) { // sometimes loc is not available for edge cases
        this.followTargetVector.x = loc.x;
        this.followTargetVector.y = loc.y;
      } else {
        this.followTargetVector.x = this.location.x;
        this.followTargetVector.y = this.location.y;
      }
      target = {
        location: this.followTargetVector
      };
      this.applyForce(this.follow(target));
    }

  }*/

  if (this.flocking) {
    this._flock(System.getAllItemsByName(this.name));
  }

  return this.acceleration;
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
Agent.prototype._seek = function(target) {

  var world = this.world,
    desiredVelocity = Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.width / 2) { // slow down to arrive at target
    var m = Utils.map(distanceToTarget, 0, world.width / 2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  desiredVelocity.sub(this.velocity);
  desiredVelocity.limit(this.maxSteeringForce);

  return desiredVelocity;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype._flock = function(items) {
  this.applyForce(this._separate(items).mult(this.separateStrength));
  this.applyForce(this._align(items).mult(this.alignStrength));
  this.applyForce(this._cohesion(items).mult(this.cohesionStrength));
  return this.acceleration;
};

/**
 * Loops through a passed items array and calculates a force to apply
 * to avoid all items.
 *
 * @param {array} items An array of Flora items.
 * @returns {Object} A force to apply.
 */
Agent.prototype._separate = function(items) {

  var i, max, item, diff, d,
  sum, count = 0, steer;

  this.separateSumForceVector.x = 0;
  this.separateSumForceVector.y = 0;
  sum = this.separateSumForceVector;

  for (i = 0, max = items.length; i < max; i += 1) {
    item = items[i];
    if (this.id !== item.id) {

      d = this.location.distance(item.location);

      if ((d > 0) && (d < this.desiredSeparation)) {
        diff = Vector.VectorSub(this.location, item.location);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count += 1;
      }
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new Vector(); // TODO: do we need this?
};

/**
 * Loops through a passed items array and calculates a force to apply
 * to align with all items.
 *
 * @param {array} items An array of Flora items.
 * @returns {Object} A force to apply.
 */
Agent.prototype._align = function(items) {

  var i, max, item, d,
    neighbordist = this.width * 2,
    sum, count = 0, steer;

  this.alignSumForceVector.x = 0;
  this.alignSumForceVector.y = 0;
  sum = this.alignSumForceVector;

  for (i = 0, max = items.length; i < max; i += 1) {
    item = items[i];
    d = this.location.distance(item.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.id !== item.id) {
        sum.add(item.velocity);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new Vector();
};

/**
 * Loops through a passed items array and calculates a force to apply
 * to stay close to all items.
 *
 * @param {array} items An array of Flora items.
 * @returns {Object} A force to apply.
 */
Agent.prototype._cohesion = function(items) {

  var i, max, item, d,
    neighbordist = 10,
    sum, count = 0, desiredVelocity, steer;

  this.cohesionSumForceVector.x = 0;
  this.cohesionSumForceVector.y = 0;
  sum = this.cohesionSumForceVector;

  for (i = 0, max = items.length; i < max; i += 1) {
    item = items[i];
    d = this.location.distance(item.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.id !== item.id) {
        sum.add(item.location);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.sub(this.location);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new Vector();
};

module.exports.Agent = Agent;

