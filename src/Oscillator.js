var Item = require('Burner').Item,
    Mover = require('./Mover').Mover,
    SimplexNoise = require('./SimplexNoise').SimplexNoise,
    System = require('Burner').System,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

/**
 * Creates a new Oscillator.
 *
 * Oscillators simulate wave patterns and move according to
 * amplitude and angular velocity. Oscillators are not affected
 * by gravity or friction.
 *
 * @constructor
 * @extends Item
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_options.initialLocation = The center of the world] The object's initial location.
 * @param {Object} [opt_options.lastLocation = {x: 0, y: 0}] The object's last location. Used to calculate
 *    angle if pointToDirection = true.
 * @param {Object} [opt_options.amplitude = {x: world width, y: world height}] Sets amplitude, the distance from the object's
 *    initial location (center of the motion) to either extreme.
 * @param {Object} [opt_options.acceleration = {x: 0.01, y: 0}] The object's acceleration. Oscillators have a
 *    constant acceleration.
 * @param {Object} [opt_options.aVelocity = new Vector()] Angular velocity.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.isPerlin = false] If set to true, object will use Perlin Noise to calculate its location.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -2] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 2] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height.
 * @param {Array} [opt_options.color = 200, 100, 0] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = 255, 150, 0] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = 147, 199, 196] Box-shadow color.
 */
function Oscillator(opt_options) {
  Item.call(this);
  var options = opt_options || {};
  this.name = options.name || 'Oscillator';

  this.acceleration = options.acceleration || new Vector(0.01, 0);
  this.aVelocity = options.aVelocity || new Vector();
  this.isStatic = !!options.isStatic;
  this.isPerlin = !!options.isPerlin;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = typeof options.perlinAccelLow === 'undefined' ? -2 : options.perlinAccelLow;
  this.perlinAccelHigh = typeof options.perlinAccelHigh === 'undefined' ? 2 : options.perlinAccelHigh;
  this.perlinOffsetX = typeof options.perlinOffsetX === 'undefined' ? Math.random() * 10000 : options.perlinOffsetX;
  this.perlinOffsetY = typeof options.perlinOffsetY === 'undefined' ? Math.random() * 10000 : options.perlinOffsetY;
  this.width = typeof options.width === 'undefined' ? 20 : options.width;
  this.height = typeof options.height === 'undefined' ? 20 : options.height;
  this.color = options.color || [200, 100, 0];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 150, 50];
  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowOffsetX = options.boxShadowOffsetX || 0;
  this.boxShadowOffsetY = options.boxShadowOffsetY || 0;
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || [200, 100, 0];
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.parent = options.parent || null;
  this.pointToDirection = !!options.pointToDirection;

  this.initialLocation = new Vector();
  this.lastLocation = new Vector();
  this.amplitude = new Vector();
}
Utils.extend(Oscillator, Item);

/**
 * Initializes Oscillator.
 * @param  {Object} world       An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 */
Oscillator.prototype.init = function(world, opt_options) {
  Oscillator._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.amplitude = options.amplitude || new Vector(this.world.width / 2 - this.width,
      this.world.height / 2 - this.height);
  this.initialLocation = options.initialLocation ||
    new Vector(this.world.width / 2, this.world.height / 2);
  this.location.x = this.initialLocation.x;
  this.location.y = this.initialLocation.y;
};


/**
 * Updates the oscillator's properties.
 */
Oscillator.prototype.step = function () {

  this.beforeStep.call(this);

  if (this.isStatic) {
    return;
  }

  if (this.isPerlin) {
    this.perlinTime += this.perlinSpeed;
    this.aVelocity.x =  Utils.map(SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    this.aVelocity.y =  Utils.map(SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
  } else {
    this.aVelocity.add(this.acceleration); // add acceleration
  }

  if (this.parent) { // parenting
    this.initialLocation.x = this.parent.location.x;
    this.initialLocation.y = this.parent.location.y;
  }

  this.location.x = this.initialLocation.x + Math.sin(this.aVelocity.x) * this.amplitude.x;
  this.location.y = this.initialLocation.y + Math.sin(this.aVelocity.y) * this.amplitude.y;

  if (this.pointToDirection) { // object rotates toward direction
      velDiff = Vector.VectorSub(this.location, this.lastLocation);
      this.angle = Utils.radiansToDegrees(Math.atan2(velDiff.y, velDiff.x));
  }

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    System.remove(this);
  }

  this.afterStep.call(this);

  this.lastLocation.x = this.location.x;
  this.lastLocation.y = this.location.y;
};

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof Attractor
 */
Oscillator.prototype.draw = function() {
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
Oscillator.prototype.getCSSText = function(props) {
  return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' + props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); opacity: ' + props.opacity + '; z-index: ' + props.zIndex + ';';
};

module.exports.Oscillator = Oscillator;
