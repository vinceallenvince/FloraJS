var Item = require('Burner').Item,
    Attractor = require('./Attractor').Attractor,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

/**
 * Creates a new RangeDisplay.
 *
 * A RangeDisplay is parented to a sensor and displays the sensor's
 * sensitivity range.
 *
 * @constructor
 * @extends Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
function RangeDisplay(opt_options) {
  Item.call(this);
  var options = opt_options || {}; // TODO: test this

  if (!options || !options.sensor) {
    throw new Error('RangeDisplay: a sensor is required.'); // TODO: test this
  }
  this.sensor = options.sensor;

  this.name = options.name || 'RangeDisplay';
  this.zIndex = options.zIndex || 10;
  this.borderStyle = typeof options.borderStyle !== 'undefined' ?  options.borderStyle : 'dashed';  // TODO: test this
  this.borderDefaultColor = typeof options.borderDefaultColor !== 'undefined' ? options.borderDefaultColor : [150, 150, 150];  // TODO: test this

}
Utils.extend(RangeDisplay, Item);

/**
 * Initializes RangeDisplay.
 * @param  {Object} world       An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 */
RangeDisplay.prototype.init = function(world, opt_options) {
  RangeDisplay._superClass.init.call(this, world, opt_options);

  /**
   * RangeDisplays have no height or color and rely on the associated DOM element's
   * CSS border to render their line.
   */
  this.borderWidth = 2;
  this.borderRadius = 100;
  this.width = this.sensor.sensitivity;
  this.height = this.sensor.sensitivity;
  this.minOpacity = 0.3;
  this.maxOpacity = 0.6;
  this.opacity = this.minOpacity;
  this.maxAngularVelocity = 1;
  this.minAngularVelocity = 0;
};

/**
 * Called every frame, step() updates the instance's properties.
 */
RangeDisplay.prototype.step = function() {

  this.location.x = this.sensor.location.x;
  this.location.y = this.sensor.location.y;

  // TODO: do we need angularVelocity?
  /*var angularVelocity = Utils.map(this.sensor.parent.velocity.mag(),
      this.sensor.parent.minSpeed, this.sensor.parent.maxSpeed,
      this.maxAngularVelocity, this.minAngularVelocity);*/

  if (this.sensor.activated) {
    this.opacity = this.maxOpacity;
    this.borderColor = this.sensor.target.color;
  } else {
    this.opacity = this.minOpacity;
    this.borderColor = this.borderDefaultColor;
  }
};

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof RangeDisplay
 */
RangeDisplay.prototype.draw = function() {
  var cssText = this.getCSSText({
    x: this.location.x - (this.width / 2),
    y: this.location.y - (this.height / 2),
    angle: this.angle,
    scale: this.scale || 1,
    width: this.width,
    height: this.height,
    colorMode: this.colorMode,
    borderRadius: this.borderRadius,
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor0: this.borderColor[0],
    borderColor1: this.borderColor[1],
    borderColor2: this.borderColor[2]
  });
  this.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof RangeDisplay
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
RangeDisplay.prototype.getCSSText = function(props) {
  return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' + props.height + 'px; border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%;';
};


module.exports.RangeDisplay = RangeDisplay;
