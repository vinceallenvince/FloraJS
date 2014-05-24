/*global Burner */
/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Sensor(opt_options) {
  var options = opt_options || {};

  if (!options || !options.type) {
    throw new Error('Stimulus: options.type is required.');
  }

  options.name = options.name || 'Sensor';
  Mover.call(this, options);
}
Utils.extend(Sensor, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = ''] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 200] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the sensor's parent.
 * @param {number} [opt_options.offsetAngle = 0] The angle of rotation around the vehicle carrying the sensor.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.
 * @param {Array} [opt_options.activatedColor = 255, 255, 255] The color the sensor will display when activated.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = 255, 255, 255] Border color.
 * @param {Function} [opt_options.onConsume] If sensor.behavior == 'CONSUME', sensor calls this function when consumption is complete.
 * @param {Function} [opt_options.onDestroy] If sensor.behavior == 'DESTROY', sensor calls this function when destroyed.
 */
Sensor.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Sensor._superClass.prototype.init.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || function() {};
  this.sensitivity = typeof options.sensitivity === 'undefined' ? 200 : options.sensitivity;
  this.width = typeof options.width === 'undefined' ? 7 : options.width;
  this.height = typeof options.height === 'undefined' ? 7 : options.height;
  this.offsetDistance = typeof options.offsetDistance === 'undefined' ? 30 : options.offsetDistance;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [255, 255, 255];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.borderWidth = typeof options.borderWidth === 'undefined' ? 2 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.onConsume = options.onConsume || null;

  this.activationLocation = new Burner.Vector();
  this._force = new Burner.Vector(); // used as a cache Vector

  this.displayRange = !!options.displayRange;
  if (this.displayRange) {
    this.rangeDisplay = this.createRangeDisplay();
  }

  this.displayConnector = !!options.displayConnector;
};

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  var check = false, i, max, list;

  /**
   * Check if any Simulus objects exist that match this sensor. If so,
   * loop thru the list and check if sensor should activate.
   */
  if (Burner.System._caches[this.type]) {
    list = Burner.System._caches[this.type].list;
    for (i = 0, max = list.length; i < max; i++) { // heat
      if (this.sensorActive(list[i], this.sensitivity)) {

        this.target = list[i]; // target this stimulator
        if (!this.activationLocation.x && !this.activationLocation.y) {
          this.activationLocation.x = this.parent.location.x;
          this.activationLocation.y = this.parent.location.y;
        }
        this.activated = true; // set activation
        this.activatedColor = this.target.color;

        if (this.displayConnector && !this.connector) {
          this.connector = Burner.System.add('Connector', {
            parentA: this,
            parentB: this.target
          });
        }

        if (this.displayConnector && this.connector && this.connector.parentB !== this.target) {
          this.connector.parentB = this.target;
        }

        check = true;
      }
    }
  }

  if (!check) {
    this.target = null;
    this.activated = false;
    this.state = null;
    this.color = 'transparent';
    this.activationLocation.x = null;
    this.activationLocation.y = null;
    if (this.connector) {
      Burner.System.destroyItem(this.connector);
      this.connector = null;
    }
  } else {
    this.color = this.activatedColor;
  }
  if (this.afterStep) {
    this.afterStep.apply(this);
  }
};

/**
 * Creates a RangeDisplay object.
 * @return {Object} A RangeDisplay object.
 */
Sensor.prototype.createRangeDisplay = function() {
  return Burner.System.add('RangeDisplay', {
    sensor: this
  });
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
         if (Flora.Utils.isInside(sensor.parent, target)) {
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
              Burner.System.destroyItem(target);
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
         if (Flora.Utils.isInside(sensor.parent, target)) {

            Burner.System.add('ParticleSystem', {
              location: new Burner.Vector(target.location.x, target.location.y),
              lifespan: 20,
              borderColor: target.borderColor,
              startColor: target.color,
              endColor: target.color
            });
            Burner.System.destroyItem(target);

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
        var desiredVelocity = Burner.Vector.VectorSub(target.location, this.location);

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
        var desiredVelocity = Burner.Vector.VectorSub(target.location, this.location);

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
        var desiredVelocity = Burner.Vector.VectorSub(target.location, this.location);

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
          desiredVelocity = Burner.Vector.VectorSub(midpoint, this.location);

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
          desiredVelocity = Burner.Vector.VectorSub(target.location, this.location);

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
        var desiredVelocity = Burner.Vector.VectorSub(target.location, this.location);

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
        var desiredVelocity = Burner.Vector.VectorSub(target.location, this.location);

        // get total distance
        var distanceToTarget = desiredVelocity.mag();

        if (distanceToTarget > this.width / 2) {

          // normalize so we can adjust
          desiredVelocity.normalize();

          //
          var m = distanceToTarget / this.maxSpeed;

          desiredVelocity.mult(m);

          var steer = Burner.Vector.VectorSub(desiredVelocity, this.velocity);
          steer.limit(this.maxSteeringForce * 0.25);
          return steer;
        }

        this.angle = Flora.Utils.radiansToDegrees(Math.atan2(desiredVelocity.y, desiredVelocity.x));
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
Sensor.prototype.sensorActive = function(target) {

  // Two circles intersect if distance bw centers is less than the sum of the radii.
  var distance = Burner.Vector.VectorDistance(this.location, target.location),
      sensorRadius = this.sensitivity / 2,
      targetRadius = (target.width / 2) + target.boxShadowSpread;

  return distance < sensorRadius + targetRadius;
};
