/*global exports */
/**
 * Creates a new Universe.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 * @param {boolean} [opt_options.isPlaying = true] Set to false to suspend the render loop.
 * @param {boolean} [opt_options.zSorted = false] Set to true to sort all elements by their zIndex before rendering.
 * @param {boolean} [opt_options.showStats = false] Set to true to render mr doob stats on startup.
 */
function Universe(opt_options) {

  'use strict';

  var i, max, records, me = this,
      options = opt_options || {};

  this.isPlaying = options.isPlaying === false ? false : true;
  this.zSorted = !!options.zSorted;
  this.showStats = !!options.showStats;

  /**
   * Holds a list of references to worlds
   * in the universe.
   * @private
   */
  this._records = [];

  /**
   * Holds a reference to the stats display.
   * @private
   */
  this._statsDisplay = null;

  // Events

  // save the current and last mouse position
  exports.Utils.addEvent(document.body, 'mousemove', function(e) {
    exports.mouse.locLast = exports.mouse.loc.clone();
    exports.mouse.loc = new exports.Vector(e.pageX, e.pageY);
  });

  // toggle the world playstate
  exports.Utils.addEvent(document, 'keyup', function(e) {
    if (e.keyCode === exports.config.keyMap.toggleWorldPlaystate) { // pause
      me.isPlaying = !me.isPlaying;
      if (me.isPlaying) {
        window.requestAnimFrame(exports.animLoop);
      }
    } else if (e.keyCode === exports.config.keyMap.resetSystem) { // reset system
        // loop thru each world and destroy all elements
        records = me.all();
        for (i = 0, max = records.length; i < max; i += 1) {
          exports.elementList.destroyByWorld(records[i].id);
        }
        // call initial setup
        exports.System.setup();
        // if system is pause, restart
        if (!me.isPlaying) {
          me.isPlaying = true;
          window.requestAnimFrame(exports.animLoop);
        }
    } else if (e.keyCode === exports.config.keyMap.toggleStatsDisplay) { // stats
      if (!me._statsDisplay) {
        me.createStats();
      } else {
        me.destroyStats();
      }
    }
  });

  // key control
  exports.Utils.addEvent(document.body, 'keydown', function(e) {
    var i, max, elements = exports.elementList.all(),
        obj, desired, steer, target,
        r, theta, x, y;

    switch(e.keyCode) {
      case exports.config.keyMap.thrustLeft:
        for(i = 0, max = elements.length; i < max; i++) {
          if (elements[i].keyControl) {

            obj = elements[i];

            r = obj.world.width/2; // use angle to calculate x, y
            theta = exports.Utils.degreesToRadians(obj.angle - obj.turningRadius);
            x = r * Math.cos(theta);
            y = r * Math.sin(theta);

            target = exports.Vector.VectorAdd(new exports.Vector(x, y), obj.location);

            desired = exports.Vector.VectorSub(target, obj.location);
            desired.normalize();
            desired.mult(obj.velocity.mag() * 2);

            steer = exports.Vector.VectorSub(desired, obj.velocity);

            obj.applyForce(steer);
          }
        }
      break;
      case exports.config.keyMap.thrustUp:
        for(i = 0, max = elements.length; i < max; i++) {
          if (elements[i].keyControl) {

            obj = elements[i];

            r = obj.world.width/2;
            theta = exports.Utils.degreesToRadians(obj.angle);
            x = r * Math.cos(theta);
            y = r * Math.sin(theta);
            desired = new exports.Vector(x, y);
            desired.normalize();
            desired.mult(obj.thrust);
            desired.limit(obj.maxSpeed);
            elements[i].applyForce(desired);
          }
        }
      break;
      case exports.config.keyMap.thrustRight:
        for(i = 0, max = elements.length; i < max; i++) {
          if (elements[i].keyControl) {

            obj = elements[i];

            r = obj.world.width/2; // use angle to calculate x, y
            theta = exports.Utils.degreesToRadians(obj.angle + obj.turningRadius);
            x = r * Math.cos(theta);
            y = r * Math.sin(theta);

            target = exports.Vector.VectorAdd(new exports.Vector(x, y), obj.location);

            desired = exports.Vector.VectorSub(target, obj.location);
            desired.normalize();
            desired.mult(obj.velocity.mag() * 2);

            steer = exports.Vector.VectorSub(desired, obj.velocity);

            elements[i].applyForce(steer);
          }
        }
      break;
      case exports.config.keyMap.thrustDown:
        for(i = 0, max = elements.length; i < max; i++) {
          if (elements[i].keyControl) {
            elements[i].velocity.mult(0.5);
          }
        }
      break;
    }
  });

  if (this.showStats) {
    this.createStats();
  }
}

/**
 * Define a name property.
 */
Universe.prototype.name = 'universe';

/**
 * Adds a new World to the 'records' array.
 *
 * @returns {Array} An array of elements.
 */
Universe.prototype.addWorld = function(opt_options) {

  'use strict';

  var options = opt_options || {};

  this._records.push(new exports.World(options));

  // copy reference to new World in elementList
  exports.elementList.add(this._records[this._records.length - 1]);

  return this._records;
};

/**
 * Returns the first item in 'records' array.
 *
 * @returns {Object} The first world.
 */
Universe.prototype.first = function() {

  'use strict';

  if (this._records[0]) {
    return this._records[0];
  } else {
    return null;
  }
};

/**
 * Returns the last item in 'records' array.
 *
 * @returns {Object} The last world.
 */
Universe.prototype.last = function() {

  'use strict';

  if (this._records[this._records.length - 1]) {
    return this._records[this._records.length - 1];
  } else {
    return null;
  }
};

/**
 * Update the properties of a world.
 *
 * @returns {Object} The last world.
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
};

/**
 * Returns the entire 'records' array.
 *
 * @returns {Array} arr An array of elements.
 */
Universe.prototype.all = function() {
  'use strict';
  return this._records;
};

/**
 * Returns the total number of worlds.
 *
 * @returns {number} Total number of worlds.
 */
Universe.prototype.count = function() {
  'use strict';
  return this._records.length;
};

/**
 * Finds an element by its 'id' and returns it.
 *
 * @param {string|number} id The element's id.
 * @returns {Object} The element.
 */
Universe.prototype.getWorldById = function (id) {

  'use strict';

  var i, max, records = this._records;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      return records[i];
    }
  }
  return null;
};

/**
 * Removes a world and its elements.
 *
 * @param {string} id The element's id.
 */
Universe.prototype.destroyWorld = function (id) {

  'use strict';

  var i, max, records = this._records;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {

      var parent = records[i].el.parentNode;

      // is this world the body element?
      if (records[i].el === document.body) {
        // remove all elements but not the <body>
        exports.elementList.destroyAll();
      } else {
        // remove ell elements and world
        exports.elementList.destroyByWorld(records[i]);
        parent.removeChild(records[i].el);
      }
      records.splice(i, 1);
      break;
    }
  }
};

/**
 * Removes all worlds and resets the 'records' array.
 */
Universe.prototype.destroyAll = function () {

  'use strict';

  exports.elementList.destroyAll();

  for (var i = this._records.length - 1; i >= 0; i -= 1) {
    this.destroyWorld(this._records[i].id);
  }
};

/**
 * Increments each world's clock.
 */
Universe.prototype.updateClocks = function () {

  'use strict';

  for (var i = 0, max = this._records.length; i < max; i += 1) {
    this._records[i].clock += 1;
  }
};

/**
 * Creates a new instance of the StatsDisplay.
 */
Universe.prototype.createStats = function() {

  'use strict';

  this._statsDisplay = new exports.StatsDisplay();
};

/**
 * Destroys an instance of the StatsDisplay
 */
Universe.prototype.destroyStats = function() {

  'use strict';

  var el = document.getElementById('statsDisplay');

  this._statsDisplay = null;

  if (el) {
    el.parentNode.removeChild(el);
  }
};
exports.Universe = Universe;