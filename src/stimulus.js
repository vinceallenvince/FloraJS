var BorderPalette = require('borderpalette'),
    ColorPalette = require('colorpalette'),
    config = require('./config').config,
    Mover = require('./mover'),
    Utils = require('burner').Utils;

/**
 * Creates a new Stimulus.
 *
 * @constructor
 * @extends Mover
 */
function Stimulus() {
  Mover.call(this);
}
Utils.extend(Stimulus, Mover);

/**
 * Specific background and box-shadow colors have been added to config.js. When initialized,
 * a new Stimulus item pulls colors from palettes based on these colors.
 */
var i, max, pal, color, border;

/**
 * By default, Stimulus items get a border style randomly selected
 * from a predetermined list.
 * @static
 * @type {Array}
 */
Stimulus.borderStyles = ['double', 'double', 'dotted', 'dashed'];
Stimulus.palettes = {};
Stimulus.borderColors = {};
Stimulus.boxShadowColors = {};

for (i = 0, max = config.defaultColorList.length; i < max; i++) {
  color = config.defaultColorList[i];
  pal = new ColorPalette();
  pal.addColor({
    min: 20,
    max: 200,
    startColor: color.startColor,
    endColor: color.endColor
  });
  Stimulus.palettes[color.name] = pal;
  Stimulus.borderColors[color.name] = color.borderColor;
  Stimulus.boxShadowColors[color.name] = color.boxShadowColor;
}

Stimulus.borderPalette = new BorderPalette();
for (i = 0, max = Stimulus.borderStyles.length; i < max; i++) {
  border = Stimulus.borderStyles[i];
  Stimulus.borderPalette.addBorder({
    min: 2,
    max: 10,
    style: border
  });
}

/**
 * Initializes an instance.
 *
 * @param {Object} [options=] A map of initial properties.
 * @param {Array} [options.mass = 50] Mass.
 * @param {Array} [options.isStatic = true] isStatic.
 * @param {Array} [options.width = 50] Width.
 * @param {Array} [options.height = 50] Height.
 * @param {Array} [options.opacity = 0.75] Opacity.
 * @param {Array} [options.color = [255, 255, 255]] Color.
 * @param {number} [options.borderWidth = this.width / getRandomNumber(2, 8)] Border width.
 * @param {string} [options.borderStyle = 'double'] Border style.
 * @param {Array} [options.borderColor = [220, 220, 220]] Border color.
 * @param {number} [options.borderRadius = 100] Border radius.
 * @param {number} [options.boxShadowSpread = this.width / getRandomNumber(2, 8)] Box-shadow spread.
 * @param {Array} [options.boxShadowColor = [200, 200, 200]] Box-shadow color.
 */
Stimulus.prototype.init = function(world, opt_options) {

  Stimulus._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  if (!options.type || typeof options.type !== 'string') {
    throw new Error('Stimulus requires \'type\' parameter as a string.');
  }

  this.type = options.type;

  this.mass = typeof options.mass !== 'undefined' ? options.mass : 50;
  this.isStatic = typeof options.isStatic !== 'undefined' ? options.isStatic : true;
  this.width = typeof options.width !== 'undefined' ? options.width : 50;
  this.height = typeof options.height !== 'undefined' ? options.height : 50;
  this.opacity = typeof options.opacity !== 'undefined' ? options.opacity : 0.75;

  this.color = options.color || (Stimulus.palettes[this.type] ?
      Stimulus.palettes[this.type].getColor() : [255, 255, 255]);

  this.borderColor = options.borderColor || (Stimulus.palettes[this.type] ?
    Stimulus.palettes[this.type].getColor() : [220, 220, 220]);

  this.boxShadowColor = options.boxShadowColor || (Stimulus.boxShadowColors[this.type] ?
    Stimulus.boxShadowColors[this.type] : [200, 200, 200]);

  this.borderWidth = typeof options.borderWidth !== 'undefined' ?
      options.borderWidth : this.width / Utils.getRandomNumber(2, 8);

  this.borderStyle = typeof options.borderStyle !== 'undefined' ?
      options.borderStyle : Stimulus.borderPalette.getBorder();

  this.borderRadius = typeof options.borderRadius !== 'undefined' ?
      options.borderRadius : 100;

  this.boxShadowSpread = typeof options.boxShadowSpread !== 'undefined' ?
      options.boxShadowSpread : this.width / Utils.getRandomNumber(2, 8);

};

module.exports = Stimulus;
