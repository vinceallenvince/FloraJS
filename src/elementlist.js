/*global exports */
/**
 * Creates a new ElementList.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 */
function ElementList(opt_options) {

  'use strict';

  var options = opt_options || {};

  /**
   * Holds a list of elements.
   * @private
   */
  this._records = [];
}

ElementList.prototype.name = 'ElementList';

/**
 * Returns the entire 'records' array.
 *
 * @returns {Array} An array of elements.
 */
ElementList.prototype.add = function(obj) {

  'use strict';

  this._records.push(obj);

  return this._records;
};

/**
 * Returns the entire 'records' array.
 *
 * @returns {Array} An array of elements.
 */
ElementList.prototype.all = function() {
  'use strict';
  return this._records;
};

/**
 * Returns the total number of elements.
 *
 * @returns {number} Total number of elements.
 */
ElementList.prototype.count = function() {
  'use strict';
  return this._records.length;
};

/**
 * Returns an array of elements created from the same constructor.
 *
 * @param {string} name The 'name' property.
 * @returns {Array} An array of elements.
 */
ElementList.prototype.getAllByName = function(name) {

  'use strict';

  var i, max, arr = [];

  for (i = 0, max = this._records.length; i < max; i++) {
    if (this._records[i].name === name) {
      arr[arr.length] = this._records[i];
    }
  }
  return arr;
};

/**
 * Updates the properties of elements created from the same constructor.
 *
 * @param {string} name The constructor name.
 * @param {Object} props A map of properties to update.
 * @returns {Array} An array of elements.
 * @example
 * exports.elementList.updatePropsByName('point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all point will turn black and double in size
 */
ElementList.prototype.updatePropsByName = function(name, props) {

  'use strict';

  var i, max, p, arr = this.getAllByName(name);

  for (i = 0, max = arr.length; i < max; i++) {
    for (p in props) {
      if (props.hasOwnProperty(p)) {
        arr[i][p] = props[p];
      }
    }
  }
  return arr;
};

/**
 * Finds an element by its 'id' and returns it.
 *
 * @param {string|number} id The element's id.
 * @returns {Object} The element.
 */
ElementList.prototype.getElement = function (id) {

  'use strict';

  var i, max, records = this._records;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      return records[i];
    }
  }
};

/**
 * Finds an element by its 'id' and removes it from its
 * world as well as the records array.
 *
 * @param {string|number} id The element's id.
 */
ElementList.prototype.destroyElement = function (id) {

  'use strict';

  var i, max, records = this._records;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      records[i].world.el.removeChild(records[i].el);
      records.splice(i, 1);
      break;
    }
  }
};

/**
 * Removes all elements from their world and resets
 * the 'records' array.
 *
 * @param {string|number} id The element's id.
 */
ElementList.prototype.destroyAll = function () {

  'use strict';

  var i, records = this._records;

  for (i = records.length - 1; i >= 0; i -= 1) {
    if (records[i].world) {
      records[i].world.el.removeChild(records[i].el);
    }
  }
  this._records = [];
};

/**
 * Removes all elements from their world and resets
 * the 'records' array.
 *
 * @param {World} world The world.
 */
ElementList.prototype.destroyByWorld = function (world) {

  'use strict';

  var i, records = this._records;

  for (i = records.length - 1; i >= 0; i -= 1) {
    if (records[i].world && records[i].world === world) {
      records[i].world.el.removeChild(records[i].el);
      records.splice(i, 1);
    }
  }
};
exports.ElementList = ElementList;