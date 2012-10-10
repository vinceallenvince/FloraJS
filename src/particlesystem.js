/*global exports */
/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Particle options.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move.
 * @param {number} [opt_options.lifespan = -1] The number of frames before particle system dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {number} [opt_options.burst = 1] The number of particles to create per burst.
 * @param {number} [opt_options.burstRate = 1] The number of frames between bursts. Lower values = more particles.
 * @param {Object} [opt_options.particle = A particle at the system's location w random acceleration.] The particle to create. At minimum, should have a location vector. Use this.getLocation to get location of partilce system.
 */
 function ParticleSystem(opt_options) {

  'use strict';

  var options = opt_options || {},
      c = exports.defaultColors.getColor('heat'), // gets the heat start and end colors
      f = exports.defaultColors.getColor('food'), // gets the food start and end colors
      pl = new exports.ColorPalette();

  exports.Agent.call(this, options);

  pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: c.startColor,
    endColor: c.endColor
  }).addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: f.startColor,
    endColor: f.endColor
  });

  this.beforeStep = function () {

    var i, max, p;

    if (this.world.clock % this.burstRate === 0) {
      for (i = 0; i < this.burst; i += 1) {
        p = new exports.Particle(this.particle());
      }
    }
    if (this.lifespan > 0) {
      this.lifespan -= 1;
    } else if (this.lifespan === 0) {
      exports.elementList.destroyElement(this.id);
    }
  };
  this.lifespan = options.lifespan || -1;
  this.width = options.width === 0 ? 0 : options.width || 0;
  this.height = options.height === 0 ? 0 : options.height || 0;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.burst = options.burst === 0 ? 0 : options.burst || 1;
  this.burstRate = options.burstRate === 0 ? 0 : options.burstRate || 3;
  this.particle = options.particle || function() {

    var borderStyles = exports.config.borderStyles,
        borderStr = borderStyles[exports.Utils.getRandomNumber(0, borderStyles.length - 1)];

    return {
      color: pl.getColor(),
      borderWidth: exports.Utils.getRandomNumber(2, 12),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + exports.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')',
      zIndex: exports.Utils.getRandomNumber(1, 100),
      location: this.getLocation(),
      acceleration: new exports.Vector(exports.Utils.getRandomNumber(-4, 4), exports.Utils.getRandomNumber(-4, 4))
    };
  };
}
exports.Utils.extend(ParticleSystem, exports.Agent);

/**
 * Define a name property.
 */
ParticleSystem.prototype.name = 'particlesystem';

exports.ParticleSystem = ParticleSystem;