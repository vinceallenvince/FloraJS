var Item = require('Burner').Item,
    Mover = require('./Mover').Mover,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

/**
 * Creates a new Attractor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.G = 10] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {Array} [opt_options.color = 92, 187, 0] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = 224, 228, 204] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 8] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = 92, 187, 0] Box-shadow color.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 */
function Attractor(opt_options) {
  Mover.call(this);
  var options = opt_options || {};
  this.name = options.name || 'Attractor';
  this.G = typeof options.G === 'undefined' ? 10 : options.G;
  this.mass = typeof options.mass === 'undefined' ? 1000 : options.mass;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.width = typeof options.width === 'undefined' ? 100 : options.width;
  this.height = typeof options.height === 'undefined' ? 100 : options.height;
  this.color = options.color || [92, 187, 0];
  this.borderWidth = typeof options.borderWidth === 'undefined' ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowOffsetX = options.boxShadowOffsetX || 0;
  this.boxShadowOffsetY = options.boxShadowOffsetY || 0;
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = typeof options.boxShadowSpread === 'undefined' ? this.width / 4 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [64, 129, 0];
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
}
Utils.extend(Attractor, Mover);

/**
 * Initializes Attractor.
 * @param  {Object} world       An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 */
Attractor.prototype.init = function(world, opt_options) {
  Attractor._superClass.init.call(this, world, opt_options);
};

/**
 * Calculates a force to apply to simulate attraction/repulsion on an object.
 *
 * @param {Object} obj The target object.
 * @returns {Object} A force to apply.
 */
Attractor.prototype.attract = function(obj) {

  var force = Vector.VectorSub(this.location, obj.location);

  var distance = Utils.constrain(
      force.mag(),
      obj.width * obj.height,
      this.width * this.height); // min = the size of obj; max = the size of this attractor

  force.normalize();

  // strength is proportional to the mass of the objects and their proximity to each other
  var strength = (this.G * this.mass * obj.mass) / (distance * distance);
  force.mult(strength);

  return force;
};

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof Attractor
 */
Attractor.prototype.draw = function() {
  var cssText = this.getCSSText({
    x: this.location.x - (this.width / 2),
    y: this.location.y - (this.height / 2),
    angle: this.angle,
    scale: this.scale || 1,
    width: this.width,
    height: this.height,
    color0: this.color[0],
    color1: this.color[1],
    color2: this.color[2],
    colorMode: this.colorMode,
    borderRadius: this.borderRadius,
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor0: this.borderColor[0],
    borderColor1: this.borderColor[1],
    borderColor2: this.borderColor[2],
    boxShadowOffsetX: this.boxShadowOffsetX,
    boxShadowOffsetY: this.boxShadowOffsetY,
    boxShadowBlur: this.boxShadowBlur,
    boxShadowSpread: this.boxShadowSpread,
    boxShadowColor0: this.boxShadowColor[0],
    boxShadowColor1: this.boxShadowColor[1],
    boxShadowColor2: this.boxShadowColor[2],
    opacity: this.opacity,
    zIndex: this.zIndex
  });
  this.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof Attractor
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
Attractor.prototype.getCSSText = function(props) {
  return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' + props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); opacity: ' + props.opacity + '; z-index: ' + props.zIndex + ';';
};

module.exports.Attractor = Attractor;
