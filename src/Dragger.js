var Attractor = require('./Attractor').Attractor,
    Utils = require('burner').Utils;

/**
 * Creates a new Dragger object.
 *
 * @constructor
 * @extends Attractor
 */
function Dragger(opt_options) {
  Attractor.call(this);
}
Utils.extend(Dragger, Attractor);

/**
 * Initializes Dragger.
 * @param  {Object} world An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {Array} [opt_options.color = 92, 187, 0] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = 224, 228, 204] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = 92, 187, 0] Box-shadow color.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 */
Dragger.prototype.init = function(world, opt_options) {
  Dragger._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.c = typeof options.c === 'undefined' ? 1 : options.c;
  this.mass = typeof options.mass === 'undefined' ? 1000 : options.mass;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.width = typeof options.width === 'undefined' ? 100 : options.width;
  this.height = typeof options.height === 'undefined' ? 100 : options.height;
  this.color = options.color || [105, 210, 231];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [167, 219, 216];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowSpread = typeof options.boxShadowSpread === 'undefined' ? this.width / 4 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [147, 199, 196];
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
};

/**
 * Calculates a force to apply to simulate drag on an object.
 *
 * @param {Object} obj The target object.
 * @returns {Object} A force to apply.
 */
Dragger.prototype.drag = function(obj) {

  var speed = obj.velocity.mag(),
    dragMagnitude = -1 * this.c * speed * speed; // drag magnitude

  this._force.x = obj.velocity.x;
  this._force.y = obj.velocity.y;

  this._force.normalize(); // drag direction
  this._force.mult(dragMagnitude);

  return this._force;
};

module.exports.Dragger = Dragger;
