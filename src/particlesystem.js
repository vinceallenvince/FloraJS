/*global exports */
/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] ParticleSystem options.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move.
 * @param {number} [opt_options.lifespan = 1000] The max life of the system. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, system is destroyed.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {number} [opt_options.burst = 1] The number of particles to create per burst.
 * @param {number} [opt_options.burstRate = 1] The number of frames between bursts. Lower values = more particles.
 * @param {Object} [opt_options.emitRadius = 3] The ParticleSystem adds this offset to the location of the Particles it creates.
 * @param {Array} [opt_options.startColor = [100, 20, 20]] The starting color of the particle's palette range.
 * @param {Array} [opt_options.endColor = [255, 0, 0]] The ending color of the particle's palette range.
 * @param {Object} [opt_options.particleOptions] A map of options for particles created by system.
 * @param {string|number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {string} [opt_options.borderRadius = '0%'] Border radius.
 */
function ParticleSystem(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || 1000;
  this.life = options.life === 0 ? 0 : options.life || 0;
  this.width = options.width === 0 ? 0 : options.width || 0;
  this.height = options.height === 0 ? 0 : options.height || 0;
  this.burst = options.burst === 0 ? 0 : options.burst || 1;
  this.burstRate = options.burstRate === 0 ? 0 : options.burstRate || 4;
  this.emitRadius = options.emitRadius === 0 ? 0 : options.emitRadius || 3;
  this.startColor = options.startColor || [100, 20, 20];
  this.endColor = options.endColor || [255, 0, 0];
  this.particleOptions = options.particleOptions || {
    width : 15,
    height : 15,
    lifespan : 50,
    borderRadius : '100%',
    checkEdges : false,
    acceleration: null,
    velocity: null,
    location: null,
    maxSpeed: 3,
    fade: true
  };
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || '0%';

  var pl = new exports.ColorPalette();
  pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: this.startColor,
    endColor: this.endColor
  });

  this.beforeStep = function () {

    var location, offset,
        acceleration = this.particleOptions.acceleration,
        maxSpeed = this.particleOptions.maxSpeed;

    if (this.life < this.lifespan) {
      this.life += 1;
    } else if (this.lifespan !== -1) {
      exports.Burner.System.destroyElement(this);
      return;
    }

    if (this.clock % this.burstRate === 0) {

      location = this.getLocation(); // use the system's location
      offset = new exports.Vector(1, 1); // get the emit radius
      offset.normalize();
      offset.mult(this.emitRadius); // expand emit randius in a random direction
      offset.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
      location.add(offset);

      for (var i = 0; i < this.burst; i++) {
        this.particleOptions.world = this.world;
        this.particleOptions.life = 0;
        this.particleOptions.color = pl.getColor();
        this.particleOptions.acceleration = new exports.Vector(1, 1);
        this.particleOptions.acceleration.normalize();
        this.particleOptions.acceleration.mult(maxSpeed ? maxSpeed : 3);
        this.particleOptions.acceleration.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
        this.particleOptions.velocity = new exports.Vector();
        this.particleOptions.location = ParticleSystem.getParticleLocation(location);

        exports.Burner.System.add('Particle', this.particleOptions);
      }
    }
  };
}
exports.Utils.extend(ParticleSystem, exports.Agent);

/**
 * Returns a self-executing function that is executed
 * when particle is initialized. The function retains a
 * reference to the particle system's location.
 *
 * @returns {Function} A function that self-executes and
 *    returns a reference to the particle system's location.
 */
ParticleSystem.getParticleLocation = function(location) {
  return (function() {
    return new exports.Vector(location.x, location.y);
  })();
};

ParticleSystem.prototype.name = 'ParticleSystem';

exports.ParticleSystem = ParticleSystem;
