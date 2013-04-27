/*
Mantle
Copyright (c) 2013 Vince Allen
vince@vinceallen.com
http://www.vinceallen.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/* Version: 1.1.0 */
/* Build time: April 27, 2013 10:28:51 */
/** @namespace */
function Mantle(exports, opt_parent) {

'use strict';

/**
* If using Mantle as a renderer in a
* parent object, pass a reference to the parent
* via the opt_parent param.
*/
var parent = opt_parent || null;
/*global window */
/**
 * RequestAnimationFrame shim layer with setTimeout fallback
 * @param {function} callback The function to call.
 * @returns {function|Object} An animation frame or a timeout object.
 */
window.requestAnimFrame = (function(callback){

  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();
/*global exports */
/**
 * @namespace
 */
var PubSub = {};

PubSub.subscribe = function (ev, callback) {
  // Create _callbacks object, unless it already exists
  var calls = this._callbacks || (this._callbacks = {});

  // Create an array for the given event key, unless it exists, then
  // append the callback to the array
  (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
  return this;
};

PubSub.publish = function () {
  // Turn arguements into a real array
  var args = Array.prototype.slice.call(arguments, 0);

  // Extract the first argument, the event name
  var ev = args.shift();

  // Return if there isn't a _callbacks object, or
  // if it doesn't contain an array for the given event
  var list, calls, i, l;
  if (!(calls = this._callbacks)) {
    return this;
  }
  if (!(list = this._callbacks[ev])) {
    return this;
  }

  // Invoke the callbacks
  for (i = 0, l = list.length; i < l; i += 1) {
    list[i].apply(this, args);
  }
  return this;
};

exports.PubSub = PubSub;
/*global exports, window, document */
/*jshint supernew:true */
/**
 * @namespace
 */
var Utils = {};

/**
 * Add an event listener to a DOM element.
 *
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
Utils.addEvent = function(target, eventType, handler) {

  if (target.addEventListener) { // W3C
    this.addEventHandler = function(target, eventType, handler) {
      target.addEventListener(eventType, handler, false);
    };
  } else if (target.attachEvent) { // IE
    this.addEventHandler = function(target, eventType, handler) {
      target.attachEvent("on" + eventType, handler);
    };
  }
  this.addEventHandler(target, eventType, handler);
};

/**
 * Generates a psuedo-random number within a range.
 *
 * @param {number} low The low end of the range.
 * @param {number} high The high end of the range.
 * @param {boolean} [flt] Set to true to return a float.
 * @returns {number} A number.
 */
Utils.getRandomNumber = function(low, high, flt) {
  if (flt) {
    return Math.random()*(high-(low-1)) + low;
  }
  return Math.floor(Math.random()*(high-(low-1))) + low;
};

/**
 * @returns {Object} The current window width and height.
 * @example getWindowDim() returns {width: 1024, height: 768}
 */
Utils.getWindowSize = function() {

  var d = {
    'width' : false,
    'height' : false
  };
  if (typeof(window.innerWidth) !== "undefined") {
    d.width = window.innerWidth;
  } else if (typeof(document.documentElement) !== "undefined" &&
      typeof(document.documentElement.clientWidth) !== "undefined") {
    d.width = document.documentElement.clientWidth;
  } else if (typeof(document.body) !== "undefined") {
    d.width = document.body.clientWidth;
  }
  if (typeof(window.innerHeight) !== "undefined") {
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== "undefined" &&
      typeof(document.documentElement.clientHeight) !== "undefined") {
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== "undefined") {
    d.height = document.body.clientHeight;
  }
  return d;
};

/**
 * Returns a new object with all properties and methods of the
 * old object copied to the new object's prototype.
 *
 * @param {Object} object The object to clone.
 * @returns {Object} An object.
 */
Utils.clone = function(object) {

  function Object() {}
  Object.prototype = object;
  return new Object;
};

/**
 * Use to extend the properties and methods of a superClass
 * onto a subClass.
 */
Utils.extend = function(subClass, superClass) {

  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
};

/**
 * Returns the data type of the passed argument.
 *
 * @param {*} element The variable to test.
*/
Utils.getDataType = function(element) {

  if (Object.prototype.toString.call(element) === '[object Array]') {
    return 'array';
  }

  if (Object.prototype.toString.call(element) === '[object NodeList]') {
    return 'nodeList';
  }

  return typeof element;
};

exports.Utils = Utils;
/*global exports */
/**
 * Creates a new Element.
 * @constructor
 */
function Element(opt_options) {

  this.options = opt_options || {};
  this.name = this.options.name || 'Element';
  this.id = this.name + exports.System._getNewId();

  return this;
}

/**
 * Sets element's properties via initial options.
 * @private
 */
Element.prototype._init = function() {

  var i, options = this.options;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    throw new Error('Element: A valid world object is required for a new Element.');
  }

  // re-assign all options
  for (i in options) {
    if (options.hasOwnProperty(i)) {
      if (exports.Utils.getDataType(options[i]) === 'function') {
        this[i] = options[i]();
      } else {
        this[i] = options[i];
      }
    }
  }

  this._el.style.top = 0;
  this._el.style.left = 0;
};

/**
 * Updates the corresponding DOM elements style property.
 */
Element.prototype.draw = function() {

  var cssText, el = this._el;

  if (el) {
    cssText = this._getCSSText({
      x: this.location.x - this.width / 2,
      y: this.location.y - this.height / 2,
      width: this.width,
      height: this.height,
      color: this.color,
      visibility: this.visibility
    });
    el.style.cssText = cssText;
  }
  return cssText;
};

/**
 * Concatenates a new cssText strings.
 */
Element.prototype._getCSSText = function(props) {

  var position, system = exports.System;

  if (system.supportedFeatures.csstransforms3d) {
    position = [
      '-webkit-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)',
      '-moz-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)',
      '-o-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)',
      '-ms-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)'
    ].join(';');
  } else if (system.supportedFeatures.csstransforms) {
    position = [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)'
    ].join(';');
  } else {
    position = [
      'position: absolute',
      'left: ' + props.x + 'px',
      'top: ' + props.y + 'px'
    ].join(';');
  }

  if (exports.Utils.getDataType(props.color) === 'array') {
    props.background = 'rgb(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';
  } else {
    props.background = 'transparent';
  }

  return [
    position,
    'width: ' + props.width + 'px',
    'height: ' + props.height + 'px',
    'background-color: ' + props.background,
    'visibility: ' + props.visibility
  ].join(';');
};

exports.Element = Element;
/*global exports */
/*jshint supernew:true */
/**
 * Creates a new Vector.
 *
 * @param {number} [opt_x = 0] The x location.
 * @param {number} [opt_y = 0] The y location.
 * @constructor
 */
function Vector(opt_x, opt_y) {
  var x = opt_x || 0,
      y = opt_y || 0;
  this.x = x;
  this.y = y;
}

/**
 * Subtract two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorSub = function(v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Add two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorAdd = function(v1, v2) {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Multiply a vector by a scalar value.
 *
 * @param {number} v A vector.
 * @param {number} n Vector will be multiplied by this number.
 * @returns {Object} A new Vector.
 */
Vector.VectorMult = function(v, n) {
  return new Vector(v.x * n, v.y * n);
};

/**
 * Divide two vectors.
 *
 * @param {number} v A vector.
 * @param {number} n Vector will be divided by this number.
 * @returns {Object} A new Vector.
 */
Vector.VectorDiv = function(v, n) {
  return new Vector(v.x / n, v.y / n);
};

/**
 * Calculates the distance between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {number} The distance between the two vectors.
 */
Vector.VectorDistance = function(v1, v2) {
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
};

/**
 * Get the midpoint between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorMidPoint = function(v1, v2) {
  return Vector.VectorAdd(v1, v2).div(2); // midpoint = (v1 + v2)/2
};

/**
 * Get the angle between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {number} An angle.
 */
Vector.VectorAngleBetween = function(v1, v2) {
  var dot = v1.dot(v2),
  theta = Math.acos(dot / (v1.mag() * v2.mag()));
  return theta;
};

Vector.prototype.name = 'Vector';

/**
* Returns an new vector with all properties and methods of the
* old vector copied to the new vector's prototype.
*
* @returns {Object} A vector.
*/
Vector.prototype.clone = function() {
  function F() {}
  F.prototype = this;
  return new F;
};

/**
 * Adds a vector to this vector.
 *
 * @param {Object} vector The vector to add.
 * @returns {Object} This vector.
 */
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
  return this;
};

/**
 * Subtracts a vector from this vector.
 *
 * @param {Object} vector The vector to subtract.
 * @returns {Object} This vector.
 */
Vector.prototype.sub = function(vector) {
  this.x -= vector.x;
  this.y -= vector.y;
  return this;
};

/**
 * Multiplies this vector by a passed value.
 *
 * @param {number} n Vector will be multiplied by this number.
 * @returns {Object} This vector.
 */
Vector.prototype.mult = function(n) {
  this.x *= n;
  this.y *= n;
  return this;
};

/**
 * Divides this vector by a passed value.
 *
 * @param {number} n Vector will be divided by this number.
 * @returns {Object} This vector.
 */
Vector.prototype.div = function(n) {
  this.x = this.x / n;
  this.y = this.y / n;
  return this;
};

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {number} The vector's magnitude.
 */
Vector.prototype.mag = function() {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

/**
 * Limits the vector's magnitude.
 *
 * @param {number} high The upper bound of the vector's magnitude.
 * @returns {Object} This vector.
 */
Vector.prototype.limit = function(high) {
  if (this.mag() > high) {
    this.normalize();
    this.mult(high);
  }
  return this;
};

/**
 * Divides a vector by its magnitude to reduce its magnitude to 1.
 * Typically used to retrieve the direction of the vector for later manipulation.
 *
 * @returns {Object} This vector.
 */
Vector.prototype.normalize = function() {
  var m = this.mag();
  if (m !== 0) {
    return this.div(m);
  }
};

/**
 * Calculates the distance between this vector and a passed vector.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} The distance between the two vectors.
 */
Vector.prototype.distance = function(vector) {
  return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
};

/**
 * Rotates a vector using a passed angle in radians.
 *
 * @param {number} radians The angle to rotate in radians.
 * @returns {Object} This vector.
 */
Vector.prototype.rotate = function(radians) {
  var cos = Math.cos(radians),
    sin = Math.sin(radians),
    x = this.x,
    y = this.y;

  this.x = x * cos - y * sin;
  this.y = x * sin + y * cos;
  return this;
};

/**
 * Calculates the midpoint between this vector and a passed vector.
 *
 * @param {Object} v1 The first vector.
 * @param {Object} v1 The second vector.
 * @returns {Object} A vector representing the midpoint between the passed vectors.
 */
Vector.prototype.midpoint = function(vector) {
  return Vector.VectorAdd(this, vector).div(2);
};

/**
 * Calulates the dot product.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} A vector.
 */
Vector.prototype.dot = function(vector) {
  if (this.z && vector.z) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  return this.x * vector.x + this.y * vector.y;
};

exports.Vector = Vector;
/*global exports, document */
/**
 * Creates a new FeatureDetector.
 *
 * Use the FeatureDetector to test for specific browser features.
 * @constructor
 */
function FeatureDetector() {

}

/**
 * Checks if the class has a method to detect the passed feature.
 * If so, it calls the method.
 *
 * @param {string} feature The feature to check.
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.detect = function(feature) {

  if (!this[feature]) {
    return false;
  }

  return this[feature].call(this);
};

/**
 * Checks if CSS Transforms are supported.
 *
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.csstransforms = function() {

  var transforms = [
    '-webkit-transform: translateX(1px) translateY(1px)',
    '-moz-transform: translateX(1px) translateY(1px)',
    '-o-transform: translateX(1px) translateY(1px)',
    '-ms-transform: translateX(1px) translateY(1px)'
  ].join(';');

  var docFrag = document.createDocumentFragment();
  var div = document.createElement('div');
  docFrag.appendChild(div);
  div.style.cssText = transforms;

  var styles = [
    div.style.transform,
    div.style.webkitTransform,
    div.style.MozTransform,
    div.style.OTransform,
    div.style.msTransform
  ];
  var check = false;

  for (var i = 0; i < styles.length; i += 1) {
    if (styles[i]) {
      check = true;
      break;
    }
  }

  return check;
};

/**
 * Checks if CSS 3D transforms are supported.
 *
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.csstransforms3d = function() {

  var transforms = [
    '-webkit-transform: translate3d(1px, 1px, 0)',
    '-moz-transform: translate3d(1px, 1px, 0)',
    '-o-transform: translate3d(1px, 1px, 0)',
    '-ms-transform: translate3d(1px, 1px, 0)'
  ].join(';');

  var docFrag = document.createDocumentFragment();
  var div = document.createElement('div');
  docFrag.appendChild(div);
  div.style.cssText = transforms;

  var styles = [
    div.style.transform,
    div.style.webkitTransform,
    div.style.MozTransform,
    div.style.OTransform,
    div.style.msTransform
  ];
  var check = false;

  for (var i = 0; i < styles.length; i += 1) {
    if (styles[i]) {
      check = true;
      break;
    }
  }

  return check;
};

/**
 * Checks if touch events are supported.
 *
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.touch = function() {

  var el = document.createElement('div');
  el.setAttribute('ongesturestart', 'return;');
  if (typeof el.ongesturestart === "function") {
    return true;
  }
  return false;
};

exports.FeatureDetector = FeatureDetector;
/*global exports, document, window */
/**
 * Creates a new StatsDisplay object.
 *
 * Use this class to create a field in the
 * top-left corner that displays the current
 * frames per second and total number of elements
 * processed in the System.animLoop.
 *
 * Note: StatsDisplay will not function in browsers
 * whose Date object does not support Date.now().
 * These include IE6, IE7, and IE8.
 *
 * @constructor
 */
function StatsDisplay() {

  var labelContainer, label;

  /**
   * Set to false to stop requesting animation frames.
   * @private
   */
  this._active = true;

  /**
   * Frames per second.
   * @private
   */
  this._fps = 0;

  /**
   * The current time.
   * @private
   */
  if (Date.now) {
    this._time = Date.now();
  } else {
    this._time = 0;
  }

  /**
   * The time at the last frame.
   * @private
   */
  this._timeLastFrame = this._time;

  /**
   * The time the last second was sampled.
   * @private
   */
  this._timeLastSecond = this._time;

  /**
   * Holds the total number of frames
   * between seconds.
   * @private
   */
  this._frameCount = 0;

  /**
   * A reference to the DOM element containing the display.
   * @private
   */
  this._el = document.createElement('div');
  this._el.id = 'statsDisplay';
  this._el.className = 'statsDisplay';
  this._el.style.color = 'white';

  /**
   * A reference to the textNode displaying the total number of elements.
   * @private
   */
  this._totalElementsValue = null;

  /**
   * A reference to the textNode displaying the frame per second.
   * @private
   */
  this._fpsValue = null;

  // create 3dTransforms label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('trans3d: ');
  labelContainer.appendChild(label);
  this._el.appendChild(labelContainer);

  // create textNode for totalElements
  this._3dTransformsValue = document.createTextNode(exports.System.supportedFeatures.csstransforms3d);
  this._el.appendChild(this._3dTransformsValue);

  // create totol elements label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('total elements: ');
  labelContainer.appendChild(label);
  this._el.appendChild(labelContainer);

  // create textNode for totalElements
  this._totalElementsValue = document.createTextNode('0');
  this._el.appendChild(this._totalElementsValue);

  // create fps label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('fps: ');
  labelContainer.appendChild(label);
  this._el.appendChild(labelContainer);

  // create textNode for fps
  this._fpsValue = document.createTextNode('0');
  this._el.appendChild(this._fpsValue);

  document.body.appendChild(this._el);

  /**
   * Initiates the requestAnimFrame() loop.
   */
  this._update(this);
}

/**
 * Returns the current frames per second value.
 * @returns {number} Frame per second.
 */
StatsDisplay.prototype.getFPS = function() {
  return this._fps;
};

/**
 * If 1000ms have elapsed since the last evaluated second,
 * _fps is assigned the total number of frames rendered and
 * its corresponding textNode is updated. The total number of
 * elements is also updated.
 *
 * This function is called again via requestAnimFrame().
 *
 * @private
 */
StatsDisplay.prototype._update = function(me) {

  var elementCount = exports.System.count();

  if (Date.now) {
    me._time = Date.now();
  } else {
    me._time = 0;
  }
  me._frameCount++;

  // at least a second has passed
  if (me._time > me._timeLastSecond + 1000) {

    me._fps = me._frameCount;
    me._timeLastSecond = me._time;
    me._frameCount = 0;

    me._fpsValue.nodeValue = me._fps;
    me._totalElementsValue.nodeValue = elementCount;
    me._3dTransformsValue.nodeValue = exports.System.supportedFeatures.csstransforms3d;
  }

  var reqAnimFrame = (function (me) {
    return (function() {
      me._update(me);
    });
  })(this);

  if (this._active) {
    window.requestAnimFrame(reqAnimFrame);
  }
};

/**
 * Removes statsDisplay from DOM.
 */
StatsDisplay.prototype.destroy = function() {
  this._active = false;
  if (document.getElementById(this._el.id)) {
    document.body.removeChild(this._el);
  }
};

StatsDisplay.prototype.name = 'StatsDisplay';

exports.StatsDisplay = StatsDisplay;
/*global exports, window, document, Modernizr, parent */
/**
 * Creates a new System.
 * @constructor
 */
function System() {
  this.name = 'system';
}

/**
 * Stores references to all elements in the system.
 * @private
 */
System._records = {
  lookup: {},
  list: []
};

/**
 * Stores references to all worlds in the system.
 * @private
 */
System._worldsCache = {
  lookup: {},
  list: []
};

/**
 * Stores additional caches.
 * @private
 */
System._Caches = {};

/**
 * Used to create unique ids.
 * @private
 */
System._idCount = 0;

/**
 * Holds the current and last mouse positions relative
 * to the browser window. Also, holds the current mouse velocity.
 * @public
 */
System.mouse = {
  location: new exports.Vector(),
  lastLocation: new exports.Vector(),
  velocity: new exports.Vector()
};

/**
 * Stores the time in milliseconds of the last
 * resize event. Used to pause renderer during resize
 * and resume when resize is complete.
 *
 * @private
 */
System._resizeTime = 0;

/**
 * Initializes the system by saving references to the system worlds and running a
 * setup script if passed. If no world is passed, uses document.body. Also listens
 * for resize events on the window.
 *
 * @param {Function} opt_setup A function to run before System's _update loop starts.
 * @param {Object|Array} opt_worlds A single reference or an array of
 *    references to DOM elements representing System worlds.
 * @parm {Object} opt_supportedFeatures Pass a map of supported browser features to
 *    override an system provided feature detection.
 * @param {boolean} opt_noStart If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 * @param {boolean} opt_reset If true, user input and pubsub event listeners are not added.
 * @example This example assumes Mantle lives under the 'Anim' namespace. The setup
 *    function updates the world's gravity and coefficient of friction. Passing 'null'
 *    forces the system to use document.body as the world. It overrides the system
 *    feature detection by passing its own features. It also delays starting the system.
 *
 * Anim.Mantle.System.create(function() {
 *   Anim.World.update({
 *     gravity: new Anim.Vector(0, 1),
 *     c: 0.1
 *   });
 * },
 * null,
 * {
 *   csstransforms3d: Modernizr.csstransforms3d,
 *   csstransforms: Modernizr.csstransforms
 * },
 * true);
 */
System.create = function(opt_setup, opt_worlds, opt_supportedFeatures, opt_noStart) {

  var i, max, records = this._records.list,
      setup = opt_setup || function() {},
      worlds = opt_worlds, world, supportedFeatures = opt_supportedFeatures,
      noStart = opt_noStart, utils = exports.Utils,
      worldsCache = System.allWorlds(),
      worldsCacheLookup = System._worldsCache.lookup;

  System._setup = setup;
  System._worlds = worlds;
  System._noStart = noStart;

  // check if supportedFeatures were passed
  if (!supportedFeatures) {
    this.supportedFeatures = System._getSupportedFeatures();
  } else if (utils.getDataType(supportedFeatures) === 'object') {
    this.supportedFeatures = supportedFeatures;
  } else {
    throw new Error('System: supportedFeatures should be passed as an object.');
  }

  // if no world element is passed, use document.body.
  if (!worlds) {
    records[records.length] = new exports.World(document.body);
    worldsCache[worldsCache.length] = records[records.length - 1];
    worldsCacheLookup[worldsCache[worldsCache.length - 1].id] = true;
  // if one world is passed
  } else if (utils.getDataType(worlds) === 'object') {
    records[records.length] = new exports.World(worlds);
    worldsCache[worldsCache.length] = records[records.length - 1];
    worldsCacheLookup[worldsCache[worldsCache.length - 1].id] = true;
  // if an array of worlds is passed
  } else if (utils.getDataType(worlds) === 'array' && worlds.length) {
    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      if (world && utils.getDataType(world) === 'object') {
        records[records.length] = new exports.World(world);
        worldsCache[worldsCache.length] = records[records.length - 1];
        worldsCacheLookup[worldsCache[worldsCache.length - 1].id] = true;
      }
    }
  }

  // run the initial setup function
  if (utils.getDataType(setup) === 'function') {
    setup.call(this);
  }

  // if system is not meant to start immediately, start it.
  if (!noStart) {
    this._update();
  }

  // save the current and last mouse position
  exports.Utils.addEvent(document, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // save the current and last touch position
  exports.Utils.addEvent(window, 'touchstart', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  exports.Utils.addEvent(window, 'touchmove', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  exports.Utils.addEvent(window, 'touchend', function(e) {
    System._recordMouseLoc.call(System, e);
  });

   // listen for window resize
  exports.Utils.addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });

  return System.allElements();
};

/**
 * Increments idCount and returns the value. Use when
 * generating a unique id.
 */
System._getNewId = function() {
  this._idCount++;
  return this._idCount;
};

/**
 * Returns the current id count.
 */
System._getIdCount = function() {
  return this._idCount;
};

/**
 * Iterates over _records array and calls step() and draw() to
 * update properties and render their corresponding DOM element.
 */
System._update = function() {

  var i, max, _update, records = this.allElements(), record,
      worlds = this.allWorlds();

  // check for resize stop
  if (this._resizeTime && new Date().getTime() - this._resizeTime > 100) {
    this._resizeTime = 0;
    for (i = 0, max = worlds.length; i < max; i += 1) {
      worlds[i].pauseStep = false;
    }
  }

  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step && !record.world.pauseStep) {
      record.step();
    }
  }

  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.draw && !record.world.pauseDraw) {
      record.draw();
    }
  }

  _update = (function (me) {
    return (function() {
      me._update(me);
    });
  })(this);
  window.requestAnimFrame(_update);
};

/**
 * Returns a reference to a world.
 *
 * @param {Object} world A DOM element representing a world.
 * @returns {Object} A world.
 */
System.getWorld = function(world) {
  var records = this._records.list;
  for (var i = 0, max = records.length; i < max; i++) {
    if (records[i].el === world) {
      return records[i];
    }
  }
  return null;
};

/**
 * Returns all worlds in the System.
 *
 * @returns {Array} A list of all worlds in the System.
 */
System.allWorlds = function() {
  return this._worldsCache.list;
};

/**
 * Checks if world exists.
 *
 * @param {string} id A world id.
 * @returns {boolen} True if world exists. False if not.
 */
System.hasWorld = function(id) {
  return System._worldsCache.lookup[id];
};

/**
 * Starts the system.
 */
System.start = function() {
  this._update();
};

/**
 * Adds an object to a cache based on its constructor name.
 *
 * @param {Object} obj An object.
 * returns {Object} The cache that received the passed object.
 */
System.updateCache = function(obj) {

  // Create cache object, unless it already exists
  var cache = System._Caches[obj.name] ||
      (System._Caches[obj.name] = {
        lookup: {},
        list: []
      });

  cache.list[cache.list.length] = obj;
  cache.lookup[obj.id] = true;
  return cache;
};

/**
 * Assigns the given 'val' to the given object's record in System._Caches.
 *
 * @param {Object} obj An object.
 * @param {Boolean} val True if object is active, false if object is destroyed.
 */
System._updateCacheLookup = function(obj, val) {

  var cache = System._Caches[obj.name];

  if (cache) {
    cache.lookup[obj.id] = val;
  }
};

/**
 * Adds an object to the system.
 *
 * @param {string} klass The object's class. The system assumes
 *    Mantle lives under a top level namespace that holds classes
 *    representing objects that live in the system.
 * @param {Object} opt_options A map of properties used by the
 *    object's constuctor to define the object's attributes.
 * @returns {Object} The last element in the system.
 * @example The following exmaple adds a new Mover with a mass
 *    of 100 to the system.
 *
 * this.add('Mover', {
 *  mass: 100
 * });
 */
System.add = function(klass, opt_options) {

  var options = opt_options || {},
      records = this.allElements(),
      recordsLookup = this._records.lookup,
      parentNode = null;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    options.world = records[0];
  } else {
    // if a world was passed, find its reference in _records
    options.world = System.getWorld(options.world.el);
  }

  // recycle object if one is available
  var pool = this.getAllElementsByName(klass, options.world._pool);
  if (pool.length) {

    //var pool = this.getAllElementsByName(klass, options.world._pool);
    //if (pool.length) {
      for (var i = 0, max = options.world._pool.length; i < max; i++) {
        if (options.world._pool[i].name === klass) {
          // pop off _pool array
          records[records.length] = options.world._pool.splice(i, 1)[0];
          // pass new options
          records[records.length - 1].options = options;
          // update Cache lookup
          System._updateCacheLookup(records[records.length - 1], true);
          break;
        }
      }
    //}
  } else {
    /**
     * No pool objects available, create a new one.
     * Add the instance to the records list array.
     * Assumes 'klass' has extended Element.
     * If not, tries calling Element directly.
     */
    if (parent && parent[klass]) {
      records[records.length] = new parent[klass](options);
    } else {
      records[records.length] = new exports[klass](options);
    }
  }
  /**
   * Initialize the new object.
   * If object is static, it should not have
   * an _init() function or a step() function.
   */
  if (records[records.length - 1]._init) {
    records[records.length - 1]._init();
  }
  // add the new object to records lookup table; value = parentNode of its DOM element
  if (records[records.length - 1]._el) {
    parentNode = records[records.length - 1]._el.parentNode;
  }
  recordsLookup[records[records.length - 1].id] = parentNode;

  return this.lastElement();
};


/**
 * Returns the total number of elements.
 *
 * @returns {number} Total number of elements.
 */
System.count = function() {
  return this._records.list.length;
};

/**
 * Checks if system has an element.
 *
 * @param {string} id An element id.
 * @returns {boolean} True if element exists. False if not.
 */
System.hasElement = function(id) {
  return System._records.lookup[id];
};

/**
 * Returns all elements in the System.
 *
 * @returns {Array} A list of all elements in the System.
 */
System.allElements = function() {
  return this._records.list;
};

/**
 * Returns the first element in the System.
 *
 * @returns {Object} The first element in the System.
 */
System.firstElement = function() {
  return this._records.list[0];
};

/**
 * Returns the last element in the System.
 *
 * @returns {Object} The last element in the System.
 */
System.lastElement = function() {
  return this._records.list[this._records.list.length - 1];
};

/**
 * Returns an array of elements created from the same constructor.
 *
 * @param {string} name The 'name' property.
 * @param {Array} [opt_list = this._records] An optional list of elements.
 * @returns {Array} An array of elements.
 */
System.getAllElementsByName = function(name, opt_list) {

  var i, max, arr = [],
      list = opt_list || this._records.list;

  for (i = 0, max = list.length; i < max; i++) {
    if (list[i].name === name) {
      arr[arr.length] = list[i];
    }
  }
  return arr;
};

/**
 * Returns an array of elements with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' property must equal 'val'.
 * @returns {Array} An array of elements.
 */
System.getAllElementsByAttribute = function(attr, opt_val) {

  var i, max, arr = [], val = opt_val !== undefined ? opt_val : null;

  for (i = 0, max = this._records.list.length; i < max; i++) {
    if (this._records.list[i][attr] !== undefined) {
      if (val !== null && this._records.list[i][attr] !== val) {
        continue;
      }
      arr[arr.length] = this._records.list[i];
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
 * System.updateElementPropsByName('point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all points will turn black and double in size
 */
System.updateElementPropsByName = function(name, props) {

  var i, max, p, arr = this.getAllElementsByName(name);

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
System.getElement = function(id) {

  var i, max, records = this._records;

  for (i = 0, max = records.list.length; i < max; i += 1) {
    if (records.list[i].id === id) {
      return records.list[i];
    }
  }
  return null;
};

/**
 * Updates the properties of an element.
 *
 * @param {Object} element The element.
 * @param {Object} props A map of properties to update.
 * @returns {Object} The element.
 * @example
 * System.updateElement(myElement, {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // element will turn black and double in size
 */
System.updateElement = function(element, props) {

  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      element[p] = props[p];
    }
  }
  return element;
};

/**
 * Removes an element from a world.
 *
 * @param {Object} obj The element to remove.
 */
System.destroyElement = function (obj) {

  var i, max,
      records = this._records.list;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === obj.id) {
      records[i]._el.style.visibility = 'hidden'; // hide element
      records[i]._el.style.top = '-5000px';
      records[i]._el.style.left = '-5000px';
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      System._updateCacheLookup(obj, false);
      break;
    }
  }
};

/**
 * Checks if the Modernizr object exists. If so, returns
 * supported transforms. If not, returns false for transforms support.
 *
 * returns {Object} A map of supported features.
 * @static
 * @private
 */
System._getSupportedFeatures = function() {

  var features;

  if (window.Modernizr) {
    features = {
      csstransforms3d: Modernizr.csstransforms3d,
      csstransforms: Modernizr.csstransforms
    };
  } else {
    features = {
      csstransforms3d: exports.FeatureDetector.detect('csstransforms3d'),
      csstransforms: exports.FeatureDetector.detect('csstransforms')
    };
  }
  return features;
};

/**
 * Saves the mouse location relative to the browser window.
 * @private
 */
System._recordMouseLoc = function(e) {

  var touch;

  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  if (e.pageX && e.pageY) {
    this.mouse.location.x = e.pageX;
    this.mouse.location.y = e.pageY;
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = e.clientX;
    this.mouse.location.y = e.clientY;
  } else if (touch) {
    this.mouse.location.x = touch.pageX;
    this.mouse.location.y = touch.pageY;
  }

  this.mouse.velocity.x = this.mouse.lastLocation.x - this.mouse.location.x;
  this.mouse.velocity.y = this.mouse.lastLocation.y - this.mouse.location.y;

  return this.mouse;
};

/**
 * Called from a window resize event, resize() repositions all elements relative
 * to the new window size.
 */
System._resize = function() {

  var i, max, loc, records = this.allElements(), record,
      screenDimensions = exports.Utils.getWindowSize(),
      windowWidth = screenDimensions.width,
      windowHeight = screenDimensions.height,
      worlds = this.allWorlds(), world;

  // set _resizeTime; checked in _update for resize stop
  this._resizeTime = new Date().getTime();

  // set pauseStep for all worlds
  for (i = 0, max = worlds.length; i < max; i += 1) {
    worlds[i].pauseStep = true;
  }

  for (i = 0, max = records.length; i < max; i += 1) {

    record = records[i];

    if (record.name !== 'world') {

      loc = record.location;
      world = record.world;

      if (loc) {
        loc.x = windowWidth * (loc.x / world.bounds[1]);
        loc.y = windowHeight * (loc.y / world.bounds[2]);
      }
    }
  }

  // reset the bounds of all worlds
  for (i = 0, max = worlds.length; i < max; i += 1) {
    worlds[i].bounds = worlds[i]._getBounds();
  }
};

/**
 * Pauses updates to a world.
 *
 * @param {Object|Array} [opt_world] A DOM element or array of DOM elements
 *    representing worlds.
 * @private
 */
System._pause = function(opt_world) {

  var i, max, worlds = [];

  // if no world passed, use all worlds
  if (!opt_world) {
    worlds = System.allWorlds();
    // if one world is passed
  } else if (exports.Utils.getDataType(opt_world) === 'object') {
    // if a world was passed, find its reference in _records
    worlds.push(System.getWorld(worlds));
  } else if (exports.Utils.getDataType(opt_world) === 'array') {
    // if an array of worlds was passed
    worlds = opt_world;
  }

  for (i = 0, max = worlds.length; i < max; i++) {
    worlds[i].pauseStep = !worlds[i].pauseStep;
    worlds[i].pauseDraw = !worlds[i].pauseDraw;
  }
};

/**
 * Resets the system.
 * @private
 */
System._resetSystem = function() {
  System._destroySystem(true);
  System._setup.call(System);
};

/**
 * Removes all elements in all worlds.
 *
 * @private
 */
System._destroyAllElements = function() {

  var i, elements = System.allElements();

  for (i = elements.length - 1; i >= 0; i--) {
    if (!System.hasWorld([elements[i].id])) {
      elements.splice(i, 1);
    }
  }
};

/**
 * Resets the system and removes all worlds and elements.
 *
 * @param {boolean} opt_reset Set to true to skip removing worlds.
 * @private
 */
System._destroySystem = function(opt_reset) {

  var i, max, world, worlds = System.allWorlds(),
      elements = System.allElements(), reset = opt_reset || false;

  for (i = 0, max = worlds.length; i < max; i++) {
    // unpause all worlds
    worlds[i].pauseStep = false;
    worlds[i].pauseDraw = false;

    world = worlds[i].el;
    while(world.firstChild) {
      world.removeChild(world.firstChild);
    }
    // if resetting, do not remove worlds
    if (!reset) {
      world.parentNode.removeChild(world);
    }
  }

  // if not resetting, remove all elements and worlds
  if (!reset) {
    System._records = {
      lookup: {},
      list: []
    };

    System._worldsCache = {
      lookup: {},
      list: []
    };

    System._idCount = 0;

  } else { // if resetting, remove all elements except worlds
    System._destroyAllElements();
  }

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };

  System._resizeTime = 0;

  if (System._statsDisplay) {
    System._statsDisplay.destroy();
    System._statsDisplay = null;
  }
};

/**
 * Displays frame rate stats.
 *
 * @private
 */
System._stats = function() {
  if (!System._statsDisplay) {
    System._statsDisplay = new exports.StatsDisplay();
  } else {
    System._statsDisplay.destroy();
    System._statsDisplay = null;
  }
};

// pubsub events
exports.PubSub.subscribe('pause', System._pause);
exports.PubSub.subscribe('resetSystem', System._resetSystem);
exports.PubSub.subscribe('destroyAllElements', System._destroyAllElements);
exports.PubSub.subscribe('destroySystem', System._destroySystem);
exports.PubSub.subscribe('stats', System._stats);
exports.PubSub.subscribe('UpdateCache', System.updateCache);

exports.System = System;
/*global exports, document, System */
/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @constructor
 */
function World(el) {

  if (!el || exports.Utils.getDataType(el) !== 'object') {
    throw new Error('World: A valid DOM object is required for the new World\'s \"el\" property.');
  }

  this.el = el;
  this.name = 'world';
  this.id = this.name + exports.System._getNewId();
  this.bounds = this._getBounds();
  this.pauseStep = false;
  this.pauseDraw = false;
  this.style = {};
  this.gravity = new exports.Vector(0, 1);
  this.c = 0.1;
  this.position = 'absolute';
  this.top = 0;
  this.left = 0;
  this.location = new exports.Vector();
  this.opacity = 1;
  this.visibility = 'visible';
  this.angle = 0;
  this.scale = 1;
  this.color = 'transparent';
  this.borderColor = 'white';
  this.borderStyle = 'solid';
  this.borderWidth = '1';

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};

  /**
   * Worlds have their own object pool bc object's
   * reference child elements of the world.
   */
  this._pool = [];

  /**
   * Force relative positioning on worlds so child
   * positioning is relative to the world.
   */
  //this.el.style.position = 'relative';
}

/**
 * Calculates location.
 *
 * @returns {number} The total number of times step has been executed.
 */
World.prototype.step = function() {

};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @returns {string} A string representing the corresponding DOM element's cssText.
 */
World.prototype.draw = function() {

  var cssText, el = this.el;

  if (el) {
    cssText = this._getCSSText({
      x: this.location.x, // world position is relative to top left
      y: this.location.y,
      width: this.bounds[1],
      height: this.bounds[2],
      opacity: this.opacity,
      visibility: this.visibility,
      a: this.angle,
      s: this.scale,
      color: this.color,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderWidth: this.borderWidth
    });
    el.style.cssText = cssText;
  }
  return cssText;
};

/**
 * Concatenates a new cssText string based on passed properties.
 *
 * @param {Object} props A map of properties.
 * @returns {string} A string representing the corresponding DOM element's cssText.
 */
World.prototype._getCSSText = function(props) {

  var color, borderColor, position, system = exports.System;

  if (system.supportedFeatures.csstransforms3d) {
    position = [
      '-webkit-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
    ].join(';');
  } else if (system.supportedFeatures.csstransforms) {
    position = [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
    ].join(';');
  } else {
    position = [
      'position: absolute',
      'left: ' + props.x + 'px',
      'top: ' + props.y + 'px'
    ].join(';');
  }

  color = 'rgb(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';
  borderColor = 'rgb(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')';

  return [
    position,
    'width: ' + props.width + 'px',
    'height: ' + props.height + 'px',
    'opacity: ' + props.opacity,
    'visibility: ' + props.visibility,
    'background-color: ' + color,
    'border-color: ' + borderColor,
    'border-style: ' + props.borderStyle,
    'border-width: ' + props.borderWidth + 'px'
  ].join(';');
};


/**
 * Updates a world instance with passed arguments. Use to add
 * gravity or other property.
 *
 * @param {Object} opt_props A hash of properties to update.
 * @param {Object|Array} opt_worlds A single reference of an array of
 *    references to DOM elements representing as System worlds.
 * @public
 */
World.update = function(opt_props, opt_worlds) {

  var i, max, key, el, utils = exports.Utils,
      worlds = opt_worlds, collection = [],
      props = utils.getDataType(opt_props) === 'object' ? opt_props : {},
      screenDimensions = exports.Utils.getWindowSize();

  // if no world element is passed, use document.body.
  if (!worlds) {
    collection[collection.length] = exports.System._records.list[0];
  // if one world is passed
  } else if (utils.getDataType(worlds) === 'object') {
    collection[collection.length] = System.getWorld(worlds);
  // if an array of worlds is passed
  } else if (utils.getDataType(worlds) === 'array' && worlds.length) {
    for (i = 0, max = worlds.length; i < max; i++) {
      el = worlds[i];
      if (utils.getDataType(el) === 'object') {
        collection[collection.length] = System.getWorld(el);
      }
    }
  }

  // loop thru collection of worlds and update properties
  for (i = 0, max = collection.length; i < max; i++) {
    for (key in props) {
      if (props.hasOwnProperty(key)) {
        collection[i][key] = props[key];
      }
    }
    // apply any styles updates
    collection[i]._applyStyles();
    // get bounds again in case style updates had an effect
    collection[i].bounds = collection[i]._getBounds();
    // center the world
    collection[i].location = new exports.Vector((screenDimensions.width / 2) - (collection[i].bounds[1] / 2),
          (screenDimensions.height / 2) - (collection[i].bounds[2] / 2));

  }

};

/**
 * Loops thru the world's style property and sets
 * styles on its associated DOM element.
 * @private
 */
World.prototype._applyStyles = function() {
  for (var i in this.style) {
    if (this.style.hasOwnProperty(i)) {
      this.el.style[i] = this.style[i];
    }
  }
};

/**
 * Sets the bounds of the page's visible area.
 *
 * returns {Array} An array representing the bounds
 *    of the page's visible area in box-model format.
 * @private
 */
World.prototype._getBounds = function() {

  var screenDimensions;

  if (this.width && this.height) {
    return [0, this.width, this.height, 0];
  }

  if (this.el === document.body) {
     screenDimensions = exports.Utils.getWindowSize();
  } else {
    screenDimensions = {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    };
  }
  return [0, screenDimensions.width, screenDimensions.height, 0];
};

exports.World = World;
}
