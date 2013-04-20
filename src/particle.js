/*global exports */
/**
 * Creates a new Particle.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Particle options.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.lifespan = 40] The max life of the particle. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, particle is destroyed.
 * @param {boolean} {opt_options.fade = true} If true, opacity decreases proportionally with life.
 * @param {boolean} {opt_options.shrink = true} If true, width and height decrease proportionally with life.
 * @param {string} [opt_options.borderRadius = '100%'] The particle's border radius.
 * @param {boolean} [opt_options.checkEdges = false] Set to true to check the object's location against the world's bounds.
 * @param {boolean} [opt_options.maxSpeed = 4] Maximum speed.
 * @param {string|number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {Array} [opt_options.borderColor = 'transparent'] Border color.
 */
function Particle(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 20;
  this.height = options.height === 0 ? 0 : options.height || 20;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || 50;
  this.life = options.life === 0 ? 0 : options.life || 0;
  this.fade = options.fade === false ? false : true;
  this.shrink = options.shrink === false ? false : true;
  this.borderRadius = options.borderRadius || '100%';
  this.checkEdges = !!options.checkEdges;
  this.maxSpeed = options.maxSpeed || 4;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';

  if (!options.acceleration) {
    this.acceleration = new exports.Vector(1, 1);
    this.acceleration.normalize();
    this.acceleration.mult(30);
    this.acceleration.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
  }
  this.initWidth = this.width;
  this.initHeight = this.height;
  this.name = 'Particle';
}
exports.Utils.extend(Particle, exports.Agent);

Particle.prototype.name = 'Particle';

/**
 * Calculates location via sum of acceleration + velocity.
 *
 * @returns {number} The total number of times step has been executed.
 */
Particle.prototype.step = function() {

  var friction;

  // start apply forces

  if (this.world.c) { // friction
    friction = exports.Utils.clone(this.velocity);
    friction.mult(-1);
    friction.normalize();
    friction.mult(this.world.c);
    this.applyForce(friction);
  }
  this.applyForce(this.world.gravity); // gravity

    if (this.applyForces) { // !! rename this
      this.applyForces();
    }

  if (this.checkEdges) {
    this._checkWorldEdges();
  }

  // end apply forces

  this.velocity.add(this.acceleration); // add acceleration

  if (this.maxSpeed) {
    this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
  }

  if (this.minSpeed) {
    this.velocity.limit(null, this.minSpeed); // check if velocity < minSpeed
  }

  this.location.add(this.velocity); // add velocity

  if (this.fade) {
    this.opacity = exports.Utils.map(this.life, 0, this.lifespan, 1, 0);
  }

  if (this.shrink) {
    this.width = exports.Utils.map(this.life, 0, this.lifespan, this.initWidth, 0);
    this.height = exports.Utils.map(this.life, 0, this.lifespan, this.initHeight, 0);
  }

  this.acceleration.mult(0);

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    exports.Mantle.System.destroyElement(this);
  }

};

exports.Particle = Particle;