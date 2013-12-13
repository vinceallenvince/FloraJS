/*global Burner */
/**
 * Creates a new Particle.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Particle(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Particle';
  Mover.call(this, options);
}
Utils.extend(Particle, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.lifespan = 40] The max life of the object. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, object is destroyed.
 * @param {boolean} {opt_options.fade = true} If true, opacity decreases proportionally with life.
 * @param {boolean} {opt_options.shrink = true} If true, width and height decrease proportionally with life.
 * @param {boolean} [opt_options.checkWorldEdges = false] Set to true to check the object's location against the world's bounds.
 * @param {number} [opt_options.maxSpeed = 4] Maximum speed.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {Array} [opt_options.color = 200, 200, 200] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {number} [opt_options.borderRadius = 100] The particle's border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {string|Array} [opt_options.boxShadowColor = 'transparent'] Box-shadow color.
 */
Particle.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Particle._superClass.prototype.init.call(this, options);

  this.width = typeof options.width === 'undefined' ? 20 : options.width;
  this.height = typeof options.height === 'undefined' ? 20 : options.height;
  this.lifespan = typeof options.lifespan === 'undefined' ? 50 : options.lifespan;
  this.life = options.life || 0;
  this.fade = typeof options.fade === 'undefined' ? true : options.fade;
  this.shrink = typeof options.shrink === 'undefined' ? true : options.shrink;
  this.checkWorldEdges = !!options.checkWorldEdges;
  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 4 : options.maxSpeed;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.color = options.color || [200, 200, 200];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowSpread = typeof options.boxShadowSpread === 'undefined' ? this.width / 4 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || 'transparent';
  if (!options.acceleration) {
    this.acceleration = new Burner.Vector(1, 1);
    this.acceleration.normalize();
    this.acceleration.mult(this.maxSpeed ? this.maxSpeed : 3);
    this.acceleration.rotate(Utils.getRandomNumber(0, Math.PI * 2, true));
  }
  if (!options.velocity) {
    this.velocity = new Burner.Vector();
  }
  this.initWidth = this.width;
  this.initHeight = this.height;
};

/**
 * Applies additional forces.
 */
Particle.prototype.applyAdditionalForces = function() {

  if (this.fade) {
    this.opacity = Utils.map(this.life, 0, this.lifespan, 1, 0);
  }

  if (this.shrink) {
    this.width = Utils.map(this.life, 0, this.lifespan, this.initWidth, 0);
    this.height = Utils.map(this.life, 0, this.lifespan, this.initHeight, 0);
  }
};
