/*global exports */
/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
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
 * @param {boolean} [opt_options.activatedColor = [200, 200, 200]] The color the sensor will display when activated.
 */
function Sensor(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || 'LOVE';
  this.sensitivity = options.sensitivity === 0 ? 0 : options.sensitivity || 2;
  this.width = options.width === 0 ? 0 : options.width || 7;
  this.height = options.height === 0 ? 0 : options.height || 7;
  this.offsetDistance = options.offsetDistance === 0 ? 0 : options.offsetDistance|| 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [200, 200, 200];
  this.borderWidth = 2;
  this.borderStyle = 'solid';
  this.borderColor = 'white';
  this.borderRadius ='100%';
}
exports.Utils.extend(Sensor, exports.Agent);

Sensor.prototype.name = 'Sensor';

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  var check = false, i, max;

  var heat = exports.Mantle.System._Caches.Heat || {list: []},
      cold = exports.Mantle.System._Caches.Cold || {list: []},
      predators = exports.Mantle.System._Caches.Predators || {list: []},
      lights = exports.Mantle.System._Caches.Light || {list: []},
      oxygen = exports.Mantle.System._Caches.Oxygen || {list: []},
      food = exports.Mantle.System._Caches.Food || {list: []};

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
 * Returns a force to apply to an agentwhen its sensor is activated.
 *
 */
Sensor.prototype.getActivationForce = function(agent) {

  var distanceToTarget, m, v, f, steer;

  switch (this.behavior) {

    /**
     * Steers toward target
     */
    case "AGGRESSIVE":
      return this._seek(this.target);

    /**
     * Steers away from the target
     */
    case "COWARD":
      f = this._seek(this.target);
      return f.mult(-1);

    /**
     * Speeds toward target and keeps moving
     */
    case "LIKES":
      var dvLikes = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvLikes.mag();
      dvLikes.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvLikes.mult(m);

      steer = exports.Vector.VectorSub(dvLikes, agent.velocity);
      steer.limit(agent.maxSteeringForce);
      return steer;

    /**
     * Arrives at target and remains
     */
    case "LOVES":
      var dvLoves = exports.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();

      if (distanceToTarget > this.width) {
        m = distanceToTarget/agent.maxSpeed;
        dvLoves.mult(m);
        steer = exports.Vector.VectorSub(dvLoves, agent.velocity);
        steer.limit(agent.maxSteeringForce);
        return steer;
      }
      agent.velocity = new exports.Vector();
      agent.acceleration = new exports.Vector();
      return new exports.Vector();

    /**
     * Arrives at target but does not stop
     */
    case "EXPLORER":

      var dvExplorer = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvExplorer.mult(-m);

      steer = exports.Vector.VectorSub(dvExplorer, agent.velocity);
      steer.limit(agent.maxSteeringForce * 0.01);
      return steer;

    /**
     * Moves in the opposite direction as fast as possible
     */
    case "RUN":
      return this.flee(this.target);

    case "ACCELERATE":
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(agent.minSpeed);

    case "DECELERATE":
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(-agent.minSpeed);

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

  if (item.location.x + item.width/2 > container.location.x - container.width/2 - (sensitivity * container.width) &&
    item.location.x - item.width/2 < container.location.x + container.width/2 + (sensitivity * container.width) &&
    item.location.y + item.height/2 > container.location.y - container.height/2 - (sensitivity * container.height) &&
    item.location.y - item.height/2 < container.location.y + container.height/2 + (sensitivity * container.height)) {
    return true;
  }
  return false;
};
exports.Sensor = Sensor;