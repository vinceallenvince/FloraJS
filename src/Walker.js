var Item = require('Burner').Item,
    Mover = require('./Mover').Mover,
    SimplexNoise = require('./SimplexNoise').SimplexNoise,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

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
 * @param {string} [opt_options.name = 'Walker'] Name
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and perlin = true, object will avoid world edges.
 * @param {number} [opt_options.maxSpeed = 1] maxSpeed.
 * @param {boolean} [opt_options.perlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {number} [opt_options.perlinSpeed = 0.005] If perlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when perlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when perlin = true.
 * @param {number} [opt_options.perlinOffsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.perlinOffsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {string|Array} [opt_options.color = 255, 150, 50] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = 255, 255, 255] Border color.
 * @param {string} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 */
function Walker(opt_options) {
  Mover.call(this);
  var options = opt_options || {};
  this.name = options.name || 'Walker';
  this.width = typeof options.width === 'undefined' ? 10 : options.width;
  this.height = typeof options.height === 'undefined' ? 10 : options.height;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 1 : options.maxSpeed;
  this.perlin = typeof options.perlin === 'undefined' ? true : options.perlin;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = typeof options.perlinAccelLow === 'undefined' ? -0.075 : options.perlinAccelLow;
  this.perlinAccelHigh = typeof options.perlinAccelHigh === 'undefined' ? 0.075 : options.perlinAccelHigh;
  this.perlinOffsetX = typeof options.perlinOffsetX === 'undefined' ? Math.random() * 10000 : options.perlinOffsetX;
  this.perlinOffsetY = typeof options.perlinOffsetY === 'undefined' ? Math.random() * 10000 : options.perlinOffsetY;
  this.color = options.color || [255, 150, 50];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? 0 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 0 : options.zIndex;

  this._randomVector = new Vector();
}
Utils.extend(Walker, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.

 */
Walker.prototype.init = function(world, opt_options) {
  Walker._superClass.init.call(this, world, opt_options);
};

/**
 * If walker uses perlin noise, updates acceleration based on noise space. If walker
 * is a random walker, updates location based on random location.
 */
Walker.prototype.applyAdditionalForces = function() {

  // walker use either perlin noise or random walk
  if (this.perlin) {

    this.perlinTime += this.perlinSpeed;

    if (this.remainsOnScreen) {
      this.acceleration = new Vector();
      this.velocity = new Vector();
      this.location.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0), -1, 1, 0, this.world.width);
      this.location.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY), -1, 1, 0, this.world.height);
    } else {
      this.acceleration.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.acceleration.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    }
    return;
  }

  // point to a random angle and move toward it
  this._randomVector.x = 1;
  this._randomVector.y = 1;
  this._randomVector.normalize();
  this._randomVector.rotate(Utils.degreesToRadians(Utils.getRandomNumber(0, 359)));
  this._randomVector.mult(this.maxSpeed);
  this.applyForce(this._randomVector);
};

module.exports.Walker = Walker;
