var ColorPalette = require('./ColorPalette').ColorPalette,
    Item = require('burner').Item,
    Mover = require('./Mover').Mover,
    System = require('burner').System,
    Utils = require('burner').Utils,
    Vector = require('burner').Vector;

/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Mover
 */
function ParticleSystem(opt_options) {
  Mover.call(this);
}
Utils.extend(ParticleSystem, Mover);

/**
 * Initializes Particle.
 * @param  {Object} world An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {string|Array} [opt_options.color = [255, 255, 255]] Color.
 * @param {number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {string|Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {number} [opt_options.borderRadius = 0] Border radius.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move.
 * @param {number} [opt_options.lifespan = 1000] The max life of the system. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, system is destroyed.
 * @param {number} [opt_options.burst = 1] The number of particles to create per burst.
 * @param {number} [opt_options.burstRate = 1] The number of frames between bursts. Lower values = more particles.
 * @param {number} [opt_options.emitRadius = 3] The ParticleSystem adds this offset to the location of the Particles it creates.
 * @param {Array} [opt_options.startColor = [255, 255, 255]] The starting color of the particle's palette range.
 * @param {Array} [opt_options.endColor = [255, 0, 0]] The ending color of the particle's palette range.
 * @param {Object} [opt_options.particleOptions] A map of options for particles created by system.
 */
ParticleSystem.prototype.init = function(world, opt_options) {
  ParticleSystem._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.width = options.width || 0;
  this.height = options.height || 0;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = options.borderRadius || 0;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.lifespan = typeof options.lifespan === 'undefined' ? -1: options.lifespan;
  this.life = typeof options.life === 'undefined' ? -1 : options.life;
  this.burst = typeof options.burst === 'undefined' ? 1 : options.burst;
  this.burstRate = typeof options.burstRate === 'undefined' ? 4 : options.burstRate;
  this.emitRadius = typeof options.emitRadius === 'undefined' ? 3 : options.emitRadius;
  this.startColor = options.startColor || [255, 255, 255];
  this.endColor = options.endColor || [255, 0, 0];
  this.particleOptions = options.particleOptions || {
    width : 15,
    height : 15,
    lifespan : 50,
    borderRadius : 100,
    checkWorldEdges : false,
    acceleration: null,
    velocity: null,
    location: null,
    maxSpeed: 3,
    fade: true,
    shrink: true
  };

  if (this.particleOptions.acceleration) {
    this.initParticleAcceleration = new Vector(this.particleOptions.acceleration.x,
      this.particleOptions.acceleration.y);
  }

  var pl = new ColorPalette();
  pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: this.startColor,
    endColor: this.endColor
  });

  this.clock = 0;

  this.beforeStep = function () {

    var location, offset,
        initAcceleration = this.initParticleAcceleration;

    if (this.life < this.lifespan) {
      this.life += 1;
    } else if (this.lifespan !== -1) {
      System.remove(this);
      return;
    }

    if (this.clock % this.burstRate === 0) {

      location = new Vector(this.location.x, this.location.y); // use the particle system's location
      offset = new Vector(1, 1); // get the emit radius
      offset.normalize();
      offset.mult(this.emitRadius); // expand emit radius in a random direction
      offset.rotate(Utils.getRandomNumber(0, Math.PI * 2, true));
      location.add(offset);

      for (var i = 0; i < this.burst; i++) {
        this.particleOptions.world = this.world;
        this.particleOptions.life = 0;
        this.particleOptions.color = pl.getColor();
        this.particleOptions.borderStyle = 'solid';
        this.particleOptions.borderColor = pl.getColor();
        this.particleOptions.boxShadowColor = pl.getColor();
        if (initAcceleration) {
          this.particleOptions.acceleration = new Vector(initAcceleration.x, initAcceleration.y);
        }
        this.particleOptions.location = location;

        System.add('Particle', this.particleOptions);
      }
    }
    this.clock++;
  };

};

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof ParticleSystem
 */
ParticleSystem.prototype.draw = function() {
  var cssText = this.getCSSText({
    x: this.location.x - (this.width / 2),
    y: this.location.y - (this.height / 2),
    angle: this.angle,
    scale: this.scale || 1
  });
  this.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof ParticleSystem
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
ParticleSystem.prototype.getCSSText = function(props) {
  return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + ';';
};


module.exports.ParticleSystem = ParticleSystem;
