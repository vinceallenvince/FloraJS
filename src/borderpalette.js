/*global exports */
/**
    A module representing a BorderPalette.
    @module BorderPalette
 */

/**
 * Creates a new BorderPalette object.
 *
 * @constructor
 */
function BorderPalette() {

  'use strict';

  this.borders = [];
}

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
BorderPalette.name = 'borderpalette';

BorderPalette.prototype.addBorder = function(options) {

  'use strict';

  var requiredOptions = {
    min: 'number',
    max: 'number',
    style: 'string'
  }, i, ln, colors;

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {

    ln = exports.Utils.getRandomNumber(options.min, options.max);

    for (i = 0; i < ln; i++) {
      this.borders.push(options.style);
    }
  }
  return this;
};

BorderPalette.prototype.getBorder = function() {

  'use strict';

  if (this.borders.length > 0) {
    return this.borders[exports.Utils.getRandomNumber(0, this.borders.length - 1)];
  } else {
    throw new Error('BorderPalette.getBorder: You must add borders via addBorder() before using getBorder().');
  }
};


exports.BorderPalette = BorderPalette;