/*global exports, Burner */

var i, max, pal, color, palettes = {}, border, borderPalette, borderColors = {}, boxShadowColors = {},
    borderStyles = ['double', 'double', 'dotted', 'dashed'];

for (i = 0, max = exports.config.defaultColorList.length; i < max; i++) {
  color = exports.config.defaultColorList[i];
  pal = new exports.ColorPalette();
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

borderPalette = new exports.BorderPalette();
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
 * @extends Agent
 *
 * @param {Object} options A map of initial properties.
 */
function Stimulus(options) {

  if (!options || !options.type) {
    throw new Error('Stimulus: options.type is required.');
  }
  options.name = options.type.substr(0, 1).toUpperCase() +
      options.type.toLowerCase().substr(1, options.type.length);
  exports.Agent.call(this, options);
}
exports.Utils.extend(Stimulus, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {Array} [opt_options.color = [255, 200, 0]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [255, 200, 0]] Box-shadow color.
 */
Stimulus.prototype.init = function(opt_options) {

  var options = opt_options || {}, name = this.name.toLowerCase();
  Stimulus._superClass.prototype.init.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 1;
  this.color = options.color || palettes[name].getColor();
  this.borderWidth = options.borderWidth || this.width / exports.Utils.getRandomNumber(2, 8);
  this.borderStyle = options.borderStyle || borderPalette.getBorder();
  this.borderColor = options.borderColor || palettes[name].getColor();
  this.borderRadius = options.borderRadius || 100;
  this.boxShadowSpread = options.boxShadowSpread || this.width / exports.Utils.getRandomNumber(2, 8);
  this.boxShadowColor = options.boxShadowColor || boxShadowColors[name];

  Burner.System.updateCache(this);
};

Stimulus.prototype.name = 'Stimulus';

exports.Stimulus = Stimulus;