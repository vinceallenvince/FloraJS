/*global exports */
/**
    A module representing a ColorTable.
    @module ColorTable
 */

function ColorTable() {
  'use strict';
}

ColorTable.prototype.addColor = function(options) {

  'use strict';

  var requiredOptions = {
    name: 'string',
    startColor: 'array',
    endColor: 'array'
  };

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {
    this[options.name] = {
      startColor: options.startColor,
      endColor: options.endColor
    };
  }
  return this;
};

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
ColorTable.name = 'colortable';

ColorTable.prototype.getColor = function(name, startColor, endColor) {

  'use strict';

  var color, startCol, endCol;

  if (exports.Interface.getDataType(name) === 'string') {

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

exports.ColorTable = ColorTable;