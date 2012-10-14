/*global Modernizr, exports */
/**
 * Creates a new Universe.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 * @param {boolean} [opt_options.isPlaying = true] Set to false to suspend the render loop.
 * @param {boolean} [opt_options.zSorted = false] Set to true to sort all elements by their zIndex before rendering.
 * @param {boolean} [opt_options.showStats = false] Set to true to render stats on startup.
 * @param {boolean} [opt_options.isDeviceMotion = false] Set to true add the devicemotion event listener.
 *    Typically use with accelerometer equipped devices.
 */
function Universe(opt_options) {

  'use strict';

  var i, max, records, me = this,
      options = opt_options || {};

  this.isPlaying = options.isPlaying || true;
  this.zSorted = !!options.zSorted;
  this.showStats = !!options.showStats;
  this.isDeviceMotion = !!options.isDeviceMotion;

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
    if (e.pageX && e.pageY) {
      exports.mouse.loc = new exports.Vector(e.pageX, e.pageY);
    } else if (e.clientX && e.clientY) {
      exports.mouse.loc = new exports.Vector(e.clientX, e.clientY);
    }
  });

  // key input
  exports.Utils.addEvent(document, 'keyup', function(e) {
    if (e.keyCode === exports.config.keyMap.pause) { // pause
      me.pauseSystem();
    } else if (e.keyCode === exports.config.keyMap.reset) { // reset system
      me.resetSystem();
    } else if (e.keyCode === exports.config.keyMap.stats) { // stats
      me.toggleStats();
    }
  });

  // touch input
  exports.Utils.addEvent(document, 'touchstart', function(e) {

    var allTouches = e.touches;

    if (allTouches.length === 2) { // stats
      me.toggleStats();
    } else if (allTouches.length === 3) { // pause
      me.pauseSystem();
    } else if (allTouches.length === 4) { // reset
      me.resetSystem();
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

  // device motion
  if (Modernizr.touch && this.isDeviceMotion) {
    this.addDeviceMotionEventListener();
  }

  // stats
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
 * @param {Object} opt_props A map of properties to update.
 * @param {string} opt_worldId The id of the world to update. If no id is passed,
 *    we update the first world in the universe.
 * @returns {Object} The last world.
 */
Universe.prototype.update = function(opt_props, opt_worldId) {

  'use strict';

  var i, props = exports.Interface.getDataType(opt_props) === 'object' ? opt_props : {},
      world;

  if (!opt_worldId) {
    world = this.first();
  } else {
    if (exports.Interface.getDataType(opt_worldId) === 'string') {
      world = this.getWorldById(opt_worldId);
    } else if (exports.Interface.getDataType(opt_worldId) === 'object') {
      world = opt_worldId;
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

  if (Modernizr.touch && props.isDeviceMotion) {
    this.addDeviceMotionEventListener();
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
 * Toggles pausing the FloraSystem animation loop.
 *
 * @returns {boolean} True if the system is playing. False if the
 *    system is not playing.
 */
Universe.prototype.pauseSystem = function() {

  'use strict';

  this.isPlaying = !this.isPlaying;
  if (this.isPlaying) {
    window.requestAnimFrame(exports.animLoop);
  }
  return this.isPlaying;
};

/**
 * Resets the FloraSystem.
 *
 * @returns {boolean} True if the system is playing. False if the
 *    system is not playing.
 */
Universe.prototype.resetSystem = function() {

  'use strict';

  var i, max, records;

  // loop thru each world and destroy all elements
  records = this.all();
  for (i = 0, max = records.length; i < max; i += 1) {
    exports.elementList.destroyByWorld(records[i].id);
  }
  // call initial setup
  exports.System.setup();
  // if system is paused, restart
  if (!this.isPlaying) {
    this.isPlaying = true;
    window.requestAnimFrame(exports.animLoop);
  }
};

/**
 * Toggles StatsDisplay.
 *
 * @returns {Object} An instance of StatsDisplay if display is active.
 *    Null if display is inactive.
 */
Universe.prototype.toggleStats = function() {

  'use strict';

  if (!this._statsDisplay) {
    this.createStats();
  } else {
    this.destroyStats();
  }
  return this._statsDisplay;
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

Universe.prototype.addDeviceMotionEventListener = function() {

  'use strict';

  var me = this;

  exports.Utils.addEvent(window, 'devicemotion', function(e) {
    me.devicemotion.call(me, e);
  });
};

/**
 * Called from a window devicemotion event, updates the world's gravity
 * relative to the accelerometer values.
 * @param {Object} e Event object.
 */
Universe.prototype.devicemotion = function(e) {

  'use strict';

  if (window.orientation === 0) {
    this.update({
      gravity: new exports.Vector(e.accelerationIncludingGravity.x,
        e.accelerationIncludingGravity.y * -1)
    });
  } else if (window.orientation === -90) {
    this.update({
      gravity: new exports.Vector(e.accelerationIncludingGravity.y,
        e.accelerationIncludingGravity.x )
    });
  } else {
    this.update({
      gravity: new exports.Vector(e.accelerationIncludingGravity.y * -1,
        e.accelerationIncludingGravity.x * -1)
    });
  }
};
exports.Universe = Universe;