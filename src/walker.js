/** 
    A module representing Walker.
    @module Walker
 */

/**
 * Creates a new Walker.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Walker options.
 * @param {string} [opt_options.className = 'walker'] The corresponding DOM element's class name.
 * @param {boolean} [opt_options.isPerlin = false] If set to true, object will use Perlin Noise to calculate its location.
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and isPerlin = true, object will avoid world edges.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {boolean} [opt_options.isRandom = false] Set to true for walker to move in a random direction.
 * @param {number} [opt_options.isRandom = 100] If isRandom = true, walker will look for a new location each frame based on this radius.
 * @param {boolean} [opt_options.isHarmonic = false] If set to true, walker will move using harmonic motion.
 * @param {Object} [opt_options.isHarmonic = {x: 6, y: 6}] If isHarmonic = true, sets the motion's amplitude.
 * @param {Object} [opt_options.harmonicPeriod = {x: 150, y: 150}] If isHarmonic = true, sets the motion's period.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {Object} [opt_options.color = {r: 255, g: 150, b: 50}] The object's color.
 * @param {number} [opt_options.maxSpeed = 30] Maximum speed
 * @param {boolean} [opt_options.wrapEdges = false] Set to true to set the object's location to the opposite side of the world if the object moves outside the world's bounds.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.  
 */
function Walker(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);
  
  this.isPerlin = options.isPerlin || false;
  this.remainsOnScreen = options.remainsOnScreen || false;
  this.perlinSpeed = options.perlinSpeed || 0.005;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow || -0.075;
  this.perlinAccelHigh = options.perlinAccelHigh || 0.075;
  this.offsetX = options.offsetX || Math.random() * 10000;
  this.offsetY = options.offsetY || Math.random() * 10000;   
  this.isRandom = options.isRandom || false;
  this.randomRadius = options.randomRadius || 100;
  this.isHarmonic = options.isHarmonic || false;
  this.harmonicAmplitude = options.harmonicAmplitude || exports.PVector.create(6, 6);
  this.harmonicPeriod = options.harmonicPeriod || exports.PVector.create(150, 150);    
  this.width = options.width || 10;
  this.height = options.height || 10;     
  this.color = options.color || {r: 255, g: 150, b: 50};   
  this.maxSpeed = options.maxSpeed || 30;
  this.wrapEdges = options.wrapEdges || false;
  this.isStatic = options.isStatic || false;
}
exports.Utils.inherit(Walker, exports.Mover);


/**
 * Called every frame, step() updates the instance's properties.
 */     
Walker.prototype.step = function () {

  'use strict';

  var world = exports.world,
      friction;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    if (this.isPerlin) {
      
      this.perlinTime += this.perlinSpeed;

      if (this.remainsOnScreen) {
        this.acceleration = exports.PVector.create(0, 0);
        this.velocity = exports.PVector.create(0, 0);
        this.location.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, 0, exports.world.width);
        this.location.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, 0, exports.world.height);
      } else {
        this.acceleration.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
        this.acceleration.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      }

    } else {
      
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
    }
    
    if (this.isHarmonic) {
      this.velocity.x = this.harmonicAmplitude.x * Math.cos((Math.PI * 2) * exports.world.clock / this.harmonicPeriod.x);
      this.velocity.y = this.harmonicAmplitude.y * Math.cos((Math.PI * 2) * exports.world.clock / this.harmonicPeriod.y);
    }

    if (this.isRandom) {
      this.target = { // find a random point and steer toward it
        location: exports.PVector.PVectorAdd(this.location, exports.PVector.create(exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius), exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
      };
    }

    if (this.target) { // follow target
      this.applyForce(this.seek(this.target));
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

    this.acceleration.mult(0); // reset acceleration
  }
};  
exports.Walker = Walker;