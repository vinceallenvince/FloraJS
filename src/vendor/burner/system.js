/*global window, document */
/*jshint supernew:true */

var Item = require('./item'),
    World = require('./world'),
    Vector = require('../vector2d-lib'),
    Utils = require('../drawing-utils-lib'),
    FPSDisplay = require('../fpsdisplay');

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/** @namespace */
var System = {
  name: 'System'
};

/**
 * Holds additional classes that can be defined at runtime.
 * @memberof System
 */
System.Classes = {
  'Item': Item
};

/**
 * Holds a vector describing the system gravity.
 * @memberof System
 */
System.gravity = new Vector(0, 1);

/**
 * Holds a vector describing the system wind.
 * @memberof System
 */
System.wind = new Vector();

/**
 * Stores references to all items in the system.
 * @memberof System
 * @private
 */
System._records = [];

/**
 * Stores references to all items removed from the system.
 * @memberof System
 * @private
 */
System._pool = [];

/**
 * Holds the current and last mouse/touch positions relative
 * to the browser window. Also, holds the current mouse velocity.
 * @public
 */
System.mouse = {
  location: new Vector(),
  lastLocation: new Vector(),
  velocity: new Vector()
};

/**
 * Increments with each call to System.loop.
 * @type {number}
 * @private
 */
System.clock = 0;

/**
 * System.loop() calls this function. Use to execute
 * a function in the animation loop outside of any items.
 * @type {Function}
 * @private
 */
System.frameFunction = null;

 /**
  * Call to execute any setup code before starting the animation loop.
  * @function setup
  * @param  {Object} opt_func   A function to run before the function exits.
  * @memberof System
  */
System.setup = function(opt_func) {

  var func = opt_func || function() {}, i, l, max;

  document.body.onorientationchange = System.updateOrientation;

  // save the current and last mouse position
  Utils.addEvent(document, 'mousemove', System._recordMouseLoc);

  // save the current and last touch position
  Utils.addEvent(window, 'touchstart', System._recordMouseLoc);
  Utils.addEvent(window, 'touchmove', System._recordMouseLoc);
  Utils.addEvent(window, 'touchend', System._recordMouseLoc);

  // listen for key up
  Utils.addEvent(window, 'keyup', System._keyup);

  // save the setup callback in case we need to reset the system.
  System.setupFunc = func;

  System.setupFunc.call(this);
};

 /**
  * Call to execute any setup code before starting the animation loop.
  * Note: Deprecated in v3. Use setup();
  * @function setup
  * @param  {Object} opt_func   A function to run before the function exits.
  * @param  {Object|Array} opt_worlds A instance or array of instances of World.
  * @memberof System
  */
System.init = function(opt_func, opt_worlds) {
  System.setup(opt_func, opt_worlds);
};

/**
 * Adds world to System records and worlds cache.
 *
 * @function _addWorld
 * @memberof System
 * @private
 * @param {Object} world An instance of World.
 */
System._addWorld = function(world) {
  System._records.push(world);
};

/**
 * Adds instances of class to _records and calls init on them.
 * @function add
 * @memberof System
 * @param {string} [opt_klass = 'Item'] The name of the class to add.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_world = System._records[0]] An instance of World to contain the item.
 * @returns {Object} An instance of the added item.
 */
System.add = function(opt_klass, opt_options, opt_world) {

  var klass = opt_klass || 'Item',
      options = opt_options || {},
      world = opt_world || System.firstWorld(),
      records = this._records, obj;

  // recycle object if one is available; obj must be an instance of the same class
  for (var i = 0, max = System._pool.length; i < max; i++) {
    if (System._pool[i].name === klass) {
      obj = System._cleanObj(System._pool.splice(i, 1)[0]);
      break;
    }
  }

  if (!obj) {
    if (klass.toLowerCase() === 'world') {
      obj = new World(options);
    } else if (System.Classes[klass]) {
      obj = new System.Classes[klass](options);
    } else {
      obj = new Item();
    }
  }

  options.name = klass;
  obj.init(world, options);
  records.push(obj);
  return obj;
};

/**
 * Removes all properties from the passed object.
 * @param  {Object} obj An object.
 * @return {Object}     The passed object.
 */
System._cleanObj = function(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      delete obj[prop];
    }
  }
  return obj;
};

/**
 * Removes an item from the system.
 * @function remove
 * @memberof System
 * @param {Object} obj The item to remove.
 */
System.remove = function (obj) {

  var i, max, records = System._records;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i].id === obj.id) {
      if (records[i].el) {
        records[i].el.style.visibility = 'hidden'; // hide item
      }
      System._pool[System._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      break;
    }
  }
};

/**
 * Removes an item from the system.
 * Note: Deprecated in v3. Use remove().
 * @function remove
 * @memberof System
 * @param {Object} obj The item to remove.
 */
System.destroy = function (obj) {
  System.remove(obj);
};

/**
 * Iterates over records.
 * @param {Function} [opt_function=function(){}] A function.
 * @function loop
 * @memberof System
 */
System.loop = function(opt_function) {

  var i, records = System._records,
      len = System._records.length,
      frameFunction = opt_function || function() {};

  if (!System.frameFunction) {
    System.frameFunction = frameFunction;
  }

  for (i = len - 1; i >= 0; i -= 1) {

    if (records[i] && records[i].step && !records[i].world.pauseStep) {

      if (records[i].life < records[i].lifespan) {
        records[i].life += 1;
      } else if (records[i].lifespan !== -1) {
        System.remove(records[i]);
        continue;
      }
      records[i].step();
    }
  }
  len = System._records.length; // check length in case items were removed in step()
  for (i = len - 1; i >= 0; i -= 1) {
    records[i].draw();
  }
  System.clock++;
  if (FPSDisplay.active) {
    FPSDisplay.update(len);
  }
  System.frameFunction.call(this);
  if (typeof window.requestAnimationFrame !== 'undefined') {
    window.requestAnimationFrame(System.loop);
  }
};

/**
 * Pauses the system and processes one step in records.
 *
 * @function _stepForward
 * @memberof System
 * @private
 */
System._stepForward = function() {

  var i, j, max, records = System._records,
      world, worlds = System.allWorlds();

  for (i = 0, max = worlds.length; i < max; i++) {
    world = worlds[i];
    world.pauseStep = true;
    for (j = records.length - 1; j >= 0; j -= 1) {
      if (records[j].step) {
        records[j].step();
      }
    }
    for (j = records.length - 1; j >= 0; j -= 1) {
      if (records[j].draw) {
        records[j].draw();
      }
    }
  }
  System.clock++;
};

/**
 * Saves the mouse/touch location relative to the browser window.
 *
 * @function _recordMouseLoc
 * @memberof System
 * @private
 */
System._recordMouseLoc = function(e) {

  var touch, world = System.firstWorld();

  System.mouse.lastLocation.x = System.mouse.location.x;
  System.mouse.lastLocation.y = System.mouse.location.y;

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  /**
   * Mapping window size to world size allows us to
   * lead an agent around a world that's not bound
   * to the window.
   */
  if (e.pageX && e.pageY) {
    System.mouse.location.x = Utils.map(e.pageX, 0, window.innerWidth, 0, world.width);
    System.mouse.location.y = Utils.map(e.pageY, 0, window.innerHeight, 0, world.height);
  } else if (e.clientX && e.clientY) {
    System.mouse.location.x = Utils.map(e.clientX, 0, window.innerWidth, 0, world.width);
    System.mouse.location.y = Utils.map(e.clientY, 0, window.innerHeight, 0, world.height);
  } else if (touch) {
    System.mouse.location.x = touch.pageX;
    System.mouse.location.y = touch.pageY;
  }

  System.mouse.velocity.x = System.mouse.lastLocation.x - System.mouse.location.x;
  System.mouse.velocity.y = System.mouse.lastLocation.y - System.mouse.location.y;
};

/**
 * Returns the first world in the system.
 *
 * @function firstWorld
 * @memberof System
 * @returns {null|Object} An instance of World.
 */
System.firstWorld = function() {
  return this._records.length ? this._records[0] : null;
};

/**
 * Returns all worlds.
 *
 * @function allWorlds
 * @memberof System
 * @return {Array.<World>} An array of worlds.
 */
System.allWorlds = function() {
  return System.getAllItemsByName('World');
};

/**
 * Returns an array of items created from the same constructor.
 *
 * @function getAllItemsByName
 * @memberof System
 * @param {string} name The 'name' property.
 * @param {Array} [opt_list = this._records] An optional list of items.
 * @returns {Array} An array of items.
 */
System.getAllItemsByName = function(name, opt_list) {

  var i, max, arr = [],
      list = opt_list || this._records;

  for (i = 0, max = list.length; i < max; i++) {
    if (list[i].name === name) {
      arr[arr.length] = list[i];
    }
  }
  return arr;
};

/**
 * Returns an array of items with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @function getAllItemsByAttribute
 * @memberof System
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' parameter must equal this param.
 * @param {string} name The item's name property must equal this param.
 * @returns {Array} An array of items.
 */
System.getAllItemsByAttribute = function(attr, opt_val, opt_name) { // TODO: add test

  var i, max, arr = [], records = this._records,
      val = typeof opt_val !== 'undefined' ? opt_val : null,
      name = opt_name || false;

  for (i = 0, max = records.length; i < max; i++) {
    if (typeof records[i][attr] !== 'undefined') {
      if (val !== null && records[i][attr] !== val) {
        continue;
      }
      if (name && records[i].name !== name) {
        continue;
      }
      arr[arr.length] = records[i];
    }
  }
  return arr;
};

/**
 * Handles orientation evenst and forces the world to update its bounds.
 *
 * @function updateOrientation
 * @memberof System
 */
System.updateOrientation = function() {
  var worlds = System.allWorlds(),
  i, max, l = worlds.length, size;
  for (i = 0; i < l; i++) {
    size = World.measureSize(worlds[i].el);
    worlds[i].width = size.width;
    worlds[i].height = size.height;
  }
};

/**
 * Handles keyup events.
 *
 * @function _keyup
 * @memberof System
 * @private
 * @param {Object} e An event.
 */
System._keyup = function(e) {

  var i, max, world, worlds = System.allWorlds();

  switch(e.keyCode) {
    case 39:
      System._stepForward();
      break;
    case 80: // p; pause/play
      for (i = 0, max = worlds.length; i < max; i++) {
        world = worlds[i];
        world.pauseStep = !world.pauseStep;
      }
      break;
    case 82: // r; reset
      System._resetSystem();
      break;
    case 83: // s; reset
      System._toggleFPS();
      break;
  }
};

/**
 * Resets the system.
 *
 * @function _resetSystem
 * @memberof System
 * @private
 */
System._resetSystem = function() {

  var i, max, world, worlds = System.allWorlds();

  for (i = 0, max = worlds.length; i < max; i++) {
    world = worlds[i];
    world.pauseStep = false;
    world.pauseDraw = false;

    while(world.el.firstChild) {
      world.el.removeChild(world.el.firstChild);
    }
  }

  System._records = [];
  System._pool = [];
  System.clock = 0;
  System.setup(System.setupFunc);
};

/**
 * Toggles stats display.
 *
 * @function _toggleFPS
 * @memberof System
 * @private
 */
System._toggleFPS = function() {
  if (!FPSDisplay.fps) {
    FPSDisplay.init();
  } else {
    FPSDisplay.active = !FPSDisplay.active;
  }

  if (!FPSDisplay.active) {
    FPSDisplay.hide();
  } else {
    FPSDisplay.show();
  }
};

module.exports = System;
