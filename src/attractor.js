/*global Burner */
/**
 * Creates a new Attractor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Attractor(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Attractor';
  Mover.call(this, options);
}
Utils.extend(Attractor, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.G = 10] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {Array} [opt_options.color = 92, 187, 0] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = 224, 228, 204] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 8] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = 92, 187, 0] Box-shadow color.
 */
Attractor.prototype.init = function(opt_options) {

  var options = opt_options || {};

  Attractor._superClass.prototype.init.call(this, options);

  this.G = typeof options.G === 'undefined' ? 10 : options.G;
  this.mass = typeof options.mass === 'undefined' ? 1000 : options.mass;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.width = typeof options.width === 'undefined' ? 100 : options.width;
  this.height = typeof options.height === 'undefined' ? 100 : options.height;
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined '? 1 : options.zIndex;
  this.color = options.color || [92, 187, 0];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowSpread = typeof options.boxShadowSpread === 'undefined' ? this.width / 4 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [64, 129, 0];

  Burner.System.updateCache(this);
};

/**
 * Calculates a force to apply to simulate attraction/repulsion on an object.
 *
 * @param {Object} obj The target object.
 * @returns {Object} A force to apply.
 */
Attractor.prototype.attract = function(obj) {

  var force = Burner.Vector.VectorSub(this.location, obj.location),
    distance, strength;

  distance = force.mag();
  distance = Utils.constrain(
      distance,
      obj.width * obj.height,
      this.width * this.height); // min = the size of obj; max = the size of this attractor
  force.normalize();

  // strength is proportional to the mass of the objects and their proximity to each other
  strength = (this.G * this.mass * obj.mass) / (distance * distance);
  force.mult(strength);

  return force;
};
