var Utils = require('Burner').Utils;
/**
 * Creates a new BorderPalette object.
 *
 * Use this class to create a palette of border styles.
 *
 * @param {string|number} [opt_id=] An optional id. If an id is not passed, a default id is created.
 * @constructor
 */
function BorderPalette(opt_id) {

  /**
   * Holds a list of border styles.
   * @private
   */
  this._borders = [];

  this.id = opt_id || BorderPalette._idCount;
  BorderPalette._idCount++; // increment id
}

/**
 * Increments as each BorderPalette is created.
 * @type number
 * @default 0
 * @private
 */
BorderPalette._idCount = 0;

BorderPalette.prototype.name = 'BorderPalette';

/**
 * Adds a random number of the passed border style to the 'borders' array.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.min {number} The minimum number of styles to add.
 *    options.max {number} The maximum number of styles to add.
 *    options.style {string} The border style.
 */
BorderPalette.prototype.addBorder = function(options) {

  if (!options.min || !options.max || !options.style) {
    throw new Error('BorderPalette.addBorder requires min, max and style paramaters.');
  }

  for (var i = 0, ln = Utils.getRandomNumber(options.min, options.max); i < ln; i++) {
    this._borders.push(options.style);
  }

  return this;
};

/**
 * @returns A style randomly selected from the 'borders' property.
 * @throws {Error} If the 'borders' property is empty.
 */
BorderPalette.prototype.getBorder = function() {

  if (this._borders.length > 0) {
    return this._borders[Utils.getRandomNumber(0, this._borders.length - 1)];
  }

  throw new Error('BorderPalette.getBorder: You must add borders via addBorder() before using getBorder().');
};

module.exports.BorderPalette = BorderPalette;

