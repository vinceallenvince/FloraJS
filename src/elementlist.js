/*global exports */
/**
    A module representing an ElementList.
    @module ElementList
 */

/**
 * Creates a new ElementList.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 */
function ElementList(opt_options) {

  'use strict';

  var options = opt_options || {};

  this.records = [];
}

/**
 * Define a name property.
 */
ElementList.name = 'elementlist';

/**
 * Returns the entire 'records' array.
 *
 * @return {Array.<Object>} arr An array of elements.
 */
ElementList.prototype.all = function() {
  'use strict';
  return this.records;
};

/**
 * Returns an array of elements created from the same constructor.
 *
 * @param {string} name The constructor name.
 * @return {Array.<Object>} arr An array of elements.
 */
ElementList.prototype.getAllByClass = function(name) {

  'use strict';

  var i, max, arr = [];

  for (i = 0, max = this.records.length; i < max; i++) {
    if (this.records[i].constructor.name === name) {
      arr[arr.length] = this.records[i];
    }
  }
  return arr;
};

/**
 * Updates the properties of elements created from the same constructor.
 *
 * @param {string} name The constructor name.
 * @param {Object} props A map of properties to update.
 * @example
 * exports.elementList.updatePropsByClass('Point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all point will turn black and double in size
 */
ElementList.prototype.updatePropsByClass = function(name, props) {

  'use strict';

  var i, max, p, arr = this.getAllByClass(name);

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
 * @return {Object} The element.
 */
ElementList.prototype.getElement = function (id) {

  'use strict';

  var i, max, records = this.records;

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

  var i, max, records = this.records;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      exports.world.el.removeChild(records[i].el);
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

  var i, max, records = this.records,
      world = exports.world.el,
      children = world.children;

  for (i = children.length; i >= 0; i -= 1) {
    if (records[i] && children[i] && children[i].className.search('floraElement') !== -1) {
      world.removeChild(records[i].el);
    }
  }

  this.records = [];
};
exports.ElementList = ElementList;