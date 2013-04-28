/*global exports, document */
/**
 * Creates a new Agent.
 *
 * Agents can follow the mouse.
 * Agents can seek targets.
 * Agents can flock.
 *
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
 * @param {number} [opt_options.maxSteeringForce = 10] Set the maximum strength of any steering force.
 * @param {boolean} [opt_options.seekTarget = null] An object to seek.
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {array} [opt_options.sensors = []] A list of sensors attached to this object.
 * @param {string|Array} [opt_options.color = [197, 177, 115]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [167, 219, 216]] Border color.
 * @param {string|number} [opt_options.borderRadius = null] Border radius.
 * @param {string} [opt_options.borderTopLeftRadius = '0'] Border top left radius.
 * @param {string} [opt_options.borderTopRightRadius = '100%'] Border top right radius.
 * @param {string} [opt_options.borderBottomRightRadius = '100%'] Border bottom right radius.
 * @param {string} [opt_options.borderBottomLeftRadius = '0'] Border bottom left radius.
 *
 * @constructor
 * @extends Mover
 */
function Agent(opt_options) {

  var options;

  opt_options.name = this.name;
  exports.Mover.call(this, opt_options);

  options = opt_options || {};

  this.followMouse = !!options.followMouse;
  this.maxSteeringForce = options.maxSteeringForce || 10;
  this.seekTarget = options.seekTarget || null;
  this.flocking = !!options.flocking;
  this.desiredSeparation = options.desiredSeparation === 0 ? 0 : options.desiredSeparation || this.width * 2;
  this.separateStrength = options.separateStrength === 0 ? 0 : options.separateStrength || 0.3;
  this.alignStrength = options.alignStrength === 0 ? 0 : options.alignStrength || 0.2;
  this.cohesionStrength = options.cohesionStrength === 0 ? 0 : options.cohesionStrength || 0.1;
  this.flowField = options.flowField || null;
  this.sensors = options.sensors || [];

  this.color = options.color || [197, 177, 115];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || null;
  this.borderTopLeftRadius = options.borderTopLeftRadius || '0';
  this.borderTopRightRadius = options.borderTopRightRadius || '0';
  this.borderBottomRightRadius = options.borderBottomRightRadius || '0';
  this.borderBottomLeftRadius = options.borderBottomLeftRadius || '0';

  //

  this.separateSumForceVector = new exports.Vector(); // used in Agent.separate()
  this.alignSumForceVector = new exports.Vector(); // used in Agent.align()
  this.cohesionSumForceVector = new exports.Vector(); // used in Agent.cohesion()
  this.followTargetVector = new exports.Vector(); // used in Agent.applyForces()
  this.followDesiredVelocity = new exports.Vector(); // used in Agent.follow()

}
exports.Utils.extend(Agent, exports.Mover);

Agent.prototype.name = 'Agent';

/**
 * Applies Agent-specific forces.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.applyForces = function() {

  var i, max, sensorActivated, dir, sensor, r, theta, x, y,
      liquids = exports.Burner.System._Caches.Liquid,
      attractors = exports.Burner.System._Caches.Attractor,
      repellers = exports.Burner.System._Caches.Repeller,
      heat = exports.Burner.System._Caches.Heat;

  if (liquids && liquids.list.length > 0) { // liquid
    for (i = 0, max = liquids.list.length; i < max; i += 1) {
      if (this.id !== liquids.list[i].id && exports.Utils.isInside(this, liquids.list[i])) {
        this.applyForce(this.drag(liquids.list[i]));
      }
    }
  }

  if (attractors && attractors.list.length > 0) { // attractor
    for (i = 0, max = attractors.list.length; i < max; i += 1) {
      if (this.id !== attractors.list[i].id) {
        this.applyForce(this.attract(attractors.list[i]));
      }
    }
  }

  if (repellers && repellers.list.length > 0) { // attractor
    for (i = 0, max = repellers.list.length; i < max; i += 1) {
      if (this.id !== repellers.list[i].id) {
        this.applyForce(this.attract(repellers.list[i]));
      }
    }
  }

  if (this.sensors.length > 0) { // Sensors
    for (i = 0, max = this.sensors.length; i < max; i += 1) {

      sensor = this.sensors[i];

      r = sensor.offsetDistance; // use angle to calculate x, y
      theta = exports.Utils.degreesToRadians(this.angle + sensor.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      sensor.location.x = this.location.x;
      sensor.location.y = this.location.y;
      sensor.location.add(new exports.Vector(x, y)); // position the sensor

      if (i > 0) {
        sensor.visibility = 'hidden';
      }

      if (sensor.activated) {
        this.applyForce(sensor.getActivationForce(this));
        sensorActivated = true;
      }

    }
  }

  /**
   * If no sensors were activated and this.motorSpeed != 0,
   * apply a force in the direction of the current velocity.
   */
  if (!sensorActivated && this.motorSpeed) {
    dir = exports.Utils.clone(this.velocity);
    dir.normalize();
    if (this.velocity.mag() > this.motorSpeed) { // decelerate to defaultSpeed
      dir.mult(-this.motorSpeed);
    } else {
      dir.mult(this.motorSpeed);
    }
    this.applyForce(dir); // constantly applies a force
  }

  if (this.followMouse) { // follow mouse
    var t = {
      location: new exports.Vector(exports.Burner.System.mouse.location.x,
          exports.Burner.System.mouse.location.y)
    };
    this.applyForce(this._seek(t));
  }

  if (this.seekTarget) { // seek target
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.flowField) { // follow flow field
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

  }

  if (this.flocking) {
    this.flock(exports.Burner.System.getAllElementsByName('Agent'));
  }

  return this.acceleration;
};

/**
 * Calculates a steering force to apply to an object following another object.
 * Agents with flow fields will use this method to calculate a steering force.
 *
 * @param {Object} target The object to follow.
 * @returns {Object} The force to apply.
 */
Agent.prototype.follow = function(target) {

  this.followDesiredVelocity.x = target.location.x;
  this.followDesiredVelocity.y = target.location.y;

  this.followDesiredVelocity.mult(this.maxSpeed);
  this.followDesiredVelocity.sub(this.velocity);
  this.followDesiredVelocity.limit(this.maxSteeringForce);

  return this.followDesiredVelocity;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.flock = function(elements) {

  this.applyForce(this.separate(elements).mult(this.separateStrength));
  this.applyForce(this.align(elements).mult(this.alignStrength));
  this.applyForce(this.cohesion(elements).mult(this.cohesionStrength));
  return this.acceleration;
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to avoid all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.separate = function(elements) {

  var i, max, element, diff, d,
  sum, count = 0, steer;

  this.separateSumForceVector.x = 0;
  this.separateSumForceVector.y = 0;
  sum = this.separateSumForceVector;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    if (this.className === element.className && this.id !== element.id) {

      d = this.location.distance(element.location);

      if ((d > 0) && (d < this.desiredSeparation)) {
        diff = exports.Vector.VectorSub(this.location, element.location);
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
  return new exports.Vector();
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to align with all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.align = function(elements) {

  var i, max, element, d,
    neighbordist = this.width * 2,
    sum, count = 0, steer;

  this.alignSumForceVector.x = 0;
  this.alignSumForceVector.y = 0;
  sum = this.alignSumForceVector;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    d = this.location.distance(element.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.className === element.className && this.id !== element.id) {
        sum.add(element.velocity);
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
  return new exports.Vector();
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to stay close to all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.cohesion = function(elements) {

  var i, max, element, d,
    neighbordist = 10,
    sum, count = 0, desiredVelocity, steer;

  this.cohesionSumForceVector.x = 0;
  this.cohesionSumForceVector.y = 0;
  sum = this.cohesionSumForceVector;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    d = this.location.distance(element.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.className === element.className && this.id !== element.id) {
        sum.add(element.location);
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
  return new exports.Vector();
};

/**
 * Returns this object's location.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getLocation = function (type) {

  if (!type) {
    return new exports.Vector(this.location.x, this.location.y);
  } else if (type === 'x') {
    return this.location.x;
  } else if (type === 'y') {
    return this.location.y;
  }
};

/**
 * Returns this object's velocity.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's velocity.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getVelocity = function (type) {

  if (!type) {
    return new exports.Vector(this.location.x, this.location.y);
  } else if (type === 'x') {
    return this.velocity.x;
  } else if (type === 'y') {
    return this.velocity.y;
  }
};
exports.Agent = Agent;
