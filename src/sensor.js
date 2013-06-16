/*global exports, Burner */
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
  options.name = options.name || 'Sensor';
  exports.Mover.call(this, options);
}
exports.Utils.extend(Sensor, exports.Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = 'LOVE'] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 2] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
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
 */
Sensor.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Sensor._superClass.prototype.init.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || 'LOVE';
  this.sensitivity = options.sensitivity === undefined ? 2 : options.sensitivity;
  this.width = options.width === undefined ? 7 : options.width;
  this.height = options.height === undefined ? 7 : options.height;
  this.offsetDistance = options.offsetDistance === undefined ? 30 : options.offsetDistance;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [255, 255, 255];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.borderWidth = options.borderWidth === undefined ? 2 : options.borderWidth;
  this.borderStyle = 'solid';
  this.borderColor = [255, 255, 255];
};

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  var check = false, i, max;

  var heat = Burner.System._caches.Heat || {list: []},
      cold = Burner.System._caches.Cold || {list: []},
      predators = Burner.System._caches.Predators || {list: []},
      lights = Burner.System._caches.Light || {list: []},
      oxygen = Burner.System._caches.Oxygen || {list: []},
      food = Burner.System._caches.Food || {list: []};

  // what if cache does not exist?

  if (this.type === 'heat' && heat.list && heat.list.length > 0) {
    for (i = 0, max = heat.list.length; i < max; i++) { // heat
      if (this.isInside(this, heat.list[i], this.sensitivity)) {
        this.target = heat.list[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === 'cold' && cold.list && cold.list.length > 0) {
    for (i = 0, max = cold.list.length; i < max; i++) { // cold
      if (this.isInside(this, cold.list[i], this.sensitivity)) {
        this.target = cold.list[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === 'predator' && predators.list && predators.list.length > 0) {
    for (i = 0, max = predators.list.length; i < max; i += 1) { // predator
      if (this.isInside(this, predators.list[i], this.sensitivity)) {
        this.target = predators.list[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === 'light' && lights.list && lights.list.length > 0) {
    for (i = 0, max = lights.list.length; i < max; i++) { // light
      // check the obj has not been marked as deleted
      if (lights.lookup[lights.list[i].id]) {
        if (this.isInside(this, lights.list[i], this.sensitivity)) {
          this.target = lights.list[i]; // target this stimulator
          this.activated = true; // set activation
          check = true;
        }
      }
    }
  } else if (this.type === 'oxygen' && oxygen.list && oxygen.list.length > 0) {
    for (i = 0, max = oxygen.list.length; i < max; i += 1) { // oxygen
      // check the obj has not been marked as deleted
      if (oxygen.lookup[oxygen.list[i].id]) {
        if (this.isInside(this, oxygen.list[i], this.sensitivity)) {
          this.target = oxygen.list[i]; // target this stimulator
          this.activated = true; // set activation
          check = true;
        }
      }
    }
  } else if (this.type === 'food' && food.list && food.list.length > 0) {
    for (i = 0, max = food.list.length; i < max; i += 1) { // food
      // check the obj has not been marked as deleted
      if (food.lookup[food.list[i].id]) {
        if (this.isInside(this, food.list[i], this.sensitivity)) {
          this.target = food.list[i]; // target this stimulator
          this.activated = true; // set activation
          check = true;
        }
      }
    }
  }
  if (!check) {
    this.target = null;
    this.activated = false;
    this.color = 'transparent';
  } else {
    this.color = this.activatedColor;
  }
  if (this.afterStep) {
    this.afterStep.apply(this);
  }

};

/**
 * Returns a force to apply to an agent when its sensor is activated.
 *
 */
Sensor.prototype.getActivationForce = function(agent) {

  var distanceToTarget, desiredVelocity, m, v, steer;

  switch (this.behavior) {

    /**
     * Steers toward target
     */
    case 'AGGRESSIVE':
      desiredVelocity = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = desiredVelocity.mag();
      desiredVelocity.normalize();

      m = distanceToTarget/agent.maxSpeed;
      desiredVelocity.mult(m);

      desiredVelocity.sub(agent.velocity);
      desiredVelocity.limit(agent.maxSteeringForce);

    return desiredVelocity;

    /**
     * Steers away from the target
     */
    case 'COWARD':
      desiredVelocity = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = desiredVelocity.mag();
      desiredVelocity.normalize();

      m = distanceToTarget/agent.maxSpeed;
      desiredVelocity.mult(-m);

      desiredVelocity.sub(agent.velocity);
      desiredVelocity.limit(agent.maxSteeringForce);

    return desiredVelocity;

    /**
     * Speeds toward target and keeps moving
     */
    case 'LIKES':
      var dvLikes = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvLikes.mag();
      dvLikes.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvLikes.mult(m);

      steer = Burner.Vector.VectorSub(dvLikes, agent.velocity);
      steer.limit(agent.maxSteeringForce);
      return steer;

    /**
     * Arrives at target and remains
     */
    case 'LOVES':
      var dvLoves = Burner.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();

      if (distanceToTarget > this.width) {
        m = distanceToTarget/agent.maxSpeed;
        dvLoves.mult(m);
        steer = Burner.Vector.VectorSub(dvLoves, agent.velocity);
        steer.limit(agent.maxSteeringForce);
        return steer;
      }
      agent.velocity = new Burner.Vector();
      agent.acceleration = new Burner.Vector();
      return new Burner.Vector();

    /**
     * Arrives at target but does not stop
     */
    case 'EXPLORER':

      var dvExplorer = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvExplorer.mult(-m);

      steer = Burner.Vector.VectorSub(dvExplorer, agent.velocity);
      steer.limit(agent.maxSteeringForce * 0.05);
      return steer;

    /**
     * Moves in the opposite direction as fast as possible
     */
    /*case "RUN":
      return this.flee(this.target);*/

    case 'ACCELERATE':
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(agent.minSpeed);

    case 'DECELERATE':
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(-agent.minSpeed);

    default:
      return new Burner.Vector();
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

  if (item.location.x + item.width/2 > container.location.x - container.width/2 - (sensitivity * container.width) &&
    item.location.x - item.width/2 < container.location.x + container.width/2 + (sensitivity * container.width) &&
    item.location.y + item.height/2 > container.location.y - container.height/2 - (sensitivity * container.height) &&
    item.location.y - item.height/2 < container.location.y + container.height/2 + (sensitivity * container.height)) {
    return true;
  }
  return false;
};
exports.Sensor = Sensor;