/**
 * Creates a new ColorTable.
 *
 * Use a color table to create a map of keywords to color ranges.
 * Instead of manually passing start and end colors when creating
 * color palettes, you can use getColor() and pass a keyword to
 * receive the start and end colors.
 *
 * @example
 * var heat = defaultColors.getColor('heat');
 * console.log(heat.startColor); // -> [255, 132, 86]
 * console.log(heat.endColor); // -> [175, 47, 0]
 *
 * @constructor
 */
function ColorTable() {
}

/**
 * Adds a key to the color table with start and end color values.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.name {number} The name of the entry in the color table.
 *    options.startColor {Array} The beginning color of the color range.
 *    options.endColor {Array} The end color of the color range.
 *
 * @returns {Object} The color table.
 */
ColorTable.prototype.addColor = function(options) {

  var requiredOptions = {
    name: 'string',
    startColor: 'array',
    endColor: 'array'
  };

  if (Interface.checkRequiredParams(options, requiredOptions)) {
    this[options.name] = {
      startColor: options.startColor,
      endColor: options.endColor
    };
  }
  return this;
};

ColorTable.prototype.name = 'ColorTable';

/**
 * Returns start and end colors from a key in the color table.
 *
 * @param {Object} options A set of options.
 *    Required:
 *    options.name {number} The name of the entry in the color table.
 *    Optional:
 *    options.startColor {boolean} Pass true to only return the start color.
 *    options.endColor {boolean} Pass true to only return the end color.
 * @param {Array} startColor An array representing the start color. ex: [255, 100, 50].
 * @param {Array} endColor An array representing the end color. ex: [155, 50, 10].
 * @returns {Object|Array} Either an object with startColor and endColor
 *    properties or an array representing a start or end color.
 *
 * @example
 * var heat = myColorTable.getColor('heat');
 * console.log(heat.startColor); // -> [255, 132, 86]
 * console.log(heat.endColor); // -> [175, 47, 0]
 *
 * var heat = myColorTable.getColor('heat', true);
 * console.log(heat); // -> [255, 132, 86]
 *
 * var heat = myColorTable.getColor('heat', false, true);
 * console.log(heat); // -> [175, 47, 0]
 */
ColorTable.prototype.getColor = function(name, startColor, endColor) {

  var color, startCol, endCol;

  if (Interface.getDataType(name) === 'string') {

    if (this[name]) {

      color = this[name];

      if (startColor) {
        startCol = color.startColor;
      }
      if (endColor) {
        endCol = color.endColor;
      }
      if (startCol && endCol || !startCol && !endCol) {
        return {
          startColor: color.startColor,
          endColor: color.endColor
        };
      } else if (startCol) {
        return startCol;
      } else if (endCol) {
        return endCol;
      }
    } else {
      throw new Error('ColorTable: ' + name + ' does not exist. Add colors to the ColorTable via addColor().');
    }
  } else {
    throw new Error('ColorTable: You must pass a name (string) for the color entry in the table.');
  }
};