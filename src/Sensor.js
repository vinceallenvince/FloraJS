var Mover = require('./Mover').Mover,
    System = require('Burner').System,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Sensor(opt_options) {
  Mover.call(this);
}
Utils.extend(Sensor, Mover);

/**
 * Initializes Sensor.
 * @param  {Object} world An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 * @param {string} [opt_options.type = ''] The type of stimulus that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.targetClass = 'Stimulus'] The class of Item that can activate this sensor. eg. 'Stimulus', 'Agent', 'Sheep', 'Wolf'
 * @param {string} [opt_options.behavior = ''] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 200] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 7] Width.
 * @param {number} [opt_options.height = 7] Height.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the sensor's parent.
 * @param {number} [opt_options.offsetAngle = 0] The angle of rotation around the vehicle carrying the sensor.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.
 * @param {Array} [opt_options.activatedColor = [255, 255, 255]] The color the sensor will display when activated.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {Function} [opt_options.onConsume = null] If sensor.behavior == 'CONSUME', sensor calls this function when consumption is complete.
 * @param {Function} [opt_options.onDestroy = null] If sensor.behavior == 'DESTROY', sensor calls this function when target is destroyed.
 */
Sensor.prototype.init = function(world, opt_options) {
  Sensor._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.type = options.type || '';
  this.targetClass = options.targetClass || 'Stimulus';
  this.behavior = options.behavior || function() {};
  this.sensitivity = typeof options.sensitivity !== 'undefined' ? options.sensitivity : 200;
  this.width = typeof options.width !== 'undefined' ? options.width : 7;
  this.height = typeof options.height !== 'undefined' ? options.height : 7;
  this.offsetDistance = typeof options.offsetDistance !== 'undefined' ? options.offsetDistance : 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = typeof options.opacity !== 'undefined' ? options.opacity : 0.75;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [255, 255, 255];
  this.borderRadius = typeof options.borderRadius !== 'undefined' ? options.borderRadius : 100;
  this.borderWidth = typeof options.borderWidth !== 'undefined' ? options.borderWidth : 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.onConsume = options.onConsume || null;
  this.onDestroy = options.onDestroy || null;
  this.rangeDisplayBorderStyle = options.rangeDisplayBorderStyle || false;
  this.rangeDisplayBorderDefaultColor = options.rangeDisplayBorderDefaultColor || false;
  this.parent = options.parent || null;
  this.displayRange = !!options.displayRange;
  if (this.displayRange) {
    this.rangeDisplay = System.add('RangeDisplay', {
      sensor: this,
      rangeDisplayBorderStyle: this.rangeDisplayBorderStyle,
      rangeDisplayBorderDefaultColor: this.rangeDisplayBorderDefaultColor
    });
  }
  this.displayConnector = !!options.displayConnector;

  this.activationLocation = new Vector();
  this._force = new Vector(); // used as a cache Vector
  this.visibility = 'hidden';
};

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  this.visibility = 'visible';

  if (this.parent) { // parenting

    if (this.offsetDistance) {

      r = this.offsetDistance; // use angle to calculate x, y
      theta = Utils.degreesToRadians(this.parent.angle + this.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      this.location.x = this.parent.location.x;
      this.location.y = this.parent.location.y;
      this.location.add(new Vector(x, y)); // position the child

      if (this.pointToParentDirection) {
        this.angle = Utils.radiansToDegrees(Math.atan2(this.parent.velocity.y, this.parent.velocity.x));
      }
    } else {
      this.location.x = this.parent.location.x;
      this.location.y = this.parent.location.y;
    }
  }

  var check = false;

  /**
   * Check if any Stimulus objects exist that match this sensor. If so,
   * loop thru the list and check if sensor should activate.
   */

  var list = System.getAllItemsByAttribute('type', this.type, this.targetClass);

  for (var i = 0, max = list.length; i < max; i++) {

    if (this._sensorActive(list[i], this.sensitivity)) {

      this.target = list[i]; // target this stimulator
      if (!this.activationLocation.x && !this.activationLocation.y) {
        this.activationLocation.x = this.parent.location.x;
        this.activationLocation.y = this.parent.location.y;
      }
      this.activated = true; // set activation
      this.activatedColor = this.target.color;

      if (this.displayConnector && !this.connector) {
        this.connector = System.add('Connector', {
          parentA: this,
          parentB: this.target
        });
      }

      if (this.displayConnector && this.connector && this.connector.parentB !== this.target) {
        this.connector.parentA = this;
        this.connector.parentB = this.target;
      }

      check = true;
    }
  }


  if (!check) {
    this.target = null;
    this.activated = false;
    this.state = null;
    this.color = [255, 255, 255];
    this.activationLocation.x = null;
    this.activationLocation.y = null;
    if (this.connector) {
      System.remove(this.connector);
      this.connector = null;
    }
  } else {
    this.color = this.activatedColor;
  }

  this.afterStep.call(this);
};



Sensor.prototype.getBehavior = function() {

  var i, iMax, j, jMax;

  switch (this.behavior) {

    case 'CONSUME':
      return function(sensor, target) {

        /**
         * CONSUME
         * If inside the target, target shrinks.
         */
         if (Utils.isInside(sensor.parent, target)) {

            if (target.width > 2) {
              target.width *= 0.95;
              if (!sensor.parent[target.type + 'Level']) {
                sensor.parent[target.type + 'Level'] = 0;
              }
              sensor.parent[target.type + 'Level'] += 1;
            } else {
              if (sensor.onConsume && !target.consumed) {
                target.consumed = true;
                sensor.onConsume.call(this, sensor, target);
              }
              System.remove(target);
              return;
            }
            if (target.height > 1) {
              target.height *= 0.95;
            }
            if (target.borderWidth > 0) {
              target.borderWidth *= 0.95;
            }
            if (target.boxShadowSpread > 0) {
              target.boxShadowSpread *= 0.95;
            }
         }
      };

    case 'DESTROY':
      return function(sensor, target) {

        /**
         * DESTROY
         * If inside the target, ssytem destroys target.
         */
         if (Utils.isInside(sensor.parent, target)) {

            System.add('ParticleSystem', {
              location: new Vector(target.location.x, target.location.y),
              lifespan: 20,
              borderColor: target.borderColor,
              startColor: target.color,
              endColor: target.color
            });
            System.remove(target);

            if (sensor.onDestroy) {
              sensor.onDestroy.call(this, sensor, target);
            }
         }
      };

    case 'LIKES':
      return function(sensor, target) {

        /**
         * LIKES
         * Steer toward target at max speed.
         */

        // desiredVelocity = difference in target location and agent location
        var desiredVelocity = Vector.VectorSub(target.location, this.location);

        // limit to the maxSteeringForce
        desiredVelocity.limit(this.maxSteeringForce);

        return desiredVelocity;
      };

    case 'COWARD':
      return function(sensor, target) {

        /**
         * COWARD
         * Steer away from target at max speed.
         */

        // desiredVelocity = difference in target location and agent location
        var desiredVelocity = Vector.VectorSub(target.location, this.location);

        // reverse the force
        desiredVelocity.mult(-0.0075);

        // limit to the maxSteeringForce
        desiredVelocity.limit(this.maxSteeringForce);

        return desiredVelocity;
      };

    case 'AGGRESSIVE':
      return function(sensor, target) {

        /**
         * AGGRESSIVE
         * Steer and arrive at target. Aggressive agents will hit their target.
         */

        // velocity = difference in location
        var desiredVelocity = Vector.VectorSub(target.location, this.location);

        // get distance to target
        var distanceToTarget = desiredVelocity.mag();

        if (distanceToTarget < this.width * 2) {

          // normalize desiredVelocity so we can adjust. ie: magnitude = 1
          desiredVelocity.normalize();

          // as agent gets closer, velocity decreases
          var m = distanceToTarget / this.maxSpeed;

          // extend desiredVelocity vector
          desiredVelocity.mult(m);

        }

        // subtract current velocity from desired to create a steering force
        desiredVelocity.sub(this.velocity);

        // limit to the maxSteeringForce
        desiredVelocity.limit(this.maxSteeringForce);

        return desiredVelocity;

      };

    case 'CURIOUS':
      return function(sensor, target) {

        /**
         * CURIOUS
         * Steer and arrive at midpoint bw target location and agent location.
         * After arriving, reverse direction and accelerate to max speed.
         */

        var desiredVelocity, distanceToTarget;

        if (sensor.state !== 'running') {

          var midpoint = sensor.activationLocation.midpoint(target.location);

          // velocity = difference in location
          desiredVelocity = Vector.VectorSub(midpoint, this.location);

          // get distance to target
          distanceToTarget = desiredVelocity.mag();

          // normalize desiredVelocity so we can adjust. ie: magnitude = 1
          desiredVelocity.normalize();

          // as agent gets closer, velocity decreases
          var m = distanceToTarget / this.maxSpeed;

          // extend desiredVelocity vector
          desiredVelocity.mult(m);

          // subtract current velocity from desired to create a steering force
          desiredVelocity.sub(this.velocity);

          if (m < 0.5) {
            sensor.state = 'running';
          }
        } else {

          // note: desired velocity when running is the difference bw target and this agent
          desiredVelocity = Vector.VectorSub(target.location, this.location);

          // reverse the force
          desiredVelocity.mult(-1);

        }

        // limit to the maxSteeringForce
        desiredVelocity.limit(this.maxSteeringForce);

        return desiredVelocity;
      };

    case 'EXPLORER':
      return function(sensor, target) {

        /**
         * EXPLORER
         * Gets close to target but does not change velocity.
         */

        // velocity = difference in location
        var desiredVelocity = Vector.VectorSub(target.location, this.location);

        // get distance to target
        var distanceToTarget = desiredVelocity.mag();

        // normalize desiredVelocity so we can adjust. ie: magnitude = 1
        desiredVelocity.normalize();

        // as agent gets closer, velocity decreases
        var m = distanceToTarget / this.maxSpeed;

        // extend desiredVelocity vector
        desiredVelocity.mult(-m);

        // subtract current velocity from desired to create a steering force
        desiredVelocity.sub(this.velocity);

        // limit to the maxSteeringForce
        desiredVelocity.limit(this.maxSteeringForce * 0.05);

        // add motor speed
        this.motorDir.x = this.velocity.x;
        this.motorDir.y = this.velocity.y;
        this.motorDir.normalize();
        if (this.velocity.mag() > this.motorSpeed) { // decelerate to defaultSpeed
          this.motorDir.mult(-this.motorSpeed);
        } else {
          this.motorDir.mult(this.motorSpeed);
        }

        desiredVelocity.add(this.motorDir);

        return desiredVelocity;

      };

    case 'LOVES':
      return function(sensor, target) {

        /**
         * LOVES
         * Steer and arrive at target.
         */

        // velocity = difference in location
        var desiredVelocity = Vector.VectorSub(target.location, this.location);

        // get total distance
        var distanceToTarget = desiredVelocity.mag();

        if (distanceToTarget > this.width / 2) {

          // normalize so we can adjust
          desiredVelocity.normalize();

          //
          var m = distanceToTarget / this.maxSpeed;

          desiredVelocity.mult(m);

          var steer = Vector.VectorSub(desiredVelocity, this.velocity);
          steer.limit(this.maxSteeringForce * 0.25);
          return steer;
        }

        this.angle = Utils.radiansToDegrees(Math.atan2(desiredVelocity.y, desiredVelocity.x));

        this._force.x = 0;
        this._force.y = 0;
        return this._force;
      };

    case 'ACCELERATE':
      return function(sensor, target) {

        /**
         * ACCELERATE
         * Accelerate to max speed.
         */

        this._force.x = this.velocity.x;
        this._force.y = this.velocity.y;
        return this._force.mult(0.25);
      };

    case 'DECELERATE':
      return function(sensor, target) {

        /**
         * DECELERATE
         * Decelerate to min speed.
         */

        this._force.x = this.velocity.x;
        this._force.y = this.velocity.y;
        return this._force.mult(-0.25);
      };
  }

};

/**
 * Checks if a sensor can detect a stimulus object. Note: Assumes
 * target is a circle.
 *
 * @param {Object} target The stimulator.
 * @return {Boolean} true if sensor's range intersects target.
 */
Sensor.prototype._sensorActive = function(target) {

  // Two circles intersect if distance bw centers is less than the sum of the radii.
  var distance = Vector.VectorDistance(this.location, target.location),
      sensorRadius = this.sensitivity / 2,
      targetRadius = (target.width / 2) + target.boxShadowSpread;

  return distance < sensorRadius + targetRadius;
};

module.exports.Sensor = Sensor;
