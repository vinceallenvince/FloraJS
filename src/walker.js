/*global Burner, document */
/**
 * Creates a new Walker.
 *
 * Walkers have no seeking, steering or directional behavior and just randomly
 * explore their World. Use Walkers to create wandering objects or targets
 * for Agents to seek. They are not affected by gravity or friction.
 *
 * @constructor
 * @extends Mover
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Walker(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Walker';
  Mover.call(this, options);
}
Utils.extend(Walker, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {boolean} [opt_options.isPerlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and isPerlin = true, object will avoid world edges.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {boolean} [opt_options.random = false] Set to true for walker to move in a random direction.
 * @param {number} [opt_options.randomRadius = 100] If isRandom = true, walker will look for a new location each frame based on this radius.
 * @param {string|Array} [opt_options.color = [255, 150, 50]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {string} [opt_options.borderRadius = 100] Border radius.
 * @param {boolean} [opt_options.avoidWorldEdges = false] If set to true, object steers away from
 *    world boundaries.
 * @param {number} [opt_options.avoidWorldEdgesStrength = 0] The distance threshold for object
 *    start steering away from world boundaries.
 */
Walker.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.width = options.width === undefined ? 10 : options.width;
  this.height = options.height === undefined ? 10 : options.height;
  this.perlin = options.perlin === undefined ? true : options.perlin;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.perlinSpeed = options.perlinSpeed === undefined ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow === undefined ? -0.075 : options.perlinAccelLow;
  this.perlinAccelHigh = options.perlinAccelHigh === undefined ? 0.075 : options.perlinAccelHigh;
  this.offsetX = options.offsetX === undefined ? Math.random() * 10000 : options.offsetX;
  this.offsetY = options.offsetY === undefined ? Math.random() * 10000 : options.offsetY;
  this.random = !!options.random;
  this.randomRadius = options.randomRadius === undefined ? 100 : options.randomRadius;
  this.color = options.color || [255, 150, 50];
  this.borderWidth = options.borderWidth === undefined ? 2 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.avoidWorldEdges = !!options.avoidWorldEdges;
  this.avoidWorldEdgesStrength = options.avoidWorldEdgesStrength === undefined ?
      50 : options.avoidWorldEdgesStrength;
};

/**
 * If walker uses perlin noise, updates acceleration based on noise space. If walker
 * is a random walker, updates location based on random location.
 */
Walker.prototype.applyForces = function() {

  // walker use either perlin noise or random walk
  if (this.perlin) {

    this.perlinTime += this.perlinSpeed;

    if (this.remainsOnScreen) {
      this.acceleration = new Burner.Vector();
      this.velocity = new Burner.Vector();
      this.location.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, 0, this.world.bounds[1]);
      this.location.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, 0, this.world.bounds[2]);
    } else {
      this.acceleration.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.acceleration.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    }

  } else if (this.random) {
    this.seekTarget = { // find a random point and steer toward it
      location: Burner.Vector.VectorAdd(this.location, new Burner.Vector(Utils.getRandomNumber(-this.randomRadius, this.randomRadius), Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
    };
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.avoidWorldEdges) {
    this._checkAvoidEdges();
  }
};
