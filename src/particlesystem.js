/** 
    A module representing a ParticleSystem.
    @module ParticleSystem
 */
 
/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Particle options.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move. 
 * @param {number} [opt_options.lifespan = -1] The number of frames before particle system dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {Object} [opt_options.color = null] Color
 * @param {number} [opt_options.burst = 1] The number of particles to create per frame.
 * @param {Object} [opt_options.particle = A particle at the system's location w random acceleration.] The particle to create. At minimum, should have a location vector. Use this.getLocation to get location of partilce system.
 */
 function ParticleSystem(opt_options) {

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.beforeStep = function () {
   
    var i, max, p;
    
    for (i = 0; i < this.burst; i += 1) {
      p = new exports.Particle(this.particle());
    }
    if (this.lifespan > 0) {
      this.lifespan -= 1;
    } else if (this.lifespan === 0) {
      exports.destroyElement(this.id);
    }
  };
  this.isStatic = options.isStatic || true;
  this.lifespan = options.lifespan || -1;
  this.width = options.width || 0;
  this.height = options.height || 0;
  this.color = options.color || '';
  this.burst = options.burst || 1;
  this.particle = options.particle || function () {
    return {
      location: this.getLocation(),
      acceleration: exports.PVector.create(exports.Utils.getRandomNumber(-4, 4), exports.Utils.getRandomNumber(-4, 4))
    };
  };
}
exports.Utils.inherit(ParticleSystem, exports.Mover);
exports.ParticleSystem = ParticleSystem;    