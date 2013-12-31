/*global Burner */

/**
 * Specific background and box-shadow colors have been added to config.js. When initialized,
 * a new Stimulus item pulls colors from palettes based on these colors.
 */
var i, max, pal, color, palettes = {}, border, borderPalette, borderColors = {}, boxShadowColors = {};

/**
 * By default, Stimulus items get a border style randomly selected
 * from a predetermined list.
 */
var borderStyles = ['double', 'double', 'dotted', 'dashed'];

for (i = 0, max = Config.defaultColorList.length; i < max; i++) {
  color = Config.defaultColorList[i];
  pal = new ColorPalette();
  pal.addColor({
    min: 20,
    max: 200,
    startColor: color.startColor,
    endColor: color.endColor
  });
  palettes[color.name] = pal;
  borderColors[color.name] = color.borderColor;
  boxShadowColors[color.name] = color.boxShadowColor;
}

borderPalette = new BorderPalette();
for (i = 0, max = borderStyles.length; i < max; i++) {
  border = borderStyles[i];
  borderPalette.addBorder({
    min: 2,
    max: 10,
    style: border
  });
}

/**
 * Creates a new Stimulus.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} options A map of initial properties.
 */
function Stimulus(options) {

  if (!options || !options.type) {
    throw new Error('Stimulus: options.type is required.');
  }
  /*options.name = options.type.substr(0, 1).toUpperCase() +
      options.type.toLowerCase().substr(1, options.type.length);*/
  options.name = options.name || options.type;
  Mover.call(this, options);
}
Utils.extend(Stimulus, Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {Array} [opt_options.color = 255, 255, 255] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = 220, 220, 220] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = 200, 200, 200] Box-shadow color.
 */
Stimulus.prototype.init = function(opt_options) {

  var options = opt_options || {}, name = this.name.toLowerCase();
  Stimulus._superClass.prototype.init.call(this, options);

  this.mass = typeof options.mass === 'undefined' ? 50 : options.mass;
  this.isStatic = typeof options.isStatic === 'undefined' ? true : options.isStatic;
  this.width = typeof options.width === 'undefined' ? 50 : options.width;
  this.height = typeof options.height === 'undefined' ? 50 : options.height;
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;

  // color may not be pre-defined
  this.color = options.color || palettes[this.type] ? palettes[this.type].getColor() : [255, 255, 255];

  this.borderWidth = typeof options.borderWidth === 'undefined' ?
      this.width / Utils.getRandomNumber(2, 8) : options.borderWidth;
  this.borderStyle = typeof options.borderStyle === 'undefined' ?
      borderPalette.getBorder() : options.borderStyle;

  // borderColor may not be pre-defined
  this.borderColor = options.borderColor || palettes[this.type] ? palettes[this.type].getColor() : [220, 220, 220];

  this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
  this.boxShadowSpread = typeof options.boxShadowSpread === 'undefined' ?
      this.width / Utils.getRandomNumber(2, 8) : options.boxShadowSpread;

  // boxShadowColor may not be pre-defined
  this.boxShadowColor = options.boxShadowColor || boxShadowColors[this.type] ? boxShadowColors[this.type] : [200, 200, 200];

  Burner.System.updateCache(this);
};
