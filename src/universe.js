/*global exports */
/**
    A module representing a Universe.
    @module Universe
 */

/**
 * Creates a new Universe.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 */
function Universe(opt_options) {

  'use strict';

  var options = opt_options || {};

  this.records = [];
}

/**
 * Define a name property.
 */
Universe.name = 'universe';

/**
 * Adds a new World to the 'records' array.
 *
 * @return {Array.<Object>} arr An array of elements.
 */
Universe.prototype.addWorld = function(opt_options) {

  'use strict';

  var options = opt_options || {};

  this.records.push(new exports.World(options));

  // copy reference to new World in elementList
  exports.elementList.add(this.records[this.records.length - 1]);

  return this.records;
};

/**
 * Returns the first item in 'records' array.
 *
 * @return {Object} The first world.
 */
Universe.prototype.first = function() {

  'use strict';

  if (this.records[0]) {
    return this.records[0];
  } else {
    return null;
  }
};

/**
 * Returns the last item in 'records' array.
 *
 * @return {Object} The last world.
 */
Universe.prototype.last = function() {

  'use strict';

  if (this.records[this.records.length - 1]) {
    return this.records[this.records.length - 1];
  } else {
    return null;
  }
};

/**
 * Update the properties of a world.
 *
 * @return {Object} The last world.
 */
Universe.prototype.update = function(opt_props, opt_world) {

  'use strict';

  var i, props = exports.Interface.getDataType(opt_props) === 'object' ? opt_props : {},
      world;

  if (!opt_world) {
    world = this.first();
  } else {
    if (exports.Interface.getDataType(opt_world) === 'string') {
      world = this.getWorldById(opt_world);
    } else if (exports.Interface.getDataType(opt_world) === 'object') {
      world = opt_world;
    } else {
      exports.Utils.log('Universe: update: world param must be null, a string (an id) or reference to a world.');
      return;
    }
  }

  for (i in props) {
    if (props.hasOwnProperty(i)) {
      world[i] = props[i];
    }
  }

  if (props.el) { // if updating the element; update the width and height
    world.width = parseInt(world.el.style.width.replace('px', ''), 10);
    world.height = parseInt(world.el.style.height.replace('px', ''), 10);
  }

  if (props.showStats && window.addEventListener) {
    world.createStats();
  }
};

/**
 * Returns the entire 'records' array.
 *
 * @return {Array.<Object>} arr An array of elements.
 */
Universe.prototype.all = function() {
  'use strict';
  return this.records;
};

/**
 * Finds an element by its 'id' and returns it.
 *
 * @param {string|number} id The element's id.
 * @return {Object} The element.
 */
Universe.prototype.getWorldById = function (id) {

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
Universe.prototype.destroyWorld = function (id) {

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
Universe.prototype.destroyAll = function () {

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
exports.Universe = Universe;