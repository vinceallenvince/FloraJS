/*
Burner
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
/* Version: 1.0.1 */
/* Build time: May 4, 2013 02:32:05 *//** @namespace */
function Burner(exports, opt_parent) {

  'use strict';

  /**
   * If using Burner as a renderer in a
   * parent object, pass a reference to the parent
   * via the opt_parent param.
   */
  var parent = opt_parent || null;/*global window */
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

  this.el.style.top = 0;
  this.el.style.left = 0;
};

/**
 * Updates the corresponding DOM elements style property.
 */
Element.prototype.draw = function() {

  var cssText, el = this.el;

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
  this.el = document.createElement('div');
  this.el.id = 'statsDisplay';
  this.el.className = 'statsDisplay';
  this.el.style.color = 'white';

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
  this.el.appendChild(labelContainer);

  // create textNode for totalElements
  this._3dTransformsValue = document.createTextNode(exports.System.supportedFeatures.csstransforms3d);
  this.el.appendChild(this._3dTransformsValue);

  // create totol elements label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('total elements: ');
  labelContainer.appendChild(label);
  this.el.appendChild(labelContainer);

  // create textNode for totalElements
  this._totalElementsValue = document.createTextNode('0');
  this.el.appendChild(this._totalElementsValue);

  // create fps label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('fps: ');
  labelContainer.appendChild(label);
  this.el.appendChild(labelContainer);

  // create textNode for fps
  this._fpsValue = document.createTextNode('0');
  this.el.appendChild(this._fpsValue);

  document.body.appendChild(this.el);

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
  if (document.getElementById(this.el.id)) {
    document.body.removeChild(this.el);
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
 * @example This example assumes Burner lives under the 'Anim' namespace. The setup
 *    function updates the world's gravity and coefficient of friction. Passing 'null'
 *    forces the system to use document.body as the world. It overrides the system
 *    feature detection by passing its own features. It also delays starting the system.
 *
 * Anim.Burner.System.create(function() {
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
 *    Burner lives under a top level namespace that holds classes
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
      parentNode = null, el;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    options.world = records[0];
  } else {
    // if a world was passed, find its reference in _records
    el = options.world.el ? options.world.el : options.world;
    options.world = System.getWorld(el);
  }

  // recycle object if one is available
  var pool = this.getAllElementsByName(klass, options.world._pool);
  if (pool.length) {
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
  if (records[records.length - 1].el) {
    parentNode = records[records.length - 1].el.parentNode;
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
      records[i].el.style.visibility = 'hidden'; // hide element
      records[i].el.style.top = '-5000px';
      records[i].el.style.left = '-5000px';
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
  this.borderColor = 'transparent';
  this.borderStyle = 'none';
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

  var color, borderColor, position, system = exports.System, utils = exports.Utils;

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

  borderColor = utils.getDataType(props.borderColor) === 'array' ?
      'rgb(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')' : props.borderColor;

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
 * @param {boolean} opt_center Set to true to center the world.
 * @public
 */
World.update = function(opt_props, opt_worlds, opt_center) {

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
    if (opt_center) {
      collection[i].location = new exports.Vector((screenDimensions.width / 2) - (collection[i].bounds[1] / 2),
          (screenDimensions.height / 2) - (collection[i].bounds[2] / 2));
    }

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
} // Burner end.
/*
FloraJS
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
/* Version: 1.0.1 */
/* Build time: May 4, 2013 03:33:19 *//** @namespace */
var Flora = {}, exports = Flora;

(function(exports) {
'use strict';

// create Burner namespace
exports.Burner = {};

// pass in the namespace and parent object
new Burner(exports.Burner, exports);
/*global exports */
var config = {
  borderStyles: [
    'none',
    'solid',
    'dotted',
    'dashed',
    'double',
    'inset',
    'outset',
    'groove',
    'ridge'
  ],
  defaultColorList: [
    {
      name: 'heat',
      startColor: [255, 132, 86],
      endColor: [175, 47, 0]
    },
    {
      name: 'cold',
      startColor: [88, 129, 135],
      endColor: [171, 244, 255]
    },
    {
      name: 'food',
      startColor: [186, 255, 130],
      endColor: [84, 187, 0]
    },
    {
      name: 'oxygen',
      startColor: [109, 215, 255],
      endColor: [0, 140, 192]
    },
    {
      name: 'light',
      startColor: [255, 227, 127],
      endColor: [189, 148, 0]
    }
  ],
  keyMap: {
    pause: 80,
    resetSystem: 82,
    destroySystem: 68,
    stats: 83,
    thrustLeft: 37,
    thrustUp: 38,
    thrustRight: 39,
    thrustDown: 40
  },
  touchMap: {
    stats: 2,
    pause: 3,
    reset: 4
  }
};
exports.config = config;
/*global exports, console */
/** @namespace */
var Interface = {};

/**
 * @description Compares passed options to a set of required options.
 * @param {Object} optionsPassed An object containing options passed to a function.
 * @param {Object} optionsRequired An object containing a function's required options.
 * @param {string=} opt_from A message or identifier from the calling function.
 * @returns {boolean} Returns true if all required options are present and of the right data type.
 *     Returns false if any required options are missing or are the wrong data type. Also returns false
 *     if any of the passed options are empty.
 * @example
 * optionsPassed = {
 *  form: document.getElementById("form"),
 *    color: "blue",
 *  total: "a whole bunch",
 *   names: ["jimmy", "joey"]
 * }
 * optionsRequired = {
 *   form: "object",
 *   color: "string",
 *   total: "number|string",
 *   names: "array"
 * }
 * checkRequiredOptions(optionsPassed, optionsRequired) returns true in this case.
 *
 * Notice you can separate required options data types with a pipe character to allow multiple data types.
 */
Interface.checkRequiredParams = function(optionsPassed, optionsRequired, opt_from) {

  var i, msg, check = true;

  for (i in optionsRequired) { // loop thru required options

    if (optionsRequired.hasOwnProperty(i)) {

      try {

        // if no options were passed
        if (typeof optionsPassed === "undefined") {
          throw new Error('checkRequiredOptions: No options were passed.');
        }

        // if there is not a corresponding key in the passed options; or options passed value is blank
        if (!this.checkDataType(this.getDataType(optionsPassed[i]), optionsRequired[i].split('|')) || optionsPassed[i] === "") {

          check = false;

          if (optionsPassed[i] === '') {
            msg = 'checkRequiredOptions: required option "' + i + '" is empty.';
          } else if (typeof optionsPassed[i] === 'undefined') {
            msg = 'checkRequiredOptions: required option "' + i + '" is missing from passed options.';
          } else {
            msg = 'checkRequiredOptions: passed option "' + i + '" must be type ' + optionsRequired[i] +
            '. Passed as ' + this.getDataType(optionsPassed[i]) + '.';
          }

          throw new Error(msg);
        }
      } catch (err) {
        if (typeof console !== 'undefined') {
          console.log('ERROR: ' + err.message + (opt_from ? ' from: ' + opt_from : ''));
        }
      }
    }
  }
  return check;
};

/**
 * Loops through an array of data types and checks if the
 * passed option matches any entry.
 *
 * @param {string} option The data type to check.
 * @param {array} typesToMatch An array of data types to check option against.
 * @returns {boolean} If option matches any entry in typesToMatch,
 * return true. Else, returns false.
 */
Interface.checkDataType = function(option, typesToMatch) {



  var i, max;

  for (i = 0, max = typesToMatch.length; i < max; i++) {
    if (option === typesToMatch[i]) {
      return true;
    }
  }
  return false;
};

/**
 * Checks for data type.
 *
 * @returns {string} The data type of the passed variable.
 */
Interface.getDataType = function(element) {



  if (Object.prototype.toString.call(element) === '[object Array]') {
    return 'array';
  }

  if (Object.prototype.toString.call(element) === '[object NodeList]') {
    return 'nodeList';
  }

  return typeof element;
};

exports.Interface = Interface;
/*global exports, document, window, console */
/*jshint supernew:true */

/**
 * @namespace
 */
var Utils = {};

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
 * Re-maps a number from one range to another.
 *
 * @param {number} value The value to be converted.
 * @param {number} min1 Lower bound of the value's current range.
 * @param {number} max1 Upper bound of the value's current range.
 * @param {number} min2 Lower bound of the value's target range.
 * @param {number} max2 Upper bound of the value's target range.
 * @returns {number} A number.
 */
Utils.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
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
 * Converts degrees to radians.
 *
 * @param {number} degrees The degrees value to be converted.
 * @returns {number} A number in radians.
 */
Utils.degreesToRadians = function(degrees) {
  if (typeof degrees !== 'undefined') {
    return 2 * Math.PI * (degrees/360);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Utils.degreesToRadians is missing degrees param.');
    }
    return false;
  }
};

/**
 * Converts radians to degrees.
 *
 * @param {number} radians The radians value to be converted.
 * @returns {number} A number in degrees.
 */
Utils.radiansToDegrees = function(radians) {
  if (typeof radians !== 'undefined') {
    return radians * (180/Math.PI);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Utils.radiansToDegrees is missing radians param.');
    }
    return false;
  }
};

/**
 * Constrain a value within a range.
 *
 * @param {number} val The value to constrain.
 * @param {number} low The lower bound of the range.
 * @param {number} high The upper bound of the range.
 * @returns {number} A number.
 */
Utils.constrain = function(val, low, high) {
  if (val > high) {
    return high;
  } else if (val < low) {
    return low;
  }
  return val;
};

 /**
 * Returns a new object with all properties and methods of the
 * old object copied to the new object's prototype.
 *
 * @param {Object} object The object to clone.
 * @returns {Object} An object.
 */
Utils.clone = function(object) {
  function F() {}
  F.prototype = object;
  return new F;
};

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
 * Logs a message to the browser console.
 *
 * @param {string} msg The message to log.
 */
Utils.log = function(msg) {
  if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
    this.log = function(msg) {
      console.log(msg); // output error to console
    };
    this.log.call(this, msg);
  } else {
   this.log = function () {}; // noop
  }
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

/**
 * Capitalizes the first character in a string.
 *
 * @param {string} string The string to capitalize.
 * @returns {string} The string with the first character capitalized.
 */
Utils.capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Determines if this object is inside another.
 *
 * @param {Object} container The containing object.
 * @returns {boolean} Returns true if the object is inside the container.
 */
Utils.isInside = function(obj, container) {
  if (container) {
    if (obj.location.x + obj.width/2 > container.location.x - container.width/2 &&
      obj.location.x - obj.width/2 < container.location.x + container.width/2 &&
      obj.location.y + obj.height/2 > container.location.y - container.height/2 &&
      obj.location.y - obj.height/2 < container.location.y + container.height/2) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if mouse location is inside the world.
 *
 * @param {Object} world A Flora world.
 * @returns {boolean} True if mouse is inside world; False if
 *    mouse is outside world.
 */
Utils.mouseIsInsideWorld = function(world) {
  var mouse = exports.Burner.System.mouse,
      x = mouse.location.x,
      y = mouse.location.y,
      left = world.el.offsetLeft,
      top = world.el.offsetTop;

  if (world) {
    if (x > left &&
      x < left + world.bounds[1] &&
      y > top &&
      y < top + world.bounds[2]) {
      return true;
    }
  }
  return false;
};

exports.Utils = Utils;
/*global exports */
/*jshint bitwise:false */
/**
* https://gist.github.com/304522
* Ported from Stefan Gustavson's java implementation
* http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
* Read Stefan's excellent paper for details on how this code works.
*
* @author Sean McCullough banksean@gmail.com
*
* You can pass in a random number generator object if you like.
* It is assumed to have a random() method.
*/

/**
 * @namespace
 */
var SimplexNoise = (function (r) {

  if (r === undefined) {
    r = Math;
  }
  var i;
  var grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  var p = [];
  for (i = 0; i < 256; i += 1) {
    p[i] = Math.floor(r.random()*256);
  }
  // To remove the need for index wrapping, double the permutation table length
  var perm = [];
  for(i = 0; i < 512; i += 1) {
    perm[i] = p[i & 255];
  }

  // A lookup table to traverse the simplex around a given point in 4D.
  // Details can be found where this table is used, in the 4D noise method.
  var simplex = [
  [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
  [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
  [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
  [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]];

return {
  grad3: grad3,
  p: p,
  perm: perm,
  simplex: simplex,
  dot: function(g, x, y) {
    return g[0] * x + g[1] * y;
  },
  noise: function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var F2 = 0.5*(Math.sqrt(3.0)-1.0);
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var G2 = (3.0-Math.sqrt(3.0))/6.0;
    var t = (i+j)*G2;
    var X0 = i-t; // Unskew the cell origin back to (x,y) space
    var Y0 = j-t;
    var x0 = xin-X0; // The x,y distances from the cell origin
    var y0 = yin-Y0;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1.0 + 2.0 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    var ii = i & 255;
    var jj = j & 255;
    var gi0 = this.perm[ii+this.perm[jj]] % 12;
    var gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12;
    var gi2 = this.perm[ii+1+this.perm[jj+1]] % 12;
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if (t0 < 0) {
      n0 = 0.0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if (t1 < 0) {
      n1 = 0.0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if (t2 < 0) {
      n2 = 0.0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70.0 * (n0 + n1 + n2);
  },
  noise3d: function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners
    // Skew the input space to determine which simplex cell we're in
    var F3 = 1.0/3.0;
    var s = (xin+yin+zin)*F3; // Very nice and simple skew factor for 3D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);
    var G3 = 1.0/6.0; // Very nice and simple unskew factor, too
    var t = (i+j+k)*G3;
    var X0 = i-t; // Unskew the cell origin back to (x,y,z) space
    var Y0 = j-t;
    var Z0 = k-t;
    var x0 = xin-X0; // The x,y,z distances from the cell origin
    var y0 = yin-Y0;
    var z0 = zin-Z0;
    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0>=y0) {
    if(y0>=z0)
    { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; } // X Y Z order
    else if(x0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; } // X Z Y order
    else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; } // Z X Y order
    }
    else { // x0<y0
    if(y0<z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; } // Z Y X order
    else if(x0<z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; } // Y Z X order
    else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; } // Y X Z order
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;
    var x2 = x0 - i2 + 2.0*G3; // Offsets for third corner in (x,y,z) coords
    var y2 = y0 - j2 + 2.0*G3;
    var z2 = z0 - k2 + 2.0*G3;
    var x3 = x0 - 1.0 + 3.0*G3; // Offsets for last corner in (x,y,z) coords
    var y3 = y0 - 1.0 + 3.0*G3;
    var z3 = z0 - 1.0 + 3.0*G3;
    // Work out the hashed gradient indices of the four simplex corners
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var gi0 = this.perm[ii+this.perm[jj+this.perm[kk]]] % 12;
    var gi1 = this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]] % 12;
    var gi2 = this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]] % 12;
    var gi3 = this.perm[ii+1+this.perm[jj+1+this.perm[kk+1]]] % 12;
    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 < 0) {
      n0 = 0.0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
    }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 < 0) {
      n1 = 0.0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
    }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2 < 0) {
      n2 = 0.0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
    }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3 <0 ) {
      n3 = 0.0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32.0*(n0 + n1 + n2 + n3);
  }
};

}({
random: function () {



  return 0.1;
}
}));
exports.SimplexNoise = SimplexNoise;
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
 * @param {number} opt_high The upper bound of the vector's magnitude
 * @param {number} opt_low The lower bound of the vector's magnitude.
 * @returns {Object} This vector.
 */
Vector.prototype.limit = function(opt_high, opt_low) {
  var high = opt_high || null,
      low = opt_low || null;
  if (high && this.mag() > high) {
    this.normalize();
    this.mult(high);
  }
  if (low && this.mag() < low) {
    this.normalize();
    this.mult(low);
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
/*global exports */
/**
 * Creates a new BorderPalette object.
 *
 * Use this class to create a palette of border styles.
 *
 * @constructor
 */
function BorderPalette(opt_id) {

  /**
   * Holds a list of border styles.
   * @private
   */
  this._borders = [];

  this.id = opt_id || BorderPalette._idCount;
  BorderPalette._idCount += 1; // increment id
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

  var requiredOptions = {
    min: 'number',
    max: 'number',
    style: 'string'
  }, i, ln;

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {

    ln = exports.Utils.getRandomNumber(options.min, options.max);

    for (i = 0; i < ln; i++) {
      this._borders.push(options.style);
    }
  }
  return this;
};

/**
 * @returns A style randomly selected from the 'borders' property.
 * @throws {Error} If the 'borders' property is empty.
 */
BorderPalette.prototype.getBorder = function() {

  if (this._borders.length > 0) {
    return this._borders[exports.Utils.getRandomNumber(0, this._borders.length - 1)];
  } else {
    throw new Error('BorderPalette.getBorder: You must add borders via addBorder() before using getBorder().');
  }
};
exports.BorderPalette = BorderPalette;
/*global exports, document */
/**
 * Creates a new ColorPalette object.
 *
 * Use this class to create a palette of colors randomly selected
 * from a range created with initial start and end colors. You
 * can also generate gradients that smoothly interpolate from
 * start and end colors.
 *
 * @param {string|number} opt_id An optional id. If an id is not passed, a default id is created.
 * @constructor
 */
function ColorPalette(opt_id) {

  /**
   * Holds a list of arrays representing 3-digit color values
   * smoothly interpolated between start and end colors.
   * @private
   */
  this._gradients = [];

  /**
   * Holds a list of arrays representing 3-digit color values
   * randomly selected from start and end colors.
   * @private
   */
  this._colors = [];

  this.id = opt_id || ColorPalette._idCount;
  ColorPalette._idCount += 1; // increment id
}

/**
 * Increments as each ColorPalette is created.
 * @type number
 * @default 0
 * @private
 */
ColorPalette._idCount = 0;

ColorPalette.prototype.name = 'ColorPalette';

/**
 * Creates a color range of 255 colors from the passed start and end colors.
 * Adds a random selection of these colors to the color property of
 * the color palette.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.min {number} The minimum number of colors to add.
 *    options.max {number} The maximum number of color to add.
 *    options.startColor {Array} The beginning color of the color range.
 *    options.endColor {Array} The end color of the color range.
 */
ColorPalette.prototype.addColor = function(options) {

  var requiredOptions = {
    min: 'number',
    max: 'number',
    startColor: 'array',
    endColor: 'array'
  }, i, ln, colors;

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {

    ln = exports.Utils.getRandomNumber(options.min, options.max);
    colors = ColorPalette._createColorRange(options.startColor, options.endColor, 255);

    for (i = 0; i < ln; i++) {
      this._colors.push(colors[exports.Utils.getRandomNumber(0, colors.length - 1)]);
    }
  }
  return this;
};

/**
 * Adds color arrays representing a color range to the gradients property.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.startColor {Array} The beginning color of the color range.
 *    options.endColor {Array} The end color of the color range.
 *    options.totalColors {number} The total number of colors in the gradient.
 * @private
 */
ColorPalette.prototype.createGradient = function(options) {

  var requiredOptions = {
    startColor: 'array',
    endColor: 'array'
  };

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {

    this.startColor = options.startColor;
    this.endColor = options.endColor;
    this.totalColors = options.totalColors || 255;
    if (this.totalColors > 0) {
      this._gradients.push(ColorPalette._createColorRange(this.startColor, this.endColor, this.totalColors));
    } else {
      throw new Error('ColorPalette: total colors must be greater than zero.');
    }
  }
};

/**
 * @returns An array representing a randomly selected color
 *    from the colors property.
 * @throws {Error} If the colors property is empty.
 */
ColorPalette.prototype.getColor = function() {

  if (this._colors.length > 0) {
    return this._colors[exports.Utils.getRandomNumber(0, this._colors.length - 1)];
  } else {
    throw new Error('ColorPalette.getColor: You must add colors via addColor() before using getColor().');
  }
};

/**
 * Renders a strip of colors representing the color range
 * in the colors property.
 *
 * @param {Object} parent A DOM object to contain the color strip.
 */
ColorPalette.prototype.createSampleStrip = function(parent) {

  var i, max, div;

  for (i = 0, max = this._colors.length; i < max; i++) {
    div = document.createElement('div');
    div.className = 'color-sample-strip';
    div.style.background = 'rgb(' + this._colors[i].toString() + ')';
    parent.appendChild(div);
  }
};

/**
 * Creates an array of RGB color values interpolated between
 * a passed startColor and endColor.
 *
 * @param {Array} startColor The beginning of the color array.
 * @param {Array} startColor The end of the color array.
 * @param {number} totalColors The total numnber of colors to create.
 * @returns {Array} An array of color values.
 */
ColorPalette._createColorRange = function(startColor, endColor, totalColors) {

  var i, colors = [],
      startRed = startColor[0],
      startGreen = startColor[1],
      startBlue = startColor[2],
      endRed = endColor[0],
      endGreen = endColor[1],
      endBlue = endColor[2],
      diffRed, diffGreen, diffBlue,
      newRed, newGreen, newBlue;

  diffRed = endRed - startRed;
  diffGreen = endGreen - startGreen;
  diffBlue = endBlue - startBlue;

  for (i = 0; i < totalColors; i++) {
    newRed = parseInt(diffRed * i/totalColors, 10) + startRed;
    newGreen = parseInt(diffGreen * i/totalColors, 10) + startGreen;
    newBlue = parseInt(diffBlue * i/totalColors, 10) + startBlue;
    colors.push([newRed, newGreen, newBlue]);
  }
  return colors;
};

exports.ColorPalette = ColorPalette;
/*global exports */
/**
 * Creates a new ColorTable.
 *
 * Use a color table to create a map of keywords to color ranges.
 * Instead of manually passing start and end colors when creating
 * color palettes, you can use getColor() and pass a keyword to
 * receive the start and end colors.
 *
 * @example
 * var heat = defaultColors.getColor('heat');
 * console.log(heat.startColor); // -> [255, 132, 86]
 * console.log(heat.endColor); // -> [175, 47, 0]
 *
 * @constructor
 */
function ColorTable() {
}

/**
 * Adds a key to the color table with start and end color values.
 *
 * @param {Object} options A set of required options
 *    that includes:
 *    options.name {number} The name of the entry in the color table.
 *    options.startColor {Array} The beginning color of the color range.
 *    options.endColor {Array} The end color of the color range.
 *
 * @returns {Object} The color table.
 */
ColorTable.prototype.addColor = function(options) {

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

ColorTable.prototype.name = 'ColorTable';

/**
 * Returns start and end colors from a key in the color table.
 *
 * @param {Object} options A set of options.
 *    Required:
 *    options.name {number} The name of the entry in the color table.
 *    Optional:
 *    options.startColor {boolean} Pass true to only return the start color.
 *    options.endColor {boolean} Pass true to only return the end color.
 * @param {Array} startColor An array representing the start color. ex: [255, 100, 50].
 * @param {Array} endColor An array representing the end color. ex: [155, 50, 10].
 * @returns {Object|Array} Either an object with startColor and endColor
 *    properties or an array representing a start or end color.
 *
 * @example
 * var heat = myColorTable.getColor('heat');
 * console.log(heat.startColor); // -> [255, 132, 86]
 * console.log(heat.endColor); // -> [175, 47, 0]
 *
 * var heat = myColorTable.getColor('heat', true);
 * console.log(heat); // -> [255, 132, 86]
 *
 * var heat = myColorTable.getColor('heat', false, true);
 * console.log(heat); // -> [175, 47, 0]
 */
ColorTable.prototype.getColor = function(name, startColor, endColor) {

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
/*global exports, document */
/**
 * Creates a new Caption object.
 * Use captions to communicate short messages to users like a title
 * or simple instructions like 'click for more particles'.
 *
 * @constructor
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the caption's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {string} [opt_options.text = ''] The caption's text.
 * @param {number} [opt_options.opacity = 0.75] The caption's opacity.
 * @param {number} [opt_options.color = [255, 255, 255]] The caption's color.
 * @param {string} [opt_options.borderWidth = '1px'] The caption's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The caption's border style.
 * @param {Array|string} [opt_options.borderColor = 0.75] The caption's border color.
 */
function Caption(opt_options) {

  var options = opt_options || {}, i, max, classNames;

  // if a world is not passed, use the first world in the system
  this.world = options.world || exports.System.allWorlds()[0];
  this.position = options.position || 'top left';
  this.text = options.text || '';
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || '1px';
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = options.colorMode || 'rgb';

  /**
   * Holds a reference to the caption's DOM elements.
   * @private
   */
  this.el = document.createElement('div');
  this.el.id = 'caption';
  this.el.className = 'caption ';
  classNames = this.position.split(' ');
  for (i = 0, max = classNames.length; i < max; i++) {
    this.el.className = this.el.className + 'caption' + exports.Utils.capitalizeFirstLetter(classNames[i]) + ' ';
  }
  this.el.style.opacity = this.opacity;
  this.el.style.color = this.colorMode + '(' + this.color[0] + ', ' + this.color[1] +
        ', ' + this.color[2] + ')';
  this.el.style.borderWidth = this.borderWidth;
  this.el.style.borderStyle = this.borderStyle;
  if (typeof this.borderColor === 'string') {
    this.el.style.borderColor = this.borderColor;
  } else {
    this.el.style.borderColor = this.colorMode + '(' + this.borderColor[0] + ', ' + this.borderColor[1] +
        ', ' + this.borderColor[2] + ')';
  }
  this.el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('caption')) {
    document.getElementById('caption').parentNode.removeChild(document.getElementById('caption'));
  }
  this.world.el.appendChild(this.el);
}

Caption.prototype.name = 'Caption';

/**
 * Removes the caption's DOM element.
 *
 * @returns {boolean} True if object does not exist in the DOM.
 */
Caption.prototype.destroy = function() {

  var id = this.el.id;

  this.el.parentNode.removeChild(this.el);
  if (!document.getElementById(id)) {
    return true;
  }
  return;
};

exports.Caption = Caption;
/*global exports, document */
/**
 * Creates a new InputMenu object.
 * An Input Menu lists key strokes and other input available
 * for the user to interact with the system.
 *
 * @constructor
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the menu's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {number} [opt_options.opacity = 0.75] The menu's opacity.
 * @param {number} [opt_options.color = [255, 255, 255]] The menu's color.
 * @param {string} [opt_options.borderWidth = '1px'] The menu's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The menu's border style.
 * @param {Array|string} [opt_options.borderColor = 0.75] The menu's border color.
 */
function InputMenu(opt_options) {

  var me = this, options = opt_options || {}, i, max, classNames;

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  this.position = options.position || 'top left';
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || '1px';
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = options.colorMode || 'rgb';

  if (exports.Burner.System.supportedFeatures.touch) {
    this.text =  exports.config.touchMap.stats + '-finger tap = stats | ' +
        exports.config.touchMap.pause + '-finger tap = pause | ' +
        exports.config.touchMap.reset + '-finger tap = reset';
  } else {
    this.text = '\'' + String.fromCharCode(exports.config.keyMap.pause).toLowerCase() + '\' = pause | ' +
      '\'' + String.fromCharCode(exports.config.keyMap.resetSystem).toLowerCase() + '\' = reset | ' +
      '\'' + String.fromCharCode(exports.config.keyMap.stats).toLowerCase() + '\' = stats';
  }

  /**
   * Holds a reference to the caption's DOM elements.
   * @private
   */
  this.el = document.createElement('div');
  this.el.id = 'inputMenu';
  this.el.className = 'inputMenu ';
  classNames = this.position.split(' ');
  for (i = 0, max = classNames.length; i < max; i++) {
    this.el.className = this.el.className + 'inputMenu' + exports.Utils.capitalizeFirstLetter(classNames[i]) + ' ';
  }
  this.el.style.opacity = this.opacity;
  this.el.style.color = this.colorMode + '(' + this.color[0] + ', ' + this.color[1] +
        ', ' + this.color[2] + ')';
  this.el.style.borderWidth = this.borderWidth;
  this.el.style.borderStyle = this.borderStyle;
  if (typeof this.borderColor === 'string') {
    this.el.style.borderColor = this.borderColor;
  } else {
    this.el.style.borderColor = this.colorMode + '(' + this.borderColor[0] + ', ' + this.borderColor[1] +
        ', ' + this.borderColor[2] + ')';
  }
  this.el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('inputMenu')) {
    document.getElementById('inputMenu').parentNode.removeChild(document.getElementById('inputMenu'));
  }

  if (exports.Burner.System.supportedFeatures.touch) {
    exports.Utils.addEvent(this.el, 'touchstart', function() {
      me.destroy();
    });
  } else {
    exports.Utils.addEvent(this.el, 'mouseup', function() {
      me.destroy();
    });
  }

  this.world.el.appendChild(this.el);
}

InputMenu.prototype.name = 'InputMenu';

/**
 * Removes the menu's DOM element.
 */
InputMenu.prototype.destroy = function() {

  var id = this.el.id;

  this.el.parentNode.removeChild(this.el);
  if (!document.getElementById(id)) {
    return true;
  }
  return;
};

exports.InputMenu = InputMenu;
/*global exports, document, clearInterval, setInterval */
/**
 * Creates a new Mover. All Flora elements extend Mover.
 *
 * @constructor
 * @extends Burner.Element
 *
 * @param {Object} [opt_options] options.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.mass = 10] Mass
 * @param {number} [opt_options.bounciness = 0.75] Set the strength of the rebound when an object is outside the
 * world's bounds and wrapEdges = false.
 * @param {number} [opt_options.visibility = 'visible'] Visibility
 * @param {number} [opt_options.maxSpeed = 10] Maximum speed
 * @param {number} [opt_options.minSpeed = 0] Minimum speed
 * @param {number} [opt_options.motorSpeed = 2] Motor speed
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {Object} [opt_options.acceleration = new Vector()] Acceleration
 * @param {Object} [opt_options.velocity = new Vector()] Velocity
 * @param {Object} [opt_options.location = new Vector()] Location
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.draggable = false] If true, object can move via drag and drop.
 * @param {boolean} [opt_options.controlCamera = false] If true, camera will follow this object.
 * @param {boolean} [opt_options.checkEdges = true] Set to true to check the object's location against the world's bounds.
 * @param {boolean} [opt_options.wrapEdges = false] Set to true to set the object's location to the opposite
 * side of the world if the object moves outside the world's bounds.
 * @param {boolean} [opt_options.avoidEdges = false] Set to true to calculate a steering force away from the
 *    world's bounds.
 * @param {number} [opt_options.avoidEdgesStrength = 200] Sets the strength of the steering force when avoidEdges = true.
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {number} [opt_options.lifespan = -1] The max life of the object. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, object is destroyed.
 * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 */
function Mover(opt_options) {

  var myDiv, options, utils = exports.Burner.Utils;

  opt_options.name = this.name;
  exports.Burner.Element.call(this, opt_options);

  options = opt_options || {};

  this.options = options;
  this.world = options.world;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.mass = options.mass || 10;
  this.bounciness = options.bounciness || 0.75;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.visibility = options.visibility || 'visible';
  this.maxSpeed = options.maxSpeed === 0 ? 0 : options.maxSpeed || 10;
  this.minSpeed = options.minSpeed || 0;
  this.motorSpeed = options.motorSpeed || 0;
  this.pointToDirection = options.pointToDirection || true;
  this.acceleration = utils.getDataType(options.acceleration) === 'function' ?
      options.acceleration() : options.acceleration || new exports.Vector();
  this.velocity = utils.getDataType(options.velocity) === 'function' ?
      options.velocity() : options.velocity || new exports.Vector();
  this.location = utils.getDataType(options.location) === 'function' ?
      options.location() : options.location ||
      new exports.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
  this.angle = options.angle || 0;
  this.scale = options.scale || 1;

  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || 0;

  this.borderTopWidth = options.borderTopWidth || 0;
  this.borderTopStyle = options.borderTopStyle || 'none';
  this.borderTopColor = options.borderTopColor || 'transparent';

  this.borderRightWidth = options.borderRightWidth || 0;
  this.borderRightStyle = options.borderRightStyle || 'none';
  this.borderRightColor = options.borderRightColor || 'transparent';

  this.borderBottomWidth = options.borderBottomWidth || 0;
  this.borderBottomStyle = options.borderBottomStyle || 'none';
  this.borderBottomColor = options.borderBottomColor || 'transparent';

  this.borderLeftWidth = options.borderLeftWidth || 0;
  this.borderLeftStyle = options.borderLeftStyle || 'none';
  this.borderLeftColor = options.borderLeftColor || 'transparent';

  this.borderTopLeftRadius = options.borderTopLeftRadius || '100%';
  this.borderTopRightRadius = options.borderTopRightRadius || '100%';
  this.borderBottomRightRadius = options.borderBottomRightRadius || '100%';
  this.borderBottomLeftRadius = options.borderBottomLeftRadius || '100%';

  this.isStatic = !!options.isStatic;
  this.draggable = !!options.draggable;
  this.controlCamera = !!options.controlCamera;
  this.checkEdges = options.checkEdges || true;
  this.wrapEdges = options.wrapEdges || false;
  this.avoidEdges = !!options.avoidEdges;
  this.avoidEdgesStrength = options.avoidEdgesStrength || 50;

  this.pointToDirection = options.pointToDirection === false ? false : true;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || -1;
  this.life = options.life === 0 ? 0 : options.life || -1;

  this.parent = options.parent || null;
  this.offsetDistance = options.offsetDistance || 30;

  this.beforeStep = options.beforeStep || null;
  this.afterStep = options.afterStep || null;

  this._forceVector = new exports.Vector(); // used to cache Vector properties in applyForce()
  this.checkCameraEdgesVector = new exports.Vector(); // used in Mover._checkCameraEdges()
  this.cameraDiffVector = new exports.Vector(); // used in Mover._checkWorldEdges()

  // increments in step()
  this.clock = 0;

  // view
  this.viewArgs = options.viewArgs || [];

  myDiv = document.createElement("div");

  if (options.view && exports.Interface.getDataType(options.view) === 'function') { // if view is supplied and is a function
    this.el = options.view.apply(this, this.viewArgs);
  } else if (exports.Interface.getDataType(options.view) === 'object') { // if view is supplied and is an object
    this.el = options.view;
  } else {
    this.el = myDiv;
  }

  this.el.id = this.id;
  if (!this.options.sensors) {
    this.el.className = 'element ' + this.name.toLowerCase();
  } else {
    this.el.className = 'element ' + this.name.toLowerCase() + ' ' + 'hasSensor';
  }
  this.el.style.visibility = 'hidden';

  this.options.world.el.appendChild(this.el);

  //

  this.isMouseOut = false;
  this.isPressed = false;

  var mouseover = (function (me) {
    return (function(e) {
      me.mouseover(e, me);
    });
  })(this);

  var mousedown = (function (me) {
    return (function(e) {
      me.mousedown(e, me);
    });
  })(this);

  var mousemove = (function (me) {
    return (function(e) {
      me.mousemove(e, me);
    });
  })(this);

  var mouseup = (function (me) {
    return (function(e) {
      me.mouseup(e, me);
    });
  })(this);

  var mouseout = (function (me) {
    return (function(e) {
      me.mouseout(e, me);
    });
  })(this);

  if (this.draggable) {
    exports.Utils.addEvent(this.el, 'mouseover', mouseover);
    exports.Utils.addEvent(this.el, 'mousedown', mousedown);
    exports.Utils.addEvent(this.el, 'mousemove', mousemove);
    exports.Utils.addEvent(this.el, 'mouseup', mouseup);
    exports.Utils.addEvent(this.el, 'mouseout', mouseout);
  }
}
exports.Burner.Utils.extend(Mover, exports.Burner.Element);

Mover.prototype.name = 'Mover';

Mover.prototype.mouseover = function(e) {
  this.isMouseOut = false;
  clearInterval(this.mouseOutInterval);
};

Mover.prototype.mousedown = function(e) {

  var touch, target = e.target || e.srcElement; // <= IE* uses srcElement

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  if (e.pageX && e.pageY) {
    this.offsetX = e.pageX - target.offsetLeft;
    this.offsetY = e.pageY - target.offsetTop;
  } else if (e.clientX && e.clientY) {
    this.offsetX = e.clientX - target.offsetLeft;
    this.offsetY = e.clientY - target.offsetTop;
  } else if (touch) {
    this.offsetX = touch.pageX - target.offsetLeft;
    this.offsetY = touch.pageY - target.offsetTop;
  }

  this.isPressed = true;
  this.isMouseOut = false;
};

/**
 * Called by a mousemove event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Mover.prototype.mousemove = function(e) {

  var x, y, touch;

  if (this.isPressed) {

    this.isMouseOut = false;

    if (e.changedTouches) {
      touch = e.changedTouches[0];
    }

    if (e.pageX && e.pageY) {
      x = e.pageX - this.world.el.offsetLeft;
      y = e.pageY - this.world.el.offsetTop;
    } else if (e.clientX && e.clientY) {
      x = e.clientX - this.world.el.offsetLeft;
      y = e.clientY - this.world.el.offsetTop;
    } else if (touch) {
      x = touch.pageX - this.world.el.offsetLeft;
      y = touch.pageY - this.world.el.offsetTop;
    }

    if (exports.Utils.mouseIsInsideWorld(this.world)) {
      this.location = new exports.Vector(x, y);
    } else {
      this.isPressed = false;
    }
  }
};

/**
 * Called by a mouseup event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Mover.prototype.mouseup = function(e) {
  this.isPressed = false;
};

/**
 * Called by a mouseout event listener.
 *
 * @param {Object} e The event object passed by the listener.
 * @param {Object} obj The object associated with the event target.
 */
Mover.prototype.mouseout = function(e, obj) {



  var me = obj, mouse = exports.Burner.System.mouse,
      x, y;

  if (obj.isPressed) {

    obj.isMouseOut = true;

    obj.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

      if (me.isPressed && me.isMouseOut) {

        x = mouse.location.x - me.world.el.offsetLeft;
        y = mouse.location.y - me.world.el.offsetTop;

        me.location = new exports.Vector(x, y);
      }
    }, 16);
  }
};

/**
 * Calculates location via sum of acceleration + velocity.
 *
 * @returns {number} The total number of times step has been executed.
 */
Mover.prototype.step = function() {

  var friction, r, theta, x, y;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    // start apply forces

    if (this.world.c) { // friction
      friction = exports.Utils.clone(this.velocity);
      friction.mult(-1);
      friction.normalize();
      friction.mult(this.world.c);
      this.applyForce(friction);
    }
    this.applyForce(this.world.gravity); // gravity

    if (this.applyForces) { // !! rename this
      this.applyForces();
    }

    // end apply forces

    this.velocity.add(this.acceleration); // add acceleration

    if (this.maxSpeed) {
      this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
    }

    if (this.minSpeed) {
      this.velocity.limit(null, this.minSpeed); // check if velocity < minSpeed
    }

    this.location.add(this.velocity); // add velocity
    if (this.pointToDirection) { // object rotates toward direction
      if (this.velocity.mag() > 0.1) {
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
    }
  }

  if (this.controlCamera) { // check camera after velocity/location calculation
    this._checkCameraEdges();
  }

  if (this.checkEdges) {
    this._checkWorldEdges();
  }

  if (this.parent) { // parenting

    if (this.offsetDistance) {

      r = this.offsetDistance; // use angle to calculate x, y
      theta = exports.Utils.degreesToRadians(this.parent.angle + this.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      this.location.x = this.parent.location.x;
      this.location.y = this.parent.location.y;
      this.location.add(new exports.Vector(x, y)); // position the child

    } else {
      this.location = this.parent.location;
    }
  }

  this.acceleration.mult(0);

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    exports.Burner.System.destroyElement(this);
  }

  if (this.afterStep) {
    this.afterStep.apply(this);
  }

  this.clock++;
  return this.clock;
};

/**
 * Adds a force to acceleration. Calculated via F = m * a;
 *
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Mover.prototype.applyForce = function(force) {
  if (force) {
    this._forceVector.x = force.x;
    this._forceVector.y = force.y;
    this._forceVector.div(this.mass);
    this.acceleration.add(this._forceVector);
    return this.acceleration;
  }
  return null;
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
Mover.prototype._seek = function(target) {

  var world = this.world,
    desiredVelocity = exports.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.bounds[1] / 2) {
    var m = exports.Utils.map(distanceToTarget, 0, world.bounds[1] / 2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  desiredVelocity.sub(this.velocity);
  desiredVelocity.limit(this.maxSteeringForce);

  return desiredVelocity;
};

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 */
Mover.prototype._checkCameraEdges = function() {
  this.checkCameraEdgesVector.x = this.velocity.x;
  this.checkCameraEdgesVector.y = this.velocity.y;
  this.world.location.add(this.checkCameraEdgesVector.mult(-1));
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @returns {boolean} Returns true if the object is outside the world.
 * @private
 */
Mover.prototype._checkWorldEdges = function() {

  var x = this.location.x,
    y = this.location.y,
    velocity = this.velocity,
    check = false;

  // transform origin is at the center of the object

  if (this.wrapEdges) {
    if (this.location.x > this.world.bounds[1]) {
      this.location.x = 0;
      check = true;
      if (this.controlCamera) {
        this.cameraDiffVector.x = x - this.location.x;
        this.cameraDiffVector.y = 0;
      }
    } else if (this.location.x < 0) {
      this.location.x = this.world.bounds[1];
      check = true;
      if (this.controlCamera) {
        this.cameraDiffVector.x = x - this.location.x;
        this.cameraDiffVector.y = 0;
      }
    }
  } else {
    if (this.location.x + this.width/2 > this.world.bounds[1]) {
      this.location.x = this.world.bounds[1] - this.width/2;
      velocity.x *= -1 * this.bounciness;
      check = true;
      if (this.controlCamera) {
        this.cameraDiffVector.x = x - this.location.x;
        this.cameraDiffVector.y = 0;
      }
    } else if (this.location.x < this.width/2) {
      this.location.x = this.width/2;
      velocity.x *= -1 * this.bounciness;
      check = true;
      if (this.controlCamera) {
       this.cameraDiffVector.x = x - this.location.x;
        this.cameraDiffVector.y = 0;
      }
    }
  }

  ////

  if (this.wrapEdges) {
    if (this.location.y > this.world.bounds[2]) {
      this.location.y = 0;
      check = true;
      if (this.controlCamera) {
        this.cameraDiffVector.x = 0;
        this.cameraDiffVector.y = y - this.location.y;
      }
    } else if (this.location.y < 0) {
      this.location.y = this.world.bounds[2];
      check = true;
      if (this.controlCamera) {
        this.cameraDiffVector.x = 0;
        this.cameraDiffVector.y = y - this.location.y;
      }
    }
  } else {
    if (this.location.y + this.height/2 > this.world.bounds[2]) {
      this.location.y = this.world.bounds[2] - this.height/2;
      this.velocity.y *= -1 * this.bounciness;
      check = true;
      if (this.controlCamera) {
       this.cameraDiffVector.x = 0;
        this.cameraDiffVector.y = y - this.location.y;
      }
    } else if (this.location.y < this.height/2) {
      this.location.y = this.height/2;
      this.velocity.y *= -1 * this.bounciness;
      check = true;
      if (this.controlCamera) {
        this.cameraDiffVector.x = 0;
        this.cameraDiffVector.y = y - this.location.y;
      }
    }
  }

  if (check && this.controlCamera) {
    this.world.location.add(this.cameraDiffVector); // add the distance difference to World.location
  }
  return check;
};

/**
 * Checks if object is within range of a world edge. If so, steers the object
 * in the opposite direction.
 * @private
 */
Mover.prototype._checkAvoidEdges = function() {

  var maxSpeed, desiredVelocity;

  if (this.location.x < this.avoidEdgesStrength) {
    maxSpeed = this.maxSpeed;
  } else if (this.location.x > this.world.bounds[1] - this.avoidEdgesStrength) {
    maxSpeed = -this.maxSpeed;
  }
  if (maxSpeed) {
    desiredVelocity = new exports.Vector(maxSpeed, this.velocity.y);
    desiredVelocity.sub(this.velocity);
    desiredVelocity.limit(this.maxSteeringForce);
    this.applyForce(desiredVelocity);
  }

  if (this.location.y < this.avoidEdgesStrength) {
    maxSpeed = this.maxSpeed;
  } else if (this.location.y > this.world.bounds[2] - this.avoidEdgesStrength) {
    maxSpeed = -this.maxSpeed;
  }
  if (maxSpeed) {
    desiredVelocity = new exports.Vector(this.velocity.x, maxSpeed);
    desiredVelocity.sub(this.velocity);
    desiredVelocity.limit(this.maxSteeringForce);
    this.applyForce(desiredVelocity);
  }
};

/**
 * Calculates a force to apply to simulate drag on an object.
 *
 * @param {Object} target The object that is applying the drag force.
 * @returns {Object} A force to apply.
 */
Mover.prototype.drag = function(target) {



  var speed = this.velocity.mag(),
    dragMagnitude = -1 * target.c * speed * speed, // drag magnitude
    drag = exports.Utils.clone(this.velocity);

  drag.normalize(); // drag direction
  drag.mult(dragMagnitude);

  return drag;
};

/**
 * Calculates a force to apply to simulate attraction on an object.
 *
 * @param {Object} attractor The attracting object.
 * @returns {Object} A force to apply.
 */
Mover.prototype.attract = function(attractor) {

  var force = exports.Vector.VectorSub(attractor.location, this.location),
    distance, strength;

  distance = force.mag();
  distance = exports.Utils.constrain(distance, this.width * this.height/8, attractor.width * attractor.height); // min = scale/8 (totally arbitrary); max = scale; the size of the attractor
  force.normalize();
  strength = (attractor.G * attractor.mass * this.mass) / (distance * distance);
  force.mult(strength);

  return force;
};

/**
 * Determines if this object is inside another.
 *
 * @param {Object} container The containing object.
 * @returns {boolean} Returns true if the object is inside the container.
 */
Mover.prototype.isInside = function(container) {

  if (container) {
    if (this.location.x + this.width / 2 > container.location.x - container.width / 2 &&
      this.location.x - this.width / 2 < container.location.x + container.width / 2 &&
      this.location.y + this.height / 2 > container.location.y - container.height / 2 &&
      this.location.y - this.height / 2 < container.location.y + container.height / 2) {
      return true;
    }
  }
  return false;
};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @returns {string} A string representing the corresponding DOM element's cssText.
 */
Mover.prototype.draw = function() {

  var cssText, el = this.el;

  if (el) {
    cssText = Mover._getCSSText({
      x: this.location.x - this.width / 2,
      y: this.location.y - this.height / 2,
      width: this.width,
      height: this.height,
      opacity: this.opacity,
      visibility: this.visibility,
      a: this.angle,
      s: this.scale,
      color: this.color,
      z: this.zIndex || 1,
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor: this.borderColor,
      borderRadius: this.borderRadius,
      borderTopWidth: this.borderTopWidth,
      borderTopStyle: this.borderTopStyle,
      borderTopColor: this.borderTopColor,
      borderRightWidth: this.borderRightWidth,
      borderRightStyle: this.borderRightStyle,
      borderRightColor: this.borderRightColor,
      borderBottomWidth: this.borderBottomWidth,
      borderBottomStyle: this.borderBottomStyle,
      borderBottomColor: this.borderBottomColor,
      borderLeftWidth: this.borderLeftWidth,
      borderLeftStyle: this.borderLeftStyle,
      borderLeftColor: this.borderLeftColor,
      borderTopLeftRadius: this.borderTopLeftRadius,
      borderTopRightRadius: this.borderTopRightRadius,
      borderBottomRightRadius: this.borderBottomRightRadius,
      borderBottomLeftRadius: this.borderBottomLeftRadius
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
Mover._getCSSText = function(props) {

  var color, position, borderRadius, borderWidth, borderStyle, borderColor,
      system = exports.Burner.System, utils = exports.Burner.Utils;

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

  if (utils.getDataType(props.color) === 'array') {
    color = 'rgb(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';
  }

  if (props.borderWidth) {
    borderWidth = utils.getDataType(props.borderWidth) === 'number' ? props.borderWidth + 'px' : props.borderWidth;
  } else if (props.borderTopWidth && props.borderRightWidth && props.borderBottomWidth && props.borderLeftWidth) {
    borderWidth = props.borderTopWidth + 'px ' + props.borderRightWidth + 'px ' +
        props.borderBottomWidth + 'px ' + props.borderLeftWidth + 'px';
  }

  if (props.borderStyle && props.borderStyle !== 'none') {
    borderStyle = props.borderStyle;
  } else if (props.borderTopStyle || props.borderRightStyle || props.borderBottomStyle || props.borderLeftStyle) {
    borderStyle = props.borderTopStyle + ' ' + props.borderRightStyle + ' ' +
        props.borderBottomStyle + ' ' + props.borderLeftStyle;
  }

  if (props.borderColor && props.borderColor !== 'transparent') {
    borderColor =
        utils.getDataType(props.borderColor) === 'array' ? 'rgb(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')' : props.borderColor;
  } else if (props.borderTopColor && props.borderRightColor && props.borderBottomColor && props.borderLeftColor) {
    var bc1 = utils.getDataType(props.borderTopColor) === 'array' ? 'rgb(' + props.borderTopColor[0] + ', ' + props.borderTopColor[1] + ', ' + props.borderTopColor[2] + ') ' : props.borderTopColor + ' ';
    var bc2 = utils.getDataType(props.borderRightColor) === 'array' ? 'rgb(' + props.borderRightColor[0] + ', ' + props.borderRightColor[1] + ', ' + props.borderRightColor[2] + ') ' : props.borderRightColor + ' ';
    var bc3 = utils.getDataType(props.borderBottomColor) === 'array' ? 'rgb(' + props.borderBottomColor[0] + ', ' + props.borderBottomColor[1] + ', ' + props.borderBottomColor[2] + ') ' : props.borderBottomColor + ' ';
    var bc4 = utils.getDataType(props.borderLeftColor) === 'array' ? 'rgb(' + props.borderLeftColor[0] + ', ' + props.borderLeftColor[1] + ', ' + props.borderLeftColor[2] + ')' : props.borderLeftColor;
    borderColor = bc1 + bc2 + bc3 + bc4;
  }

  if (props.borderRadius !== null) {
    borderRadius = utils.getDataType(props.borderRadius) === 'number' ? props.borderRadius + 'px' : props.borderRadius;
  } else if (props.borderTopLeftRadius && props.borderTopRightRadius && props.borderBottomRightRadius && props.borderBottomLeftRadius) {
    var br1 = utils.getDataType(props.borderTopLeftRadius) === 'number' ? props.borderTopLeftRadius + 'px ' : props.borderTopLeftRadius + ' ';
    var br2 = utils.getDataType(props.borderTopRightRadius) === 'number' ? props.borderTopRightRadius + 'px ' : props.borderTopRightRadius + ' ';
    var br3 = utils.getDataType(props.borderBottomRightRadius) === 'number' ? props.borderBottomRightRadius + 'px ' : props.borderBottomRightRadius + ' ';
    var br4 = utils.getDataType(props.borderBottomLeftRadius) === 'number' ? props.borderBottomLeftRadius + 'px ' : props.borderBottomLeftRadius;
    borderRadius = br1 + br2 + br3 + br4;
  }

  return [
    position,
    'width: ' + props.width + 'px',
    'height: ' + props.height + 'px',
    'opacity: ' + props.opacity,
    'visibility: ' + props.visibility,
    'background-color: ' + color,
    'z-index: ' + props.z,
    'border-radius: ' + borderRadius,
    'border-width: ' + borderWidth,
    'border-style: ' + borderStyle,
    'border-color: ' + borderColor
  ].join(';');
};

exports.Mover = Mover;
/*global exports, document */
/**
 * Creates a new Agent.
 *
 * Agents can follow the mouse.
 * Agents can seek targets.
 * Agents can flock.
 *
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
 * @param {number} [opt_options.maxSteeringForce = 10] Set the maximum strength of any steering force.
 * @param {boolean} [opt_options.seekTarget = null] An object to seek.
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {array} [opt_options.sensors = []] A list of sensors attached to this object.
 * @param {string|Array} [opt_options.color = [197, 177, 115]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [167, 219, 216]] Border color.
 * @param {string|number} [opt_options.borderRadius = null] Border radius.
 * @param {string} [opt_options.borderTopLeftRadius = '0'] Border top left radius.
 * @param {string} [opt_options.borderTopRightRadius = '100%'] Border top right radius.
 * @param {string} [opt_options.borderBottomRightRadius = '100%'] Border bottom right radius.
 * @param {string} [opt_options.borderBottomLeftRadius = '0'] Border bottom left radius.
 *
 * @constructor
 * @extends Mover
 */
function Agent(opt_options) {

  var options;

  opt_options.name = this.name;
  exports.Mover.call(this, opt_options);

  options = opt_options || {};

  this.followMouse = !!options.followMouse;
  this.maxSteeringForce = options.maxSteeringForce || 10;
  this.seekTarget = options.seekTarget || null;
  this.flocking = !!options.flocking;
  this.desiredSeparation = options.desiredSeparation === 0 ? 0 : options.desiredSeparation || this.width * 2;
  this.separateStrength = options.separateStrength === 0 ? 0 : options.separateStrength || 0.3;
  this.alignStrength = options.alignStrength === 0 ? 0 : options.alignStrength || 0.2;
  this.cohesionStrength = options.cohesionStrength === 0 ? 0 : options.cohesionStrength || 0.1;
  this.flowField = options.flowField || null;
  this.sensors = options.sensors || [];

  this.color = options.color || [197, 177, 115];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || null;
  this.borderTopLeftRadius = options.borderTopLeftRadius || '0';
  this.borderTopRightRadius = options.borderTopRightRadius || '0';
  this.borderBottomRightRadius = options.borderBottomRightRadius || '0';
  this.borderBottomLeftRadius = options.borderBottomLeftRadius || '0';

  //

  this.separateSumForceVector = new exports.Vector(); // used in Agent.separate()
  this.alignSumForceVector = new exports.Vector(); // used in Agent.align()
  this.cohesionSumForceVector = new exports.Vector(); // used in Agent.cohesion()
  this.followTargetVector = new exports.Vector(); // used in Agent.applyForces()
  this.followDesiredVelocity = new exports.Vector(); // used in Agent.follow()

}
exports.Utils.extend(Agent, exports.Mover);

Agent.prototype.name = 'Agent';

/**
 * Applies Agent-specific forces.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.applyForces = function() {

  var i, max, sensorActivated, dir, sensor, r, theta, x, y,
      liquids = exports.Burner.System._Caches.Liquid,
      attractors = exports.Burner.System._Caches.Attractor,
      repellers = exports.Burner.System._Caches.Repeller,
      heat = exports.Burner.System._Caches.Heat;

  if (liquids && liquids.list.length > 0) { // liquid
    for (i = 0, max = liquids.list.length; i < max; i += 1) {
      if (this.id !== liquids.list[i].id && exports.Utils.isInside(this, liquids.list[i])) {
        this.applyForce(this.drag(liquids.list[i]));
      }
    }
  }

  if (attractors && attractors.list.length > 0) { // attractor
    for (i = 0, max = attractors.list.length; i < max; i += 1) {
      if (this.id !== attractors.list[i].id) {
        this.applyForce(this.attract(attractors.list[i]));
      }
    }
  }

  if (repellers && repellers.list.length > 0) { // attractor
    for (i = 0, max = repellers.list.length; i < max; i += 1) {
      if (this.id !== repellers.list[i].id) {
        this.applyForce(this.attract(repellers.list[i]));
      }
    }
  }

  if (this.sensors.length > 0) { // Sensors
    for (i = 0, max = this.sensors.length; i < max; i += 1) {

      sensor = this.sensors[i];

      r = sensor.offsetDistance; // use angle to calculate x, y
      theta = exports.Utils.degreesToRadians(this.angle + sensor.offsetAngle);
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      sensor.location.x = this.location.x;
      sensor.location.y = this.location.y;
      sensor.location.add(new exports.Vector(x, y)); // position the sensor

      if (i > 0) {
        sensor.visibility = 'hidden';
      }

      if (sensor.activated) {
        this.applyForce(sensor.getActivationForce(this));
        sensorActivated = true;
      }

    }
  }

  /**
   * If no sensors were activated and this.motorSpeed != 0,
   * apply a force in the direction of the current velocity.
   */
  if (!sensorActivated && this.motorSpeed) {
    dir = exports.Utils.clone(this.velocity);
    dir.normalize();
    if (this.velocity.mag() > this.motorSpeed) { // decelerate to defaultSpeed
      dir.mult(-this.motorSpeed);
    } else {
      dir.mult(this.motorSpeed);
    }
    this.applyForce(dir); // constantly applies a force
  }

  if (this.followMouse) { // follow mouse
    var t = {
      location: new exports.Vector(exports.Burner.System.mouse.location.x,
          exports.Burner.System.mouse.location.y)
    };
    this.applyForce(this._seek(t));
  }

  if (this.seekTarget) { // seek target
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.flowField) { // follow flow field
    var res = this.flowField.resolution,
      col = Math.floor(this.location.x/res),
      row = Math.floor(this.location.y/res),
      loc, target;

    if (this.flowField.field[col]) {
      loc = this.flowField.field[col][row];
      if (loc) { // sometimes loc is not available for edge cases
        this.followTargetVector.x = loc.x;
        this.followTargetVector.y = loc.y;
      } else {
        this.followTargetVector.x = this.location.x;
        this.followTargetVector.y = this.location.y;
      }
      target = {
        location: this.followTargetVector
      };
      this.applyForce(this.follow(target));
    }

  }

  if (this.flocking) {
    this.flock(exports.Burner.System.getAllElementsByName('Agent'));
  }

  return this.acceleration;
};

/**
 * Calculates a steering force to apply to an object following another object.
 * Agents with flow fields will use this method to calculate a steering force.
 *
 * @param {Object} target The object to follow.
 * @returns {Object} The force to apply.
 */
Agent.prototype.follow = function(target) {

  this.followDesiredVelocity.x = target.location.x;
  this.followDesiredVelocity.y = target.location.y;

  this.followDesiredVelocity.mult(this.maxSpeed);
  this.followDesiredVelocity.sub(this.velocity);
  this.followDesiredVelocity.limit(this.maxSteeringForce);

  return this.followDesiredVelocity;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.flock = function(elements) {

  this.applyForce(this.separate(elements).mult(this.separateStrength));
  this.applyForce(this.align(elements).mult(this.alignStrength));
  this.applyForce(this.cohesion(elements).mult(this.cohesionStrength));
  return this.acceleration;
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to avoid all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.separate = function(elements) {

  var i, max, element, diff, d,
  sum, count = 0, steer;

  this.separateSumForceVector.x = 0;
  this.separateSumForceVector.y = 0;
  sum = this.separateSumForceVector;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    if (this.className === element.className && this.id !== element.id) {

      d = this.location.distance(element.location);

      if ((d > 0) && (d < this.desiredSeparation)) {
        diff = exports.Vector.VectorSub(this.location, element.location);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count += 1;
      }
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new exports.Vector();
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to align with all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.align = function(elements) {

  var i, max, element, d,
    neighbordist = this.width * 2,
    sum, count = 0, steer;

  this.alignSumForceVector.x = 0;
  this.alignSumForceVector.y = 0;
  sum = this.alignSumForceVector;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    d = this.location.distance(element.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.className === element.className && this.id !== element.id) {
        sum.add(element.velocity);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new exports.Vector();
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to stay close to all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.cohesion = function(elements) {

  var i, max, element, d,
    neighbordist = 10,
    sum, count = 0, desiredVelocity, steer;

  this.cohesionSumForceVector.x = 0;
  this.cohesionSumForceVector.y = 0;
  sum = this.cohesionSumForceVector;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    d = this.location.distance(element.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.className === element.className && this.id !== element.id) {
        sum.add(element.location);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.sub(this.location);
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxSteeringForce);
    return sum;
  }
  return new exports.Vector();
};

/**
 * Returns this object's location.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getLocation = function (type) {

  if (!type) {
    return new exports.Vector(this.location.x, this.location.y);
  } else if (type === 'x') {
    return this.location.x;
  } else if (type === 'y') {
    return this.location.y;
  }
};

/**
 * Returns this object's velocity.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's velocity.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getVelocity = function (type) {

  if (!type) {
    return new exports.Vector(this.location.x, this.location.y);
  } else if (type === 'x') {
    return this.velocity.x;
  } else if (type === 'y') {
    return this.velocity.y;
  }
};
exports.Agent = Agent;
/*global exports, document */
/**
 * Creates a new Walker.
 *
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {boolean} [opt_options.isPerlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and isPerlin = true, object will avoid world edges.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {boolean} [opt_options.random = false] Set to true for walker to move in a random direction.
 * @param {number} [opt_options.randomRadius = 100] If isRandom = true, walker will look for a new location each frame based on this radius.
 * @param {string|Array} [opt_options.color = [255, 150, 50]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [167, 219, 216]] Border color.
 * @param {string} [opt_options.borderRadius = '100%'] Border radius.
 *
 * @constructor
 * @extends Mover
 *
 */
function Walker(opt_options) {

  var options;

  opt_options.name = this.name;
  exports.Mover.call(this, opt_options);

  options = opt_options || {};

  this.width = options.width || 10;
  this.height = options.height || 10;
  this.perlin = options.perlin || true;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.perlinSpeed = options.perlinSpeed || 0.005;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow || -0.075;
  this.perlinAccelHigh = options.perlinAccelHigh || 0.075;
  this.offsetX = options.offsetX || Math.random() * 10000;
  this.offsetY = options.offsetY || Math.random() * 10000;
  this.random = !!options.random;
  this.randomRadius = options.randomRadius || 100;
  this.color = options.color || [255, 150, 50];
  this.borderWidth = options.borderWidth || 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || 'white';
  this.borderRadius = options.borderRadius || '100%';

}
exports.Utils.extend(Walker, exports.Mover);

Walker.prototype.name = 'Walker';

/**
 */
Walker.prototype.applyForces = function() {

  // walker use either perlin noise or random walk
  if (this.perlin) {

    this.perlinTime += this.perlinSpeed;

    if (this.remainsOnScreen) {
      this.acceleration = new exports.Vector();
      this.velocity = new exports.Vector();
      this.location.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, 0, this.world.bounds[1]);
      this.location.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, 0, this.world.bounds[2]);
    } else {
      this.acceleration.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.acceleration.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    }

  } else if (this.random) {
    this.seekTarget = { // find a random point and steer toward it
      location: exports.Vector.VectorAdd(this.location, new exports.Vector(exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius), exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
    };
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.avoidEdges) {
    this._checkAvoidEdges();
  }
};

exports.Walker = Walker;
/*global exports */
/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = 'LOVE'] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 2] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the sensor's parent.
 * @param {number} [opt_options.offsetAngle = 0] The angle of rotation around the vehicle carrying the sensor.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.
 * @param {boolean} [opt_options.activatedColor = [200, 200, 200]] The color the sensor will display when activated.
 * @param {number} [opt_options.borderRadius = '100%'] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {number} [opt_options.borderStyle = 'solid'] Border style.
 * @param {number} [opt_options.borderColor = 'white'] Border color.

 */
function Sensor(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || 'LOVE';
  this.sensitivity = options.sensitivity === 0 ? 0 : options.sensitivity || 2;
  this.width = options.width === 0 ? 0 : options.width || 7;
  this.height = options.height === 0 ? 0 : options.height || 7;
  this.offsetDistance = options.offsetDistance === 0 ? 0 : options.offsetDistance|| 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [200, 200, 200];
  this.borderRadius ='100%';
  this.borderWidth = 2;
  this.borderStyle = 'solid';
  this.borderColor = 'white';
}
exports.Utils.extend(Sensor, exports.Agent);

Sensor.prototype.name = 'Sensor';

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  var check = false, i, max;

  var heat = exports.Burner.System._Caches.Heat || {list: []},
      cold = exports.Burner.System._Caches.Cold || {list: []},
      predators = exports.Burner.System._Caches.Predators || {list: []},
      lights = exports.Burner.System._Caches.Light || {list: []},
      oxygen = exports.Burner.System._Caches.Oxygen || {list: []},
      food = exports.Burner.System._Caches.Food || {list: []};

  // what if cache does not exist?

  if (this.type === 'heat' && heat.list && heat.list.length > 0) {
    for (i = 0, max = heat.list.length; i < max; i++) { // heat
      if (this.isInside(this, heat.list[i], this.sensitivity)) {
        this.target = heat.list[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === 'cold' && cold.list && cold.list.length > 0) {
    for (i = 0, max = cold.list.length; i < max; i++) { // cold
      if (this.isInside(this, cold.list[i], this.sensitivity)) {
        this.target = cold.list[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === 'predator' && predators.list && predators.list.length > 0) {
    for (i = 0, max = predators.list.length; i < max; i += 1) { // predator
      if (this.isInside(this, predators.list[i], this.sensitivity)) {
        this.target = predators.list[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === 'light' && lights.list && lights.list.length > 0) {
    for (i = 0, max = lights.list.length; i < max; i++) { // light
      // check the obj has not been marked as deleted
      if (lights.lookup[lights.list[i].id]) {
        if (this.isInside(this, lights.list[i], this.sensitivity)) {
          this.target = lights.list[i]; // target this stimulator
          this.activated = true; // set activation
          check = true;
        }
      }
    }
  } else if (this.type === 'oxygen' && oxygen.list && oxygen.list.length > 0) {
    for (i = 0, max = oxygen.list.length; i < max; i += 1) { // oxygen
      // check the obj has not been marked as deleted
      if (oxygen.lookup[oxygen.list[i].id]) {
        if (this.isInside(this, oxygen.list[i], this.sensitivity)) {
          this.target = oxygen.list[i]; // target this stimulator
          this.activated = true; // set activation
          check = true;
        }
      }
    }
  } else if (this.type === 'food' && food.list && food.list.length > 0) {
    for (i = 0, max = food.list.length; i < max; i += 1) { // food
      // check the obj has not been marked as deleted
      if (food.lookup[food.list[i].id]) {
        if (this.isInside(this, food.list[i], this.sensitivity)) {
          this.target = food.list[i]; // target this stimulator
          this.activated = true; // set activation
          check = true;
        }
      }
    }
  }
  if (!check) {
    this.target = null;
    this.activated = false;
    this.color = 'transparent';
  } else {
    this.color = this.activatedColor;
  }
  if (this.afterStep) {
    this.afterStep.apply(this);
  }

};

/**
 * Returns a force to apply to an agentwhen its sensor is activated.
 *
 */
Sensor.prototype.getActivationForce = function(agent) {

  var distanceToTarget, m, v, steer;

  switch (this.behavior) {

    /**
     * Steers toward target
     */
    case "AGGRESSIVE":
      return this._seek(this.target);

    /**
     * Steers away from the target
     */
    case "COWARD":
      var f = this._seek(this.target);
      return f.mult(-1);

    /**
     * Speeds toward target and keeps moving
     */
    case "LIKES":
      var dvLikes = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvLikes.mag();
      dvLikes.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvLikes.mult(m);

      steer = exports.Vector.VectorSub(dvLikes, agent.velocity);
      steer.limit(agent.maxSteeringForce);
      return steer;

    /**
     * Arrives at target and remains
     */
    case "LOVES":
      var dvLoves = exports.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();

      if (distanceToTarget > this.width) {
        m = distanceToTarget/agent.maxSpeed;
        dvLoves.mult(m);
        steer = exports.Vector.VectorSub(dvLoves, agent.velocity);
        steer.limit(agent.maxSteeringForce);
        return steer;
      }
      agent.velocity = new exports.Vector();
      agent.acceleration = new exports.Vector();
      return new exports.Vector();

    /**
     * Arrives at target but does not stop
     */
    case "EXPLORER":

      var dvExplorer = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvExplorer.mult(-m);

      steer = exports.Vector.VectorSub(dvExplorer, agent.velocity);
      steer.limit(agent.maxSteeringForce * 0.01);
      return steer;

    /**
     * Moves in the opposite direction as fast as possible
     */
    /*case "RUN":
      return this.flee(this.target);*/

    case "ACCELERATE":
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(agent.minSpeed);

    case "DECELERATE":
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(-agent.minSpeed);

    default:
      return new exports.Vector();
  }
};

/**
 * Checks if a sensor can detect a stimulator.
 *
 * @param {Object} params The sensor.
 * @param {Object} container The stimulator.
 * @param {number} sensitivity The sensor's sensitivity.
 */
Sensor.prototype.isInside = function(item, container, sensitivity) {

  if (item.location.x + item.width/2 > container.location.x - container.width/2 - (sensitivity * container.width) &&
    item.location.x - item.width/2 < container.location.x + container.width/2 + (sensitivity * container.width) &&
    item.location.y + item.height/2 > container.location.y - container.height/2 - (sensitivity * container.height) &&
    item.location.y - item.height/2 < container.location.y + container.height/2 + (sensitivity * container.height)) {
    return true;
  }
  return false;
};
exports.Sensor = Sensor;
/*global exports */
/**
 * Creates a new Liquid.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {string|Array} [opt_options.color = [105, 210, 231]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [167, 219, 216]] Border color.
 * @param {string} [opt_options.borderRadius = '100%'] Border radius.
 */
function Liquid(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.c = options.c === 0 ? 0 : options.c || 1;
  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [105, 210, 231];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [167, 219, 216];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Liquid, exports.Agent);

Liquid.prototype.name = 'Liquid';

exports.Liquid = Liquid;
/*global exports */
/**
 * Creates a new Heat.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {number} [opt_options.zIndex = 10] zIndex.
 * @param {string|Array} [opt_options.color = [255, 69, 0]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [224, 178, 154]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Heat(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [255, 69, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 178, 154];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Heat, exports.Agent);

Heat.prototype.name = 'Heat';

exports.Heat = Heat;
/*global exports */
/**
 * Creates a new Cold.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {string|Array} [opt_options.color = [132, 192, 201]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [0, 89, 102]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Cold(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [132, 192, 201];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [0, 89, 102];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Cold, exports.Agent);

Cold.prototype.name = 'Cold';

exports.Cold = Cold;
/*global exports */
/**
 * Creates a new Oxygen.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {number} [opt_options.zIndex = 10] zIndex.
 * @param {string|Array} [opt_options.color = [0, 174, 239]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [64, 255, 255]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Oxygen(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [0, 174, 239];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [64, 255, 255];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Oxygen, exports.Agent);

Oxygen.prototype.name = 'Oxygen';

exports.Oxygen = Oxygen;
/*global exports */
/**
 * Creates a new Light.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {number} [opt_options.zIndex = 10] zIndex.
 * @param {string|Array} [opt_options.color = [255, 200, 0]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [210, 210, 0]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Light(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [255, 200, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [210, 210, 0];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Light, exports.Agent);

Light.prototype.name = 'Light';

exports.Light = Light;
/*global exports */
/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Agent
 * @param {Object} parentA The object that starts the connection.
 * @param {Object} parentB The object that ends the connection.
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.opacity = 1] Opacity.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.borderTopWidth = 0] Border top width.
 * @param {number} [opt_options.borderTopStyle = 'dotted'] Border top style.
 */
function Connector(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  if (!options.parentA || !options.parentB) {
    throw new Error('Connector: both parentA and parentB are required.');
  }
  this.parentA = options.parentA;
  this.parentB = options.parentB;

  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.zIndex = options.zIndex || 0;

  this.borderWidth = 2;
  this.borderRadius = '0%';
  this.borderStyle = 'none';
  this.borderColor = 'red';

  this.borderTopStyle = 'dotted';
  this.borderRightStyle = 'none';
  this.borderBottomStyle = 'none';
  this.borderLeftStyle = 'none';

  this.width = 0;
  this.height = 0;
  this.color = 'transparent';
}
exports.Utils.extend(Connector, exports.Agent);

Connector.prototype.name = 'Connector';

/**
 * Called every frame, step() updates the instance's properties.
 */
Connector.prototype.step = function() {



  var a = this.parentA.location,
      b = this.parentB.location;

  this.width = Math.floor(exports.Vector.VectorSub(this.parentA.location,
      this.parentB.location).mag());

  this.location = exports.Vector.VectorAdd(this.parentA.location,
      this.parentB.location).div(2); // midpoint = (v1 + v2)/2

  this.angle = exports.Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};

exports.Connector = Connector;
/*global exports */
/**
 * Creates a new Point.
 *
 * @constructor
 * @extends Agent
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.color = [200, 200, 200]] Color.
 * @param {number} [opt_options.borderRadius = '100%'] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {number} [opt_options.borderStyle = 'solid'] Border style.
 * @param {number} [opt_options.borderColor = [60, 60, 60]] Border color.
 */
function Point(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 0;
  this.color = options.color || [200, 200, 200];
  this.borderRadius = options.borderRadius || '100%';
  this.borderWidth = options.borderWidth || 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [60, 60, 60];
}
exports.Utils.extend(Point, exports.Agent);

Point.prototype.name = 'Point';

exports.Point = Point;
/*global exports */
/**
 * Creates a new Food object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {number} [opt_options.zIndex = 10] zIndex.
 * @param {string|Array} [opt_options.color = [57, 28, 0]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [115, 255, 0]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Food(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [57, 128, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [115, 255, 0];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Food, exports.Agent);

Food.prototype.name = 'Food';

exports.Food = Food;
/*global exports */
/**
 * Creates a new Particle.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Particle options.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.lifespan = 40] The max life of the object. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, object is destroyed.
 * @param {boolean} {opt_options.fade = true} If true, opacity decreases proportionally with life.
 * @param {boolean} {opt_options.shrink = true} If true, width and height decrease proportionally with life.
 * @param {string} [opt_options.borderRadius = '100%'] The particle's border radius.
 * @param {boolean} [opt_options.checkEdges = false] Set to true to check the object's location against the world's bounds.
 * @param {boolean} [opt_options.maxSpeed = 4] Maximum speed.
 * @param {string|number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {Array} [opt_options.borderColor = 'transparent'] Border color.
 */
function Particle(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 20;
  this.height = options.height === 0 ? 0 : options.height || 20;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || 50;
  this.life = options.life === 0 ? 0 : options.life || 0;
  this.fade = options.fade === false ? false : true;
  this.shrink = options.shrink === false ? false : true;
  this.borderRadius = options.borderRadius || '100%';
  this.checkEdges = !!options.checkEdges;
  this.maxSpeed = options.maxSpeed || 4;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';

  if (!options.acceleration) {
    this.acceleration = new exports.Vector(1, 1);
    this.acceleration.normalize();
    this.acceleration.mult(30);
    this.acceleration.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
  }
  this.initWidth = this.width;
  this.initHeight = this.height;
  this.name = 'Particle';
}
exports.Utils.extend(Particle, exports.Agent);

Particle.prototype.name = 'Particle';

/**
 * Calculates location via sum of acceleration + velocity.
 *
 * @returns {number} The total number of times step has been executed.
 */
Particle.prototype.step = function() {

  var friction;

  // start apply forces

  if (this.world.c) { // friction
    friction = exports.Utils.clone(this.velocity);
    friction.mult(-1);
    friction.normalize();
    friction.mult(this.world.c);
    this.applyForce(friction);
  }
  this.applyForce(this.world.gravity); // gravity

    if (this.applyForces) { // !! rename this
      this.applyForces();
    }

  if (this.checkEdges) {
    this._checkWorldEdges();
  }

  // end apply forces

  this.velocity.add(this.acceleration); // add acceleration

  if (this.maxSpeed) {
    this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
  }

  if (this.minSpeed) {
    this.velocity.limit(null, this.minSpeed); // check if velocity < minSpeed
  }

  this.location.add(this.velocity); // add velocity

  if (this.fade) {
    this.opacity = exports.Utils.map(this.life, 0, this.lifespan, 1, 0);
  }

  if (this.shrink) {
    this.width = exports.Utils.map(this.life, 0, this.lifespan, this.initWidth, 0);
    this.height = exports.Utils.map(this.life, 0, this.lifespan, this.initHeight, 0);
  }

  this.acceleration.mult(0);

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    exports.Burner.System.destroyElement(this);
  }

};

exports.Particle = Particle;
/*global exports */
/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] ParticleSystem options.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move.
 * @param {number} [opt_options.lifespan = 1000] The max life of the system. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, system is destroyed.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {number} [opt_options.burst = 1] The number of particles to create per burst.
 * @param {number} [opt_options.burstRate = 1] The number of frames between bursts. Lower values = more particles.
 * @param {Object} [opt_options.emitRadius = 3] The ParticleSystem adds this offset to the location of the Particles it creates.
 * @param {Array} [opt_options.startColor = [100, 20, 20]] The starting color of the particle's palette range.
 * @param {Array} [opt_options.endColor = [255, 0, 0]] The ending color of the particle's palette range.
 * @param {Object} [opt_options.particleOptions] A map of options for particles created by system.
 * @param {string|number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {string} [opt_options.borderRadius = '0%'] Border radius.
 */
function ParticleSystem(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || 1000;
  this.life = options.life === 0 ? 0 : options.life || 0;
  this.width = options.width === 0 ? 0 : options.width || 0;
  this.height = options.height === 0 ? 0 : options.height || 0;
  this.burst = options.burst === 0 ? 0 : options.burst || 1;
  this.burstRate = options.burstRate === 0 ? 0 : options.burstRate || 4;
  this.emitRadius = options.emitRadius === 0 ? 0 : options.emitRadius || 3;
  this.startColor = options.startColor || [100, 20, 20];
  this.endColor = options.endColor || [255, 0, 0];
  this.particleOptions = options.particleOptions || {
    width : 15,
    height : 15,
    lifespan : 50,
    borderRadius : '100%',
    checkEdges : false,
    acceleration: null,
    velocity: null,
    location: null,
    maxSpeed: 3,
    fade: true
  };
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || '0%';

  var pl = new exports.ColorPalette();
  pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: this.startColor,
    endColor: this.endColor
  });

  this.beforeStep = function () {

    var location, offset,
        acceleration = this.particleOptions.acceleration,
        maxSpeed = this.particleOptions.maxSpeed;

    if (this.life < this.lifespan) {
      this.life += 1;
    } else if (this.lifespan !== -1) {
      exports.Burner.System.destroyElement(this);
      return;
    }

    if (this.clock % this.burstRate === 0) {

      location = this.getLocation(); // use the system's location
      offset = new exports.Vector(1, 1); // get the emit radius
      offset.normalize();
      offset.mult(this.emitRadius); // expand emit randius in a random direction
      offset.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
      location.add(offset);

      for (var i = 0; i < this.burst; i++) {
        this.particleOptions.world = this.world;
        this.particleOptions.life = 0;
        this.particleOptions.color = pl.getColor();
        this.particleOptions.acceleration = new exports.Vector(1, 1);
        this.particleOptions.acceleration.normalize();
        this.particleOptions.acceleration.mult(maxSpeed ? maxSpeed : 3);
        this.particleOptions.acceleration.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
        this.particleOptions.velocity = new exports.Vector();
        this.particleOptions.location = ParticleSystem.getParticleLocation(location);

        exports.Burner.System.add('Particle', this.particleOptions);
      }
    }
  };
}
exports.Utils.extend(ParticleSystem, exports.Agent);

/**
 * Returns a self-executing function that is executed
 * when particle is initialized. The function retains a
 * reference to the particle system's location.
 *
 * @returns {Function} A function that self-executes and
 *    returns a reference to the particle system's location.
 */
ParticleSystem.getParticleLocation = function(location) {
  return (function() {
    return new exports.Vector(location.x, location.y);
  })();
};

ParticleSystem.prototype.name = 'ParticleSystem';

exports.ParticleSystem = ParticleSystem;
/*global exports */
/**
 * Creates a new Oscillator.
 * Oscillators simulate wave patterns and move according to
 * amplitude and angular velocity.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Oscillator options.
 * @param {Object} [opt_options.initialLocation = The center of the world] The object's initial location.
 * @param {Object} [opt_options.lastLocation = {x: 0, y: 0}] The object's last location. Used to calculate
 *    angle if pointToDirection = true.
 * @param {Object} [opt_options.amplitude = {x: world width, y: world height}] Sets amplitude, the distance from the object's
 *    initial location (center of the motion) to either extreme.
 * @param {Object} [opt_options.acceleration = {x: 0, y: 0}] The object's acceleration. Oscillators have a
 *    constant acceleration.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.isPerlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {number} [opt_options.color = [200, 100, 0]] Color.
 * @param {number} [opt_options.borderTopRightRadius = '100%'] Border-top-right radius.
 * @param {number} [opt_options.borderBottomRightRadius = '100%'] Border-bottom-right radius.
 * @param {number} [opt_options.borderStyle = 'solid'] Border style.
 * @param {number} [opt_options.borderColor = [255, 150, 0]] Border color.
 */
function Oscillator(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.initialLocation = options.initialLocation ||
      new exports.Vector(this.world.bounds[1] / 2, this.world.bounds[2] / 2);
  this.lastLocation = new exports.Vector(0, 0);
  this.amplitude = options.amplitude || new exports.Vector(this.world.bounds[1] / 2 - this.width,
      this.world.bounds[2] / 2 - this.height);
  this.acceleration = options.acceleration || new exports.Vector(0.01, 0);
  this.aVelocity = new exports.Vector(0, 0);
  this.isStatic = !!options.isStatic;

  this.isPerlin = !!options.isPerlin;
  this.perlinSpeed = options.perlinSpeed || 0.005;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow || -2;
  this.perlinAccelHigh = options.perlinAccelHigh || 2;
  this.perlinOffsetX = options.perlinOffsetX || Math.random() * 10000;
  this.perlinOffsetY = options.perlinOffsetY || Math.random() * 10000;

  this.color = [200, 100, 0];
  this.borderTopRightRadius = '100%';
  this.borderBottomRightRadius = '100%';
  this.borderStyle = 'solid';
  this.borderColor = [255, 150, 50];
}
exports.Utils.extend(Oscillator, exports.Agent);

Oscillator.prototype.name = 'Oscillator';

/**
 * Updates the oscillator's properties.
 */
Oscillator.prototype.step = function () {



  var world = this.world, velDiff;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    if (this.isPerlin) {
      this.perlinTime += this.perlinSpeed;
      this.aVelocity.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.perlinOffsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.aVelocity.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.perlinOffsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    } else {
      this.aVelocity.add(this.acceleration); // add acceleration
    }

    this.location.x = this.initialLocation.x + Math.sin(this.aVelocity.x) * this.amplitude.x;
    this.location.y = this.initialLocation.y + Math.sin(this.aVelocity.y) * this.amplitude.y;

    if (this.pointToDirection) { // object rotates toward direction
        velDiff = exports.Vector.VectorSub(this.location, this.lastLocation);
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(velDiff.y, velDiff.x));
    }

    if (this.controlCamera) {
      this._checkCameraEdges();
    }

    if (this.checkEdges || this.wrapEdges) {
      this._checkWorldEdges(world);
    }

    if (this.lifespan > 0) {
      this.lifespan -= 1;
    }

    if (this.afterStep) {
      this.afterStep.apply(this);
    }

    if (this.pointToDirection) {
      this.lastLocation.x = this.location.x;
      this.lastLocation.y = this.location.y;
    }
  }
};
exports.Oscillator = Oscillator;
/*global exports */
/**
 * Creates a new Attractor object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {string|Array} [opt_options.color = [32, 102, 63]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [224, 228, 204]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Attractor(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || 10;
  this.mass = options.mass === 0 ? 0 : options.mass || 1000;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [92, 187, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Attractor, exports.Agent);

Attractor.prototype.name = 'Attractor';

exports.Attractor = Attractor;
/*global exports */
/**
 * Creates a new Repeller object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {string|Array} [opt_options.color = [250, 105, 0]] Color.
 * @param {string|number} [opt_options.borderWidth = '1em'] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [224, 228, 204]] Border color.
 * @param {string|number} [opt_options.borderRadius = '100%'] Border radius.
 */
function Repeller(opt_options) {

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || -10;
  this.mass = options.mass === 0 ? 0 : options.mass || 1000;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
  this.color = options.color || [250, 105, 0];
  this.borderWidth = options.borderWidth || '1em';
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius || '100%';

  exports.Burner.PubSub.publish('UpdateCache', this);
}
exports.Utils.extend(Repeller, exports.Agent);

Repeller.prototype.name = 'Repeller';

exports.Repeller = Repeller;
/*global exports */
/**
 * Creates a new FlowField.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.resolution = 50] The lower the value, the more vectors are created to define the flow field. Low values increase processing time to create the field.
 * @param {number} [opt_options.perlinSpeed = 0.01] The speed to move through the Perlin Noise space.
 * @param {number} [opt_options.perlinTime = 100] Sets the Perlin Noise time.
 * @param {Object} [opt_options.field = null] A list of vectors that define the flow field.
 * @param {Object} [opt_options.createMarkers = false] Set to true to visualize the flow field.
 */
function FlowField(opt_options) {

  var options = opt_options || {};

  this.resolution = options.resolution || 50;
  this.perlinSpeed = options.perlinSpeed || 0.01;
  this.perlinTime = options.perlinTime || 100;
  this.field = options.field || null;
  this.createMarkers = options.createMarkers || false;
  // if a world is not passed, use the first world in the system
  this.world = options.world || exports.Burner.System.allWorlds()[0];
}

FlowField.prototype.name = 'FlowField';

/**
 * Builds a FlowField.
 */
FlowField.prototype.build = function() {

  var col, colMax, row, rowMax, x, y, theta, fieldX, fieldY, field, angle,
      vectorList = {},
      world = this.world,
      cols = Math.ceil(world.bounds[1] / parseFloat(this.resolution)),
      rows = Math.ceil(world.bounds[2] / parseFloat(this.resolution)),
      xoff = this.perlinTime, // create markers and vectors
      yoff;

  for (col = 0, colMax = cols; col < colMax ; col += 1) {
    yoff = this.perlinTime;
    vectorList[col] = {};
    for (row = 0, rowMax = rows; row < rowMax ; row += 1) {

      x = col * this.resolution + this.resolution / 2; // get location on the grid
      y = row * this.resolution + this.resolution / 2;

      theta = exports.Utils.map(exports.SimplexNoise.noise(xoff, yoff, 0.1), 0, 1, 0, Math.PI * 2); // get the vector based on Perlin noise
      fieldX = Math.cos(theta);
      fieldY = Math.sin(theta);
      field = new exports.Vector(fieldX, fieldY);
      vectorList[col][row] = field;
      angle = exports.Utils.radiansToDegrees(Math.atan2(fieldY, fieldX)); // get the angle of the vector

      if (this.createMarkers) {

        var ffm = new exports.FlowFieldMarker({ // create the marker
          location: new exports.Vector(x, y),
          scale: 1,
          opacity: exports.Utils.map(angle, -360, 360, 0.1, 1),
          width: this.resolution,
          height: this.resolution/2,
          field: field,
          angle: angle,
          colorMode: 'rgb',
          color: [200, 100, 50]
        });
        world.el.appendChild(ffm);
      }
      yoff += parseFloat(this.perlinSpeed);
    }
    xoff += parseFloat(this.perlinSpeed);
  }
  this.field = vectorList;
};

exports.FlowField = FlowField;
/*global exports, document */
/**
 * Creates a new FlowFieldMarker.
 *
 * @constructor
 * @param {Object} options Options.
 * @param {Object} options.location Location.
 * @param {number} options.scale Scale.
 * @param {number} options.opacity Opacity
 * @param {number} options.width Width.
 * @param {number} options.height Height.
 * @param {number} options.angle Angle.
 * @param {string} options.colorMode Color mode.
 * @param {Object} options.color Color.
 */
function FlowFieldMarker(options) {

  var requiredOptions = {
        location: 'object',
        scale: 'number',
        angle: 'number',
        opacity: 'number',
        width: 'number',
        height: 'number',
        colorMode: 'string',
        color: 'array'
      }, el, nose;

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {

    el = document.createElement("div");
    nose = document.createElement("div");
    el.className = "flowFieldMarker element";
    nose.className = "nose";
    el.appendChild(nose);

    el.style.cssText = exports.Mover._getCSSText({
      x: options.location.x - options.width / 2,
      y: options.location.y - options.height / 2,
      width: options.width,
      height: options.height,
      opacity: options.opacity,
      a: options.angle,
      s: options.scale,
      color: options.color,
      z: options.zIndex,
      borderRadius: options.borderRadius
    });

    return el;
  }
}

FlowFieldMarker.prototype.name = 'FlowFieldMarker';

exports.FlowFieldMarker = FlowFieldMarker;
/*global config, exports, document */
exports.Utils.addEvent(document, 'keyup', function(e) {

  if (e.keyCode === config.keyMap.pause) {
    exports.Burner.PubSub.publish('pause');
  }
  if (e.keyCode === config.keyMap.resetSystem) {
    exports.Burner.PubSub.publish('resetSystem');
  }
  if (e.keyCode === config.keyMap.destroySystem) {
    exports.Burner.PubSub.publish('destroySystem');
  }
  if (e.keyCode === config.keyMap.stats) {
    exports.Burner.PubSub.publish('stats');
  }
});
}(exports)); // FloraJS end.
