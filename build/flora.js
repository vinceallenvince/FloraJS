/*
FloraJS
Copyright (C) 2012 Vince Allen
Brooklyn, NY 11215, USA

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
/* Version: 0.0.2 */
/* Simplex noise by Sean McCullough banksean@gmail.com */
/* Build time: November 4, 2012 05:24:34 */
/** @namespace */
var Flora = {}, exports = Flora;

(function(exports) {
/**
 * RequestAnimationFrame shim layer with setTimeout fallback
 * @param {function} callback The function to call.
 * @returns {function|Object} An animation frame or a timeout object.
 */
window.requestAnimFrame = (function(callback){

  'use strict';

  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();
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
    reset: 82,
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
/*global exports, window */
/**
 * Creates a new System.
 *
 * @constructor
 */
function System() {

  'use strict';
}

System.name = 'System';

/**
 * A list of instructions to execute before the system starts.
 */
System.setup = null;

/**
 * Starts the System.
 * @param {function} func A list of instructions to execute before the system starts.
 * @param {Object} opt_universe A map of options for the System's Universe.
 * @param {Array} opt_worlds An array of DOM elements to use as Worlds.
 */
System.start = function (func, opt_universe, opt_worlds) {

  'use strict';

  var i, max,
      defaultColorList = exports.config.defaultColorList;

  this.universeOptions = opt_universe || null;
  this.worlds = opt_worlds || null;

  this._featureDetector = new exports.FeatureDetector();

  this.supportedFeatures = {};
  this.supportedFeatures.csstransforms = this._featureDetector.detect('csstransforms');
  this.supportedFeatures.csstransforms3d = this._featureDetector.detect('csstransforms3d');
  this.supportedFeatures.touch = this._featureDetector.detect('touch');

  exports.liquids = [];
  exports.repellers = [];
  exports.attractors = [];
  exports.heats = [];
  exports.colds = [];
  exports.lights = [];
  exports.oxygen = [];
  exports.food = [];
  exports.predators = [];

  exports.mouse = {
    loc: new exports.Vector(),
    locLast: new exports.Vector()
  };

  // create elementList before universe
  exports.elementList = new exports.ElementList();

  exports.universe = new exports.Universe(this.universeOptions);
  if (exports.Interface.getDataType(this.worlds) === 'array') {
    for (i = 0, max = this.worlds.length; i < max; i += 1) {
      exports.universe.addWorld({
        el: this.worlds[i]
      });
    }
  } else {
    exports.universe.addWorld();
  }

  exports.camera = new exports.Camera();

  // add default colors
  exports.defaultColors = new exports.ColorTable();
  for (i = 0, max = defaultColorList.length; i < max; i++) {
    exports.defaultColors.addColor({
      name: defaultColorList[i].name,
      startColor: defaultColorList[i].startColor,
      endColor: defaultColorList[i].endColor
    });
  }

  exports.animLoop = function () {

    var i, max,
        universe = exports.universe,
        world = universe.first(),
        elements = exports.elementList.all();

    if (universe.isPlaying) {
      window.requestAnimFrame(exports.animLoop);

      if (universe.zSorted) {
        elements = elements.sort(function(a,b){return (b.zIndex - a.zIndex);});
      }

      for (i = elements.length - 1; i >= 0; i -= 1) {
        elements[i].step();
        if (elements[i]) {
          elements[i].draw();
        }
      }

      exports.universe.updateClocks();
    }
  };


  func = exports.Interface.getDataType(func) === "function" ? func : function () {};
  System.setup = func;

  func();
  exports.animLoop();
};

/**
 * Destroys a System.
 */
System.destroy = function () {
  'use strict';
  exports.elementList.destroyAll();
};

exports.System = System;
/*global console, exports */
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

  'use strict';

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

  'use strict';

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

  'use strict';

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

  'use strict';

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

  'use strict';

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

  'use strict';

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

   'use strict';

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

  'use strict';

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

  'use strict';

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

  'use strict';

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
 * Concatenates several properties into a single list
 * representing the style properties of an object.
 *
 * @param [Object] props A map of properties.
 * @returns {string} A list of style properties.
 */
Utils.getCSSText = function(props) {

  'use strict';

  var positionStr = '';

  if (!props.color) {
    props.color = [];
    props.background = null;
  } else {
    props.background = props.cm + '(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';
  }

  if (!props.borderColor) {
    props.borderColor = [];
    props.borderColorStr = '';
  } else {
    props.borderColorStr = props.cm + '(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')';
  }

  if (exports.System.supportedFeatures.csstransforms3d) {
    positionStr = [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
    ].join(';');
  } else if (exports.System.supportedFeatures.csstransforms) {
    positionStr = [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
    ].join(';');
  } else {
    positionStr = [
      'position: absolute',
      'left: ' + props.x + 'px',
      'top: ' + props.y + 'px'
    ].join(';');
  }

  return [
    positionStr,
    'opacity: ' + props.o,
    'width: ' + props.w + 'px',
    'height: ' + props.h + 'px',
    'background: ' + props.background,
    'z-index: ' + props.z,
    'border-width: ' + props.borderWidth + 'px',
    'border-style: ' + props.borderStyle,
    'border-color: ' + props.borderColorStr,
    'border-radius: ' + props.borderRadius,
    'box-shadow: ' + props.boxShadow
  ].join(';');
};

exports.Utils = Utils;
/*jshint supernew:true */
/**
 * Creates a new Vector.
 *
 * @param {number} [opt_x = 0] The x location.
 * @param {number} [opt_y = 0] The y location.
 * @constructor
 */
function Vector(opt_x, opt_y) {
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
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
  'use strict';
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

/**
 * Limits the vector's magnitude.
 *
 * @param {number} high The upper bound of the vector's magnitude.
 * @returns {Object} This vector.
 */
Vector.prototype.limit = function(high) {
  'use strict';
  if (this.mag() > high) {
    this.normalize();
    this.mult(high);
  }
  return this;
};

Vector.prototype.limitLow = function(low) {
  'use strict';
  if (this.mag() < low) {
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
  'use strict';
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
  'use strict';
  return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
};

/**
 * Rotates a vector using a passed angle in radians.
 *
 * @param {number} radians The angle to rotate in radians.
 * @returns {Object} This vector.
 */
Vector.prototype.rotate = function(radians) {
  'use strict';
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
  'use strict';
  return Vector.VectorAdd(this, vector).div(2);
};

/**
 * Calulates the dot product.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} A vector.
 */
Vector.prototype.dot = function(vector) {
  'use strict';
  if (this.z && vector.z) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  return this.x * vector.x + this.y * vector.y;
};
exports.Vector = Vector;
/*global exports */
/**
 * Creates a new ColorPalette object.
 *
 * Use this class to create a palette of colors randomly selected
 * from a range created with initial start and end colors. You
 * can also generate gradients that smoothly interpolate from
 * start and end colors.
 *
 * @constructor
 */
function ColorPalette(opt_options) {

  'use strict';

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
}

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

  'use strict';

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

  'use strict';

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

  'use strict';

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

  'use strict';

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

  'use strict';

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
  'use strict';
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
/*global exports */
/**
 * Creates a new BorderPalette object.
 *
 * Use this class to create a palette of border styles.
 *
 * @constructor
 */
function BorderPalette() {

  'use strict';

  /**
   * Holds a list of border styles.
   * @private
   */
  this._borders = [];
}

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

  'use strict';

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

  'use strict';

  if (this._borders.length > 0) {
    return this._borders[exports.Utils.getRandomNumber(0, this._borders.length - 1)];
  } else {
    throw new Error('BorderPalette.getBorder: You must add borders via addBorder() before using getBorder().');
  }
};
exports.BorderPalette = BorderPalette;
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

  'use strict';

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

  'use strict';

  return 0.1;
}
}));
exports.SimplexNoise = SimplexNoise;
/*global console */
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

  'use strict';

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

  'use strict';

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

  'use strict';

  if (Object.prototype.toString.call(element) === '[object Array]') {
    return 'array';
  }

  if (Object.prototype.toString.call(element) === '[object NodeList]') {
    return 'nodeList';
  }

  return typeof element;
};

exports.Interface = Interface;
/*global exports */
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
  if (exports.System.supportedFeatures.touch && this.isDeviceMotion) {
    this.addDeviceMotionEventListener();
  }

  // stats
  if (this.showStats) {
    this.createStats();
  }
}

Universe.prototype.name = 'Universe';

/**
 * Adds a new World to the 'records' array.
 *
 * @param {Object} opt_options See options for World.
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

  if (exports.System.supportedFeatures.touch && props.isDeviceMotion) {
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
 * @param {string} id The world's id.
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
 * Removes all elements from a World.
 *
 * @param {string} id The world's id.
 */
Universe.prototype.clearWorld = function (id) {

  'use strict';

  var i, max, records = this._records;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      exports.elementList.destroyByWorld(records[i]);
      return true;
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
    exports.elementList.destroyByWorld(records[i]);
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
/*global exports */
/**
 * Creates a new World.
 *
 * @constructor
 *
 * @param {Object} [opt_options] World options.
 * @param {string} [opt_options.id = "m-" + World._idCount] An id. If an id is not provided, one is created.
 * @param {boolean} [opt_options.isStatic = true] Set to false if transforming the world every frame.
 * @param {number} [opt_options.clock = 0] Increments each frame.
 * @param {number} [opt_options.c = 0.01] Coefficient of friction.
 * @param {Object} [opt_options.gravity = {x: 0, y: 1}] Gravity
 * @param {Object} [opt_options.wind = {x: 0, y: 0}] Wind
 * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location
 * @param {number} [opt_options.scale = 1] Scale
 * @param {number} [opt_options.angle = 0] Angle
 * @param {number} [opt_options.opacity = 0.85] Opacity
 * @param {string} [opt_options.colorMode = 'rgb'] Color mode. Valid options are 'rgb'. 'hex' and 'hsl' coming soon.
 * @param {Array} [opt_options.color = null] The object's color expressed as an rbg or hsl value. ex: [255, 100, 0]
 * @param {number} [opt_options.borderWidth = 0] The border width.
 * @param {number} [opt_options.borderStyle = 0] The border style. Possible values: 'none', 'solid', 'dotted', 'dashed', 'double', 'inset', 'outset', 'groove', 'ridge'
 * @param {number} [opt_options.borderColor = null] The border color.
 * @param {number} [opt_options.borderRadius = 0] The border radius.
 * @param {number|string} [opt_options.boxShadow = 0] The box shadow.
 * @param {number} [opt_options.width = window.width] The world width.
 * @param {number} [opt_options.height = window.height] The world height.
 * @param {number} [opt_options.zIndex = 0] The world z-index.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 */
function World(opt_options) {

  'use strict';

  var me = this, options = opt_options || {},
      winSize = exports.Utils.getWindowSize();

  this.isStatic = options.isStatic || true;
  this.clock = options.clock || 0;
  this.c = options.c || 0.01;
  this.gravity = options.gravity || new exports.Vector(0, 1);
  this.wind =  options.wind || new exports.Vector();
  this.location = options.location || new exports.Vector();

  this.scale = options.scale || 1;
  this.angle = options.angle || 0;
  this.opacity = options.opacity || 1;
  this.colorMode = options.colorMode || 'rgb';
  this.color = options.color || [0, 0, 0];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || null;
  this.borderRadius = options.borderRadius || 0;
  this.boxShadow = options.boxShadow || 0;
  this.zIndex = 0;

  this.beforeStep = options.beforeStep || undefined;
  this.afterStep = options.afterStep || undefined;

  /**
   * If no DOM element is passed for the world,
   * use document.body. Because the body initially has
   * no height, we use the window height.
   */
  if (!options.el) {
    this.el = document.body; // if no world element is passed, use document.body
    this.width = winSize.width;
    this.height = winSize.height;
    this.id = World.name + "-" + World._idCount; // if no id, create one
  } else {
    this.el = options.el;
    this.id = this.el.id; // use the element's id as the record id
    this.width = this.el.offsetWidth;
    this.height = this.el.offsetHeight;
  }

  this.el.className = 'world floraElement';
  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  World._idCount += 1; // increment id

  // events

  exports.Utils.addEvent(window, 'resize', function(e) { // listens for window resize
    me.resize.call(me);
  });
}

World.prototype.name = 'World';

/**
 * Increments as each World is created.
 * @type number
 * @default 0
 */
World._idCount = 0;

/**
 * Configures a new World by setting the DOM element and the element's width/height.
 *
 * @param {Object} opt_el The DOM element representing the world.
 */
World.prototype.configure = function(opt_el) { // should be called after doc ready()

  'use strict';

  var el = opt_el || null;

  this.el = el || document.body; // if no world element is passed, use document.body
  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';
};

/**
 * Updates a world instance with passed arguments.
 * Typically called to change the window's default size or
 * change the world's style.
 *
 * @param {Object} props A hash of properties to update.
 *    Optional properties:
 *    opt_props.style A map of css styles to apply.
 */
World.prototype.update = function(opt_props) {

  'use strict';

  var i, key, cssText = '',
      props = exports.Interface.getDataType(opt_props) === 'object' ? opt_props : {};

  for (key in props) {
    if (props.hasOwnProperty(key)) {
      this[key] = props[key];
    }
  }

  if (props.el) { // if updating the world's DOM element; update the width and height
    this.width = parseInt(this.el.style.width.replace('px', ''), 10);
    this.height = parseInt(this.el.style.height.replace('px', ''), 10);
  }

  if (!this.el.style.setAttribute) { // WC3
    if (props.style) {
      for (i in props.style) {
        if (props.style.hasOwnProperty(i)) {
          this.el.style[i] = props.style[i];
          cssText = cssText + i + ': ' + props.style[i] + ';';
        }
      }
    }
  } else { // IE
    if (props.style) {
      for (i in props.style) {
        if (props.style.hasOwnProperty(i)) {
          cssText = cssText + i + ': ' + props.style[i] + ';';
        }
      }
    }
    this.el.style.setAttribute('cssText', cssText, 0);
  }
};

/**
 * Called from a window resize event, resize() repositions all Flora elements relative
 * to the new window size. Also, if the world is the document.body, resets the body's
 * width and height attributes.
 */
World.prototype.resize = function() {

  'use strict';

  var i, max, elementLoc, controlCamera, winSize = exports.Utils.getWindowSize(),
    windowWidth = winSize.width,
    windowHeight = winSize.height,
    elements = exports.elementList.all();

  // check of any elements control the camera
  for (i = 0, max = elements.length; i < max; i += 1) {
    if (elements[i].controlCamera) {
      controlCamera = true;
      break;
    }
  }

  // loop thru elements
  if (!controlCamera) {
    for (i = 0, max = elements.length; i < max; i += 1) {

      elementLoc = elements[i].location; // recalculate location

      elementLoc.x = windowWidth * (elementLoc.x/this.width);
      elementLoc.y = windowHeight * (elementLoc.y/this.height);

    }

    if (this.el === document.body) {
      this.width = windowWidth;
      this.height = windowHeight;
      this.el.style.width = this.width + 'px';
      this.el.style.height = this.height + 'px';
    }
  }
};

/**
 * Called every frame, step() updates the world's properties.
 */
World.prototype.step = function() {

  'use strict';

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }
  if (this.afterStep) {
    this.afterStep.apply(this);
  }
};

/**
 * Called every frame, draw() renders the world.
 */
World.prototype.draw = function() {

  'use strict';

  /**
   * If there's not an object controlling the camera,
   * we want to draw the world once.
   */
  if (!exports.camera.controlObj && this.isStatic && this.clock > 0) {
    return;
  }

  this.el.style.cssText = exports.Utils.getCSSText({
    x: this.location.x,
    y: this.location.y,
    s: this.scale,
    a: this.angle,
    o: this.opacity,
    w: this.width,
    h: this.height,
    cm: this.colorMode,
    color: this.color,
    z: this.zIndex,
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor: this.borderColor,
    borderRadius: this.borderRadius,
    boxShadow: this.boxShadow
  });
};
exports.World = World;
/*global exports */
/**
 * Creates a new Camera.
 *
 * @constructor
 * @param {Object} [opt_options]
 * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location.
 * @param {Object} [opt_options.controlObj = null] The object that controls the camera.
 */
function Camera(opt_options) {

  'use strict';

  var options = opt_options || {};

  this.location = options.location || new exports.Vector(0, 0);
  this.controlObj = options.controlObj || null;
}

Camera.prototype.name = 'Camera';

exports.Camera = Camera;
/*global exports */
/**
 * Creates a new Element. All Flora elements extend Element. Element holds the minimum properties
 * need to render the element via draw().
 *
 * @constructor
 *
 * @param {Object} [opt_options] Element options.
 * @param {string} [opt_options.id = "m-" + Element._idCount] An id. If an id is not provided, one is created.
 * @param {Object|function} [opt_options.view] HTML representing the Element instance.
 * @param {string} [opt_options.className = 'agent'] The corresponding DOM element's class name.
 * @param {array} [opt_options.sensors = []] A list of sensors attached to this object.
 * @param {boolean} [opt_options.controlCamera = false] If true, camera will follow this object.
 * @param {number} [opt_options.width = 20] Width
 * @param {number} [opt_options.height = 20] Height
 * @param {number} [opt_options.scale = 1] Scale
 * @param {number} [opt_options.angle = 0] Angle
 * @param {number} [opt_options.opacity = 0.85] Opacity
 * @param {string} [opt_options.colorMode = 'rgb'] Color mode. Valid options are 'rgb'. 'hex' and 'hsl' coming soon.
 * @param {Array} [opt_options.color = null] The object's color expressed as an rbg or hsl value. ex: [255, 100, 0]
 * @param {number} [opt_options.zIndex = 1] z-index
 * @param {number} [opt_options.borderWidth = false] borderWidth The object's border width in pixels.
 * @param {string} [opt_options.borderStyle = false] borderStyle The object's border style. Valid options are 'none',
 *    'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit'.
 * @param {string} [opt_options.borderColor = false] borderColor The object's border color expressed as an
 *    rbg or hsl value. ex: [255, 100, 0]
 * @param {string} [opt_options.borderRadius = false] borderRadius The object's border radius as a percentage.
 * @param {string} [opt_options.boxShadow =  false] boxShadow The object's box shadow.
 * @param {Object} [opt_options.location = The center of the world] The object's initial location.
 * @param {Object} [opt_options.acceleration = {x: 0, y: 0}] The object's initial acceleration.
 * @param {Object} [opt_options.velocity = {x: 0, y: 0}] The object's initial velocity.
 */
function Element(opt_options) {

  'use strict';

  var i, max, key, prop;

  for (i = 0, max = arguments.length; i < max; i += 1) {
    prop = arguments[i];
    for (key in prop) {
      if (prop.hasOwnProperty(key)) {
        this[key] = prop[key];
      }
    }
  }

  var options = opt_options || {},
      elements = exports.elementList.all() || [],
      liquids = exports.liquids || [],
      repellers = exports.repellers || [],
      attractors = exports.attractors || [],
      heats = exports.heats || [],
      colds = exports.colds || [],
      predators = exports.predators || [],
      lights = exports.lights || [],
      oxygen = exports.oxygen || [],
      food = exports.food || [],
      world, constructorName = this.name || 'anon';

  this.id = options.id || constructorName.toLowerCase() + "-" + Element._idCount; // if no id, create one

  if (options.view && exports.Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
    this.el = options.view.apply(this, options.viewArgs);
  } else if (exports.Interface.getDataType(options.view) === "object") { // if view is supplied and is an object
    this.el = options.view;
  } else {
    this.el = document.createElement("div");
  }

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  world = this.world;

  // set render properties
  this.location = options.location || new exports.Vector(world.width/2, world.height/2);
  this.acceleration = options.acceleration || new exports.Vector();
  this.velocity = options.velocity || new exports.Vector();
  this.width = options.width === 0 ? 0 : options.width || 20;
  this.height = options.height === 0 ? 0 : options.height || 20;
  this.scale = options.scale === 0 ? 0 : options.scale || 1;
  this.angle = options.angle || 0;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.85;
  this.colorMode = options.colorMode || 'rgb';
  this.color = options.color || null;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 1;
  this.borderWidth = options.borderWidth || null;
  this.borderStyle = options.borderStyle || null;
  this.borderColor = options.borderColor || null;
  this.borderRadius = options.borderRadius || null;
  this.boxShadow = options.boxShadow || null;

    // set sensors
  this.sensors = options.sensors || [];

  this.className = options.className || constructorName.toLowerCase();
  this.className += ' floraElement';

  elements.push(this); // push new instance of Element

  this.el.id = this.id;
  this.el.className = this.sensors.length > 0 ? (this.className + ' hasSensor') : this.className;
  this.el.style.display = 'none';

  if (world.el) {
    world.el.appendChild(this.el); // append the view to the World
  }

  Element._idCount += 1; // increment id

  if (this.className.search('liquid') !== -1) {
    liquids.push(this); // push new instance of liquids to liquid list
  } else if (this.className.search('repeller') !== -1) {
    repellers.push(this); // push new instance of repeller to repeller list
  } else if (this.className.search('attractor') !== -1) {
    attractors.push(this); // push new instance of attractor to attractor list
  } else if (this.className.search('heat') !== -1) {
    heats.push(this);
  } else if (this.className.search('cold') !== -1) {
    colds.push(this);
  } else if (this.className.search('predator') !== -1) {
    predators.push(this);
  } else if (this.className.search('light') !== -1) {
    lights.push(this);
  } else if (this.className.search('oxygen') !== -1) {
    oxygen.push(this);
  } else if (this.className.search('food') !== -1) {
    food.push(this);
  }

  // setup camera control
  this.controlCamera = !!options.controlCamera;

  if (this.controlCamera) { // if this object controls the camera

    exports.camera.controlObj = this;

    // need to position world so controlObj is centered on screen
    world.location.x = -world.width/2 + (exports.Utils.getWindowSize().width)/2 + (world.width/2 - this.location.x);
    world.location.y = -world.height/2 + (exports.Utils.getWindowSize().height)/2 + (world.height/2 - this.location.y);
  }
}

/**
 * Increments as each Element is created.
 * @type number
 * @default 0
 */
Element._idCount = 0;

Element.events =[
  "mouseenter",
  "mousedown",
  "mousemove",
  "mouseup",
  "mouseleave"
];

Element.prototype.name = 'Element';

/**
 * Called by a mouseover event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Element.mouseover = function(e) {

  'use strict';

  this.isMouseOut = false;
  clearInterval(this.mouseOutInterval);
};

/**
 * Called by a mousedown event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Element.mousedown = function(e) {

  'use strict';

  var target = e.target;

  this.isPressed = true;
  this.isMouseOut = false;
  this.offsetX = e.pageX - target.offsetLeft;
  this.offsetY = e.pageY - target.offsetTop;
};

/**
 * Called by a mousemove event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Element.mousemove = function(e) {

  'use strict';

  var x, y;

  if (this.isPressed) {

    this.isMouseOut = false;

    x = e.pageX - this.world.el.offsetLeft;
    y = e.pageY - this.world.el.offsetTop;

    if (Element.mouseIsInsideWorld(this.world)) {
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
Element.mouseup = function(e) {

  'use strict';

  this.isPressed = false;
};

/**
 * Called by a mouseout event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Element.mouseout = function(e) {

  'use strict';

  var me = this,
    x, y;

  if (this.isPressed) {

    this.isMouseOut = true;

    this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

      if (me.isPressed && me.isMouseOut) {

        x = exports.mouse.loc.x - me.world.el.offsetLeft;
        y = exports.mouse.loc.y - me.world.el.offsetTop;

        me.location = new exports.Vector(x, y);
      }
    }, 16);
  }
};

/**
 * Checks if mouse location is inside the world.
 *
 * @param {Object} world A Flora world.
 * @returns {boolean} True if mouse is inside world; False if
 *    mouse is outside world.
 */
Element.mouseIsInsideWorld = function(world) {

  'use strict';

  var x = exports.mouse.loc.x,
      y = exports.mouse.loc.y;

  if (world) {
    if (x > world.location.x &&
      x < world.location.x + world.width &&
      y > world.location.y &&
      y < world.location.y + world.height) {
      return true;
    }
  }
  return false;
};

/**
 * Updates properties of this element. Flora elements extending
 * Element should implement their own step() function.
 */
Element.prototype.step = function () {};

/**
 * Renders the element to the DOM. Called every frame.
 */
Element.prototype.draw = function() {

  'use strict';

  this.el.style.cssText = exports.Utils.getCSSText({
    x: this.location.x - this.width/2,
    y: this.location.y - this.height/2,
    s: this.scale,
    a: this.angle,
    o: this.opacity,
    w: this.width,
    h: this.height,
    cm: this.colorMode,
    color: this.color,
    z: this.zIndex,
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor: this.borderColor,
    borderRadius: this.borderRadius,
    boxShadow: this.boxShadow
  });
};

exports.Element = Element;
/*global exports */
/**
 * Creates a new Agent.
 *
 * Agents are autonomous objects affected by World forces (gravity, wind) and Proximity forces (Attractors, Repellers, Liquid).
 * Because their primary purpose is to navigate their World, they carry navigational properties like 'avoidEdges',
 * 'maxSteeringForce' or 'turningRadius' which can be manipulated to adjust their observed behavior. They can also carry
 * Sensors which react to Stimuli and return information about the World.
 *
 * @constructor
 * @extends Element
 *
 * @param {Object} [opt_options] Agent options.
 * @param {number} [opt_options.mass = 10] Mass
 * @param {number} [opt_options.maxSpeed = 10] Maximum speed
 * @param {number} [opt_options.minSpeed = 0] Minimum speed
 * @param {number} [opt_options.motorSpeed = 2] Motor speed
 * @param {number} [opt_options.lifespan = -1] Life span. Set to -1 to live forever.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the agent's parent.
 * @param {number} [opt_options.offsetAngle = 30] The angle of rotation around the parent carrying the agent.
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
 * @param {boolean} [opt_options.seekTarget = null] An object to seek.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.checkEdges = true] Set to true to check the object's location against the world's bounds.
 * @param {boolean} [opt_options.wrapEdges = false] Set to true to set the object's location to the opposite
 * side of the world if the object moves outside the world's bounds.
 * @param {boolean} [opt_options.avoidEdges = false] Set to true to calculate a steering force away from the
 * world's bounds.
 * @param {number} [opt_options.avoidEdgesStrength = 200] Sets the strength of the steering force when avoidEdges = true.
 * @param {number} [opt_options.bounciness = 0.75] Set the strength of the rebound when an object is outside the
 * world's bounds and wrapEdges = false.
 * @param {number} [opt_options.maxSteeringForce = 10] Set the maximum strength of any steering force.
 * @param {number} [opt_options.turningRadius = 60] Used to calculate steering force with key control.
 * @param {number} [opt_options.thrust = 5] Used to apply forward motion with key control.
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 */


function Agent(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Element.call(this, options);

  this.mass = options.mass || 10;
  this.maxSpeed = options.maxSpeed === 0 ? 0 : options.maxSpeed || 10;
  this.minSpeed = options.minSpeed || 0;
  this.motorSpeed = options.motorSpeed || 0;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || -1;
  this.offsetDistance = options.offsetDistance === 0 ? 0 : options.offsetDistance|| 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.pointToDirection = options.pointToDirection === false ? false : options.pointToDirection || true;
  this.followMouse = !!options.followMouse;
  this.seekTarget = options.seekTarget || null;
  this.followTarget = options.followTarget || null;
  this.isStatic = !!options.isStatic;
  this.draggable = !!options.draggable;
  this.checkEdges = options.checkEdges === false ? false : options.checkEdges || true;
  this.wrapEdges = !!options.wrapEdges;
  this.avoidEdges = !!options.avoidEdges;
  this.avoidEdgesStrength = options.avoidEdgesStrength === 0 ? 0 : options.avoidEdgesStrength || 200;
  this.bounciness = options.bounciness === 0 ? 0 : options.bounciness || 0.75;
  this.maxSteeringForce = options.maxSteeringForce === 0 ? 0 : options.maxSteeringForce || 100;
  this.turningRadius = options.turningRadius === 0 ? 0 : options.turningRadius || 90;
  this.thrust = options.thrust === 0 ? 0 : options.thrust || 5;
  this.flocking = !!options.flocking;
  this.desiredSeparation = options.desiredSeparation === 0 ? 0 : options.desiredSeparation || this.width * 2;
  this.separateStrength = options.separateStrength === 0 ? 0 : options.separateStrength || 0.3;
  this.alignStrength = options.alignStrength === 0 ? 0 : options.alignStrength || 0.2;
  this.cohesionStrength = options.cohesionStrength === 0 ? 0 : options.cohesionStrength || 0.1;
  this.flowField = options.flowField || null;
  this.beforeStep = options.beforeStep || undefined;
  this.afterStep = options.afterStep || undefined;

  if (this.draggable) {
    exports.Utils.addEvent(this.el, 'mouseover', exports.Element.mouseover.bind(this));
    exports.Utils.addEvent(this.el, 'mousedown', exports.Element.mousedown.bind(this));
    exports.Utils.addEvent(this.el, 'mousemove', exports.Element.mousemove.bind(this));
    exports.Utils.addEvent(this.el, 'mouseup', exports.Element.mouseup.bind(this));
    exports.Utils.addEvent(this.el, 'mouseout', exports.Element.mouseout.bind(this));
  }
}
exports.Utils.extend(Agent, exports.Element);

Agent.prototype.name = 'Agent';

/**
 * Called every frame, step() updates the instance's properties.
 */
Agent.prototype.step = function() {

  'use strict';

  var i, max, dir, friction, force, nose, r, theta, x, y, sensor, className, sensorActivated,
    world = this.world, elements = exports.elementList.all();

  //

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  //

  if (!this.isStatic && !this.isPressed) {

    // APPLY FORCES -- start

    if (exports.liquids.length > 0) { // liquid
      for (i = 0, max = exports.liquids.length; i < max; i += 1) {
        if (this.id !== exports.liquids[i].id && this.isInside(exports.liquids[i])) {
          force = this.drag(exports.liquids[i]);
          this.applyForce(force);
          className = exports.liquids[i].className + ' activated';
          exports.liquids[i].el.className = className;
        }
      }
    }

    if (exports.repellers.length > 0) { // repeller
      for (i = 0, max = exports.repellers.length; i < max; i += 1) {
        if (this.id !== exports.repellers[i].id) {
          force = this.attract(exports.repellers[i]);
          this.applyForce(force);
        }
      }
    }

    if (exports.attractors.length > 0) { // attractor
      for (i = 0, max = exports.attractors.length; i < max; i += 1) {
        if (this.id !== exports.attractors[i].id) {
          force = this.attract(exports.attractors[i]);
          this.applyForce(force);
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

        if (sensor.activated) {
          this.applyForce(sensor.getActivationForce({
            agent: this
          }));
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

    if (world.c) { // friction
      friction = exports.Utils.clone(this.velocity);
      friction.mult(-1);
      friction.normalize();
      friction.mult(world.c);
      this.applyForce(friction);
    }

    this.applyForce(world.wind); // wind

    this.applyForce(world.gravity); // gravity

    if (this.followMouse) { // follow mouse
      var t = {
        location: new exports.Vector(exports.mouse.loc.x, exports.mouse.loc.y)
      };
      this.applyForce(this.seek(t));
    }

    if (this.seekTarget) { // seek target
      this.applyForce(this.seek(this.seekTarget));
    }

    if (this.flowField) { // follow flow field
      var res = this.flowField.resolution,
        col = Math.floor(this.location.x/res),
        row = Math.floor(this.location.y/res),
        loc, target;

      if (this.flowField.field[col]) {
        loc = this.flowField.field[col][row];
        if (loc) { // !! sometimes loc is not available for edge cases; need to fix
          target = {
            location: new exports.Vector(loc.x, loc.y)
          };
        } else {
          target = {
            location: new exports.Vector(this.location.x, this.location.y)
          };
        }
        this.applyForce(this.follow(target));
      }

    }

    if (this.flocking) {
      this.flock(elements);
    }

    // end -- APPLY FORCES

    this.velocity.add(this.acceleration); // add acceleration

    if (this.maxSpeed) {
      this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
    }

    if (this.minSpeed) {
      this.velocity.limitLow(this.minSpeed); // check if velocity < minSpeed
    }

    this.location.add(this.velocity); // add velocity

    if (this.pointToDirection) { // object rotates toward direction
      if (this.velocity.mag() > 0.1) {
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
    }

    if (this.controlCamera) { // check camera after velocity calculation
      this.checkCameraEdges();
    }

    if (this.checkEdges || this.wrapEdges) {
      this.checkWorldEdges(world);
    }


    if (this.parent) { // parenting

        if (this.offsetDistance) {

          r = this.offsetDistance; // use angle to calculate x, y
          theta = exports.Utils.degreesToRadians(this.parent.angle + this.offsetAngle);
          x = r * Math.cos(theta);
          y = r * Math.sin(theta);

          this.location.x = this.parent.location.x;
          this.location.y = this.parent.location.y;
          this.location.add(new exports.Vector(x, y)); // position the sensor

        } else {
          this.location = this.parent.location;
        }

    }

    //

    if (this.afterStep) {
      this.afterStep.apply(this);
    }

    this.acceleration.mult(0); // reset acceleration

    if (this.lifespan > 0) {
      this.lifespan -= 1;
    }
  }
};

/**
 * Applies a force to this object's acceleration.
 *
 * @param {Object} force The force to be applied (expressed as a vector).
 */
Agent.prototype.applyForce = function(force) {

  'use strict';

  // F = M * A
  var f = force.clone(); // make a copy of the force so the original force vector is not altered by dividing by mass; could also use static method

  f.div(this.mass);
  this.acceleration.add(f);
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @param {boolean} arrive Set to true to for this object to arrive and stop at the target.
 * @returns {Object} The force to apply.
 */
Agent.prototype.seek = function(target, arrive) {

  'use strict';

  var world = this.world,
    desiredVelocity = exports.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.width/2) {
    var m = exports.Utils.map(distanceToTarget, 0, world.width/2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  var steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
  steer.limit(this.maxSteeringForce);
  return steer;
};

/**
 * Calculates a steering force to apply to an object following another object.
 *
 * @param {Object} target The object to follow.
 * @returns {Object} The force to apply.
 */
Agent.prototype.follow = function(target) {

  'use strict';

  var desiredVelocity = target.location.clone();

  desiredVelocity.mult(this.maxSpeed);

  var steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
  steer.limit(this.maxSteeringForce);
  return steer;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 */
Agent.prototype.flock = function(elements) {

  'use strict';

  this.applyForce(this.separate(elements).mult(this.separateStrength));
  this.applyForce(this.align(elements).mult(this.alignStrength));
  this.applyForce(this.cohesion(elements).mult(this.cohesionStrength));
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to avoid all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.separate = function(elements) {

  'use strict';

  var i, max, element, diff, d,
  sum = new exports.Vector(),
  count = 0, steer;

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
    steer = exports.Vector.VectorSub(sum, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
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

  'use strict';

  var i, max, element, diff, d,
    sum = new exports.Vector(),
    neighbordist = this.width * 2,
    count = 0, steer;

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
    steer = exports.Vector.VectorSub(sum, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
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

  'use strict';

  var i, max, element, diff, d,
    sum = new exports.Vector(),
    neighbordist = 10,
    count = 0, desiredVelocity, steer;

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
    desiredVelocity = exports.Vector.VectorSub(sum, this.location);
    desiredVelocity.normalize();
    desiredVelocity.mult(this.maxSpeed);
    steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return new exports.Vector();
};

/**
 * Calculates a force to apply to flee a target. The force is the inverse
 * of the object's maximum speed.
 *
 * @param {Object} target The object to flee from.
 * @returns {Object} A force to apply.
 */
Agent.prototype.flee = function(target) {

  'use strict';

  var desiredVelocity = exports.Vector.VectorSub(target.location, this.location); // find vector pointing at target

  desiredVelocity.normalize(); // reduce to 1
  desiredVelocity.mult(-this.maxSpeed); // multiply by maxSpeed in opposite direction

  return desiredVelocity;
};

/**
 * Calculates a force to apply to simulate drag on an object.
 *
 * @param {Object} target The object that is applying the drag force.
 * @returns {Object} A force to apply.
 */
Agent.prototype.drag = function(target) {

  'use strict';

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
Agent.prototype.attract = function(attractor) {

  'use strict';

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
Agent.prototype.isInside = function(container) {

  'use strict';

  if (container) {
    if (this.location.x + this.width/2 > container.location.x - container.width/2 &&
      this.location.x - this.width/2 < container.location.x + container.width/2 &&
      this.location.y + this.height/2 > container.location.y - container.height/2 &&
      this.location.y - this.height/2 < container.location.y + container.height/2) {
      return true;
    }
  }
  return false;
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @param {Object} world The world object.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.checkWorldEdges = function(world) {

  'use strict';

  var x = this.location.x,
    y = this.location.y,
    velocity = this.velocity,
    desiredVelocity,
    steer,
    maxSpeed,
    check = false,
    adjusted_loc,
    diff;

  // transform origin is at the center of the object

  if (this.wrapEdges) {
    if (this.location.x > world.width) {
      this.location = new exports.Vector(0, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
      check = true;
    } else if (this.location.x < 0) {
      this.location = new exports.Vector(world.width, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0);
      check = true;
    }
  } else {
    if (this.avoidEdges) {
      if (this.location.x < this.avoidEdgesStrength) {
        maxSpeed = this.maxSpeed;
      } else if (this.location.x > exports.world.width - this.avoidEdgesStrength) {
        maxSpeed = -this.maxSpeed;
      }
      if (maxSpeed) {
        desiredVelocity = new exports.Vector(maxSpeed, this.velocity.y),
        steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }
    }
    if (this.location.x + this.width/2 > world.width) {
      this.location = new exports.Vector(world.width - this.width/2, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
      this.velocity.x *= -1 * this.bounciness;
      check = true;
     } else if (this.location.x < this.width/2) {
      this.location = new exports.Vector(this.width/2, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0);
      this.velocity.x *= -1 * this.bounciness;
      check = true;
    }
  }

  ////

  maxSpeed = null;
  if (this.wrapEdges) {
    if (this.location.y > world.height) {
      this.location = new exports.Vector(this.location.x, 0);
      diff = new exports.Vector(0, y - this.location.y);
      check = true;
    } else if (this.location.y < 0) {
      this.location = new exports.Vector(this.location.x, world.height);
      diff = new exports.Vector(0, y - this.location.y);
      check = true;
    }
  } else {
    if (this.avoidEdges) {
      if (this.location.y < this.avoidEdgesStrength) {
        maxSpeed = this.maxSpeed;
      } else if (this.location.y > exports.world.height - this.avoidEdgesStrength) {
        maxSpeed = -this.maxSpeed;
      }
      if (maxSpeed) {
        desiredVelocity = new exports.Vector(this.velocity.x, maxSpeed),
        steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }
    }
    if (this.location.y + this.height/2 > world.height) {
      this.location = new exports.Vector(this.location.x, world.height - this.height/2);
      diff = new exports.Vector(0, y - this.location.y);
      this.velocity.y *= -1 * this.bounciness;
      check = true;
      } else if (this.location.y < this.height/2) {
      this.location = new exports.Vector(this.location.x, this.height/2);
      diff = new exports.Vector(0, y - this.location.y);
      this.velocity.y *= -1 * this.bounciness;
      check = true;
    }
  }

  if (check && this.controlCamera) {
    world.location.add(diff); // !! do we need this? // add the distance difference to World.location
  }
  return check;
};

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 *
 * @param {Object} world The world object.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.checkCameraEdges = function() {

  'use strict';

  var vel = this.velocity.clone();

  this.world.location.add(vel.mult(-1));
};

/**
 * Returns this object's location.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getLocation = function (type) {

  'use strict';

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

  'use strict';

  if (!type) {
    return new exports.Vector(this.velocity.x, this.velocity.y);
  } else if (type === "x") {
    return this.velocity.x;
  } else if (type === "y") {
    return this.velocity.y;
  }
};

exports.Agent = Agent;
/*global exports */
/**
 * Creates a new Walker.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Walker options.
 * @param {string} [opt_options.className = 'walker'] The corresponding DOM element's class name.
 * @param {boolean} [opt_options.isPerlin = true] If set to true, object will use Perlin Noise to calculate its location.
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and isPerlin = true, object will avoid world edges.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {boolean} [opt_options.isRandom = false] Set to true for walker to move in a random direction.
 * @param {number} [opt_options.randomRadius = 100] If isRandom = true, walker will look for a new location each frame based on this radius.
 * @param {boolean} [opt_options.isHarmonic = false] If set to true, walker will move using harmonic motion.
 * @param {Object} [opt_options.isHarmonic = {x: 6, y: 6}] If isHarmonic = true, sets the motion's amplitude.
 * @param {Object} [opt_options.harmonicPeriod = {x: 150, y: 150}] If isHarmonic = true, sets the motion's period.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.maxSpeed = 30] Maximum speed
 * @param {boolean} [opt_options.wrapEdges = false] Set to true to set the object's location to the opposite side of the world if the object moves outside the world's bounds.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 */
function Walker(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.isPerlin = options.isPerlin === false ? false : options.isPerlin || true;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.perlinSpeed = options.perlinSpeed || 0.005;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow || -0.075;
  this.perlinAccelHigh = options.perlinAccelHigh || 0.075;
  this.offsetX = options.offsetX || Math.random() * 10000;
  this.offsetY = options.offsetY || Math.random() * 10000;
  this.isRandom = !!options.isRandom;
  this.randomRadius = options.randomRadius || 100;
  this.isHarmonic = !!options.isHarmonic;
  this.harmonicAmplitude = options.harmonicAmplitude || new exports.Vector(4, 0);
  this.harmonicPeriod = options.harmonicPeriod || new exports.Vector(300, 1);
  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.maxSpeed = options.maxSpeed === 0 ? 0 : options.maxSpeed || 30;
  this.wrapEdges = !!options.wrapEdges;
  this.isStatic = !!options.isStatic;
}
exports.Utils.extend(Walker, exports.Agent);

Walker.prototype.name = 'Walker';

/**
 * Called every frame, step() updates the instance's properties.
 */
Walker.prototype.step = function () {

  'use strict';

  var world = this.world,
      friction;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    if (this.isPerlin) {

      this.perlinTime += this.perlinSpeed;

      if (this.remainsOnScreen) {
        this.acceleration = new exports.Vector();
        this.velocity = new exports.Vector.create();
        this.location.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, 0, exports.world.width);
        this.location.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, 0, exports.world.height);
      } else {
        this.acceleration.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
        this.acceleration.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      }

    } else {

      // start -- APPLY FORCES

      if (world.c) { // friction
        friction = exports.Utils.clone(this.velocity);
        friction.mult(-1);
        friction.normalize();
        friction.mult(world.c);
        this.applyForce(friction);
      }

      this.applyForce(world.wind); // wind
      this.applyForce(world.gravity); // gravity
    }

    if (this.isHarmonic) {
      this.velocity.x = this.harmonicAmplitude.x * Math.cos((Math.PI * 2) * exports.world.clock / this.harmonicPeriod.x);
      this.velocity.y = this.harmonicAmplitude.y * Math.cos((Math.PI * 2) * exports.world.clock / this.harmonicPeriod.y);
    }

    if (this.isRandom) {
      this.target = { // find a random point and steer toward it
        location: exports.Vector.VectorAdd(this.location, new exports.Vector(exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius), exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
      };
    }

    if (this.seekTarget) { // follow seek target
      this.applyForce(this.seek(this.seekTarget));
    }

    // end -- APPLY FORCES

    this.velocity.add(this.acceleration); // add acceleration

    if (this.maxSpeed) {
      this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
    }

    this.location.add(this.velocity); // add velocity

    if (this.pointToDirection) { // object rotates toward direction
      if (this.velocity.mag() > 0.1) { // rotate toward direction?
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
    }

    if (this.controlCamera) { // check camera after velocity calculation
      this.checkCameraEdges();
    }

    if (this.checkEdges || this.wrapEdges) {
      this.checkWorldEdges(world);
    }

    if (this.lifespan > 0) {
      this.lifespan -= 1;
    }

    if (this.afterStep) {
      this.afterStep.apply(this);
    }

    this.acceleration.mult(0); // reset acceleration
  }
};
exports.Walker = Walker;
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
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {Object} [opt_options.amplitude = {x: 4, y: 0}] Sets amplitude, the distance from the object's
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
 */
function Oscillator(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.initialLocation = options.initialLocation ||
      new exports.Vector(this.world.width/2, this.world.height/2);
  this.lastLocation = new exports.Vector(0, 0);
  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.amplitude = options.amplitude || new exports.Vector(this.world.width/2 - this.width, this.world.height/2 - this.height);
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
}
exports.Utils.extend(Oscillator, exports.Agent);

Oscillator.prototype.name = 'Oscillator';

/**
 * Updates the oscillator's properties.
 */
Oscillator.prototype.step = function () {

  'use strict';

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
      this.checkCameraEdges();
    }

    if (this.checkEdges || this.wrapEdges) {
      this.checkWorldEdges(world);
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
 * Creates a new Particle.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Particle options.
 * @param {number} [opt_options.lifespan = 40] The number of frames before particle dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {string} [opt_options.borderRadius = '100%'] The particle's border radius.
 */
function Particle(opt_options) {

'use strict';

var options = opt_options || {};

exports.Agent.call(this, options);

this.lifespan = options.lifespan || 40;
this.borderRadius = options.borderRadius || '100%';
}
exports.Utils.extend(Particle, exports.Agent);

Particle.prototype.name = 'Particle';

/**
 * Updates particle properties.
 */
Particle.prototype.step = function () {

  'use strict';

	var world = this.world,
			friction;

	//

	if (this.beforeStep) {
		this.beforeStep.apply(this);
	}

	//

	if (!this.isStatic && !this.isPressed) {

		// start -- APPLY FORCES

		if (world.c) { // friction
			friction = exports.Utils.clone(this.velocity);
			friction.mult(-1);
			friction.normalize();
			friction.mult(world.c);
			this.applyForce(friction);
		}

		this.applyForce(world.wind); // wind
		this.applyForce(world.gravity); // gravity


		if (this.checkEdges || this.wrapEdges) {
			this.checkWorldEdges(world);
		}

		// end -- APPLY FORCES

		this.velocity.add(this.acceleration); // add acceleration

		if (this.maxSpeed) {
			this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
		}

		this.location.add(this.velocity); // add velocity

		// opacity
		this.opacity = exports.Utils.map(this.lifespan, 0, this.maxSpeed, 0, 1);

		if (this.afterStep) {
			this.afterStep.apply(this);
		}

		if (this.lifespan > 0) {
			this.lifespan -= 1;
		} else if (this.lifespan === 0) {
			exports.elementList.destroyElement(this.id);
		}
		this.acceleration.mult(0); // reset acceleration
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
 * @param {Object} [opt_options] Particle options.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move.
 * @param {number} [opt_options.lifespan = -1] The number of frames before particle system dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {number} [opt_options.burst = 1] The number of particles to create per burst.
 * @param {number} [opt_options.burstRate = 1] The number of frames between bursts. Lower values = more particles.
 * @param {Object} [opt_options.particle = A particle at the system's location w random acceleration.] The particle to create. At minimum, should have a location vector. Use this.getLocation to get location of partilce system.
 */
 function ParticleSystem(opt_options) {

  'use strict';

  var options = opt_options || {},
      c = exports.defaultColors.getColor('heat'), // gets the heat start and end colors
      f = exports.defaultColors.getColor('food'), // gets the food start and end colors
      pl = new exports.ColorPalette();

  exports.Agent.call(this, options);

  pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: c.startColor,
    endColor: c.endColor
  }).addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: f.startColor,
    endColor: f.endColor
  });

  this.beforeStep = function () {

    var i, max, p;

    if (this.world.clock % this.burstRate === 0) {
      for (i = 0; i < this.burst; i += 1) {
        p = new exports.Particle(this.particle());
      }
    }
    if (this.lifespan > 0) {
      this.lifespan -= 1;
    } else if (this.lifespan === 0) {
      exports.elementList.destroyElement(this.id);
    }
  };
  this.lifespan = options.lifespan || -1;
  this.width = options.width === 0 ? 0 : options.width || 0;
  this.height = options.height === 0 ? 0 : options.height || 0;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.burst = options.burst === 0 ? 0 : options.burst || 1;
  this.burstRate = options.burstRate === 0 ? 0 : options.burstRate || 3;
  this.particle = options.particle || function() {

    var borderStyles = exports.config.borderStyles,
        borderStr = borderStyles[exports.Utils.getRandomNumber(0, borderStyles.length - 1)];

    return {
      color: pl.getColor(),
      borderWidth: exports.Utils.getRandomNumber(2, 12),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + exports.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')',
      zIndex: exports.Utils.getRandomNumber(1, 100),
      location: this.getLocation(),
      acceleration: new exports.Vector(exports.Utils.getRandomNumber(-4, 4), exports.Utils.getRandomNumber(-4, 4))
    };
  };
}
exports.Utils.extend(ParticleSystem, exports.Agent);

ParticleSystem.prototype.name = 'ParticleSystem';

exports.ParticleSystem = ParticleSystem;
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
 */
function Liquid(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.c = options.c === 0 ? 0 : options.c || 1;
  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Liquid, exports.Agent);

Liquid.prototype.name = 'Liquid';

exports.Liquid = Liquid;
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
 */
function Attractor(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || 10;
  this.mass = options.mass === 0 ? 0 : options.mass || 100;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
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
 * @param {number} [opt_options.G = -10] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Repeller(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.G = options.G === 0 ? 0 : options.G || -10;
  this.mass = options.mass === 0 ? 0 : options.mass || 100;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 100;
  this.height = options.height === 0 ? 0 : options.height || 100;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Repeller, exports.Agent);

Repeller.prototype.name = 'Repeller';

exports.Repeller = Repeller;
/*global exports */
/**
 * Creates a new Heat object.
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
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Heat(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Heat, exports.Agent);

Heat.prototype.name = 'Heat';

exports.Heat = Heat;
/*global exports */
/**
 * Creates a new Cold object.
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
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Cold(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Cold, exports.Agent);

Cold.prototype.name = 'Cold';

exports.Cold = Cold;
/*global exports */
/**
 * Creates a new Light object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.85] Opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Light(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.85;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Light, exports.Agent);

Light.prototype.name = 'Light';

exports.Light = Light;
/*global exports */
/**
 * Creates a new Oxygen object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Oxygen(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Oxygen, exports.Agent);

Oxygen.prototype.name = 'Oxygen';

exports.Oxygen = Oxygen;
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
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Food(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 50;
  this.height = options.height === 0 ? 0 : options.height || 50;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Food, exports.Agent);

Food.prototype.name = 'Food';

exports.Food = Food;
/*global exports */
/**
 * Creates a new Predator object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 75] Width.
 * @param {number} [opt_options.height = 75] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 */
function Predator(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.mass = options.mass === 0 ? 0 : options.mass || 50;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.width = options.width === 0 ? 0 : options.width || 75;
  this.height = options.height === 0 ? 0 : options.height || 75;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 10;
}
exports.Utils.extend(Predator, exports.Agent);

Predator.prototype.name = 'Predator';

exports.Predator = Predator;
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
 */
function Sensor(opt_options) {

  'use strict';

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
}
exports.Utils.extend(Sensor, exports.Agent);

Sensor.prototype.name = 'Sensor';

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  'use strict';

  var check = false, maxSpeed = 10, i, max;

  if (this.type === "heat" && exports.heats.length > 0) {
    for (i = 0, max = exports.heats.length; i < max; i += 1) { // heat
      if (this.isInside(this, exports.heats[i], this.sensitivity)) {
        this.target = exports.heats[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;

      }
    }
  } else if (this.type === "cold" && exports.colds.length > 0) {
    for (i = 0, max = exports.colds.length; i < max; i += 1) { // cold
      if (this.isInside(this, exports.colds[i], this.sensitivity)) {
        this.target = exports.colds[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "predator" && exports.predators.length > 0) {
    for (i = 0, max = exports.predators.length; i < max; i += 1) { // predator
      if (this.isInside(this, exports.predators[i], this.sensitivity)) {
        this.target = exports.predators[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "light" && exports.lights.length > 0) {
    for (i = 0, max = exports.lights.length; i < max; i += 1) { // light
      if (this.isInside(this, exports.lights[i], this.sensitivity)) {
        this.target = exports.lights[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "oxygen" && exports.oxygen.length > 0) {
    for (i = 0, max = exports.oxygen.length; i < max; i += 1) { // oxygen
      if (this.isInside(this, exports.oxygen[i], this.sensitivity)) {
        this.target = exports.oxygen[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
      }
    }
  } else if (this.type === "food" && exports.food.length > 0) {
    for (i = 0, max = exports.food.length; i < max; i += 1) { // food
      if (this.isInside(this, exports.food[i], this.sensitivity)) {
        this.target = exports.food[i]; // target this stimulator
        this.activated = true; // set activation
        check = true;
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
 * Returns the force to apply the vehicle when its sensor is activated.
 *
 * @param {Object} params A list of properties.
 * @param {Object} params.agent The vehicle carrying the sensor.
 */
Sensor.prototype.getActivationForce = function(params) {

  'use strict';

  var distanceToTarget, m, steer;

  switch (this.behavior) {

    /**
     * Steers toward target
     */
    case "AGGRESSIVE":
      return this.seek(this.target);
    /**
     * Steers away from the target
     */
    case "COWARD":
      var forceCoward = this.seek(this.target);
      return forceCoward.mult(-1);
    /**
     * Speeds toward target and keeps moving
     */
    case "LIKES":
      var dvLikes = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvLikes.mag();
      dvLikes.normalize();

      m = distanceToTarget/params.agent.maxSpeed;
      dvLikes.mult(m);

      steer = exports.Vector.VectorSub(dvLikes, params.agent.velocity);
      steer.limit(params.agent.maxSteeringForce * 0.01);
      return steer;
    /**
     * Arrives at target and remains
     */
    case "LOVES":
      var dvLoves = exports.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();

      if (distanceToTarget > this.width) {
        m = distanceToTarget/params.agent.maxSpeed;
        dvLoves.mult(m);
        steer = exports.Vector.VectorSub(dvLoves, params.agent.velocity);
        steer.limit(params.agent.maxSteeringForce);
        return steer;
      }
      params.agent.velocity = new exports.Vector();
      params.agent.acceleration = new exports.Vector();
      return new exports.Vector();
    /**
     * Arrives at target but does not stop
     */
    case "EXPLORER":

      var dvExplorer = exports.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();

      m = distanceToTarget/params.agent.maxSpeed;
      dvExplorer.mult(-m);

      steer = exports.Vector.VectorSub(dvExplorer, params.agent.velocity);
      steer.limit(params.agent.maxSteeringForce * 0.01);
      return steer;
    /**
     * Moves in the opposite direction as fast as possible
     */
    case "RUN":
      return this.flee(this.target);

    case "ACCELERATE":
      var forceAccel = params.agent.velocity.clone();
      forceAccel.normalize(); // get direction
      return forceAccel.mult(params.agent.minSpeed);

    case "DECELERATE":
      var forceDecel = params.agent.velocity.clone();
      forceDecel.normalize(); // get direction
      return forceDecel.mult(-params.agent.minSpeed);

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

  'use strict';

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

  'use strict';

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
    el.className = "flowFieldMarker floraElement";
    nose.className = "nose";
    el.appendChild(nose);

    el.style.cssText = exports.Utils.getCSSText({
      x: options.location.x - options.width/2,
      y: options.location.y - options.height/2,
      s: options.scale,
      a: options.angle,
      o: options.opacity,
      w: options.width,
      h: options.height,
      cm: options.colorMode,
      color: options.color,
      z: options.zIndex,
      borderWidth: options.borderWidth,
      borderStyle: options.borderStyle,
      borderColor: options.borderColor,
      borderRadius: options.borderRadius,
      boxShadow: options.boxShadow
    });

    return el;
  }
}

FlowFieldMarker.prototype.name = 'FlowFieldMarker';

exports.FlowFieldMarker = FlowFieldMarker;
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

  'use strict';

  var options = opt_options || {};

  this.resolution = options.resolution || 50;
  this.perlinSpeed = options.perlinSpeed || 0.01;
  this.perlinTime = options.perlinTime || 100;
  this.field = options.field || null;
  this.createMarkers = options.createMarkers || false;
  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
}

FlowField.prototype.name = 'FlowField';

/**
 * Builds a FlowField.
 */
FlowField.prototype.build = function() {

  'use strict';

  var i, max, col, colMax, row, rowMax, x, y, theta, fieldX, fieldY, field, angle,
      vectorList = {},
      world = this.world,
      cols = Math.ceil(world.width/parseFloat(this.resolution)),
      rows = Math.ceil(world.height/parseFloat(this.resolution)),
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
/*global exports */
/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Agent
 * @param {Object} parentA The object that starts the connection.
 * @param {Object} parentB The object that ends the connection.
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 */
function Connector(parentA, parentB, opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  if (!parentA || !parentB) {
    throw new Error('Connector: both parentA and parentB are required.');
  }
  this.parentA = parentA;
  this.parentB = parentB;
  this.width = 0;
  this.height = 0;
  this.color = 'transparent';

  this.opacity = options.opacity === 0 ? 0 : options.opacity || 1;
  this.zIndex = options.zIndex || 0;

}
exports.Utils.extend(Connector, exports.Agent);

Connector.prototype.name = 'Connector';

/**
 * Called every frame, step() updates the instance's properties.
 */
Connector.prototype.step = function() {

  'use strict';

  var a = this.parentA.location,
      b = this.parentB.location;

  this.width = Math.floor(exports.Vector.VectorSub(this.parentA.location, this.parentB.location).mag());
  this.location = exports.Vector.VectorAdd(this.parentA.location, this.parentB.location).div(2); // midpoint = (v1 + v2)/2
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
 */
function Point(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Agent.call(this, options);

  this.width = options.width === 0 ? 0 : options.width || 10;
  this.height = options.height === 0 ? 0 : options.height || 10;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.5;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 0;
  this.offsetAngle = options.offsetAngle || 0;
  this.length = options.length === 0 ? 0 : options.length|| 30;
}
exports.Utils.extend(Point, exports.Agent);

Point.prototype.name = 'Point';

exports.Point = Point;
/*global exports */
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

  'use strict';

  var options = opt_options || {};

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
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
  this._el = document.createElement('div');
  this._el.id = 'caption';
  this._el.className = 'caption ' + this.position;
  this._el.style.opacity = this.opacity;
  this._el.style.color = this.colorMode + '(' + this.color[0] + ', ' + this.color[1] +
        ', ' + this.color[2] + ')';
  this._el.style.borderWidth = this.borderWidth;
  this._el.style.borderStyle = this.borderStyle;
  if (typeof this.borderColor === 'string') {
    this._el.style.borderColor = this.borderColor;
  } else {
    this._el.style.borderColor = this.colorMode + '(' + this.borderColor[0] + ', ' + this.borderColor[1] +
        ', ' + this.borderColor[2] + ')';
  }
  this._el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('caption')) {
    document.getElementById('caption').parentNode.removeChild(document.getElementById('caption'));
  }
  this.world.el.appendChild(this._el);
}

Caption.prototype.name = 'Caption';

/**
 * Removes the caption's DOM element.
 */
Caption.prototype.destroy = function() {

  'use strict';

  this._el.parentNode.removeChild(this._el);
};

exports.Caption = Caption;
/*global exports */
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

  'use strict';

  var me = this, options = opt_options || {};

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  this.position = options.position || 'top left';
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || '1px';
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = options.colorMode || 'rgb';

  if (exports.System.supportedFeatures.touch) {
    this.text =  exports.config.touchMap.stats + '-finger tap = stats | ' +
        exports.config.touchMap.pause + '-finger tap = pause | ' +
        exports.config.touchMap.reset + '-finger tap = reset';
  } else {
    this.text = '\'' + String.fromCharCode(exports.config.keyMap.pause).toLowerCase() + '\' = pause | ' +
      '\'' + String.fromCharCode(exports.config.keyMap.reset).toLowerCase() + '\' = reset | ' +
      '\'' + String.fromCharCode(exports.config.keyMap.stats).toLowerCase() + '\' = stats';
  }

  /**
   * Holds a reference to the caption's DOM elements.
   * @private
   */
  this._el = document.createElement('div');
  this._el.id = 'inputMenu';
  this._el.className = 'inputMenu ' + this.position;
  this._el.style.opacity = this.opacity;
  this._el.style.color = this.colorMode + '(' + this.color[0] + ', ' + this.color[1] +
        ', ' + this.color[2] + ')';
  this._el.style.borderWidth = this.borderWidth;
  this._el.style.borderStyle = this.borderStyle;
  if (typeof this.borderColor === 'string') {
    this._el.style.borderColor = this.borderColor;
  } else {
    this._el.style.borderColor = this.colorMode + '(' + this.borderColor[0] + ', ' + this.borderColor[1] +
        ', ' + this.borderColor[2] + ')';
  }
  this._el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('inputMenu')) {
    document.getElementById('inputMenu').parentNode.removeChild(document.getElementById('inputMenu'));
  }

  if (exports.System.supportedFeatures.touch) {
    exports.Utils.addEvent(this._el, 'touchstart', function(e) {
      me.destroy();
    });
  } else {
    exports.Utils.addEvent(this._el, 'mouseup', function(e) {
      me.destroy();
    });
  }

  this.world.el.appendChild(this._el);
}

InputMenu.prototype.name = 'InputMenu';

/**
 * Removes the menu's DOM element.
 */
InputMenu.prototype.destroy = function() {

  'use strict';

  this._el.parentNode.removeChild(this._el);
};

exports.InputMenu = InputMenu;
/*global exports */
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

  'use strict';

  var labelContainer, label;

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
  this._update();
}

/**
 * Returns the current frames per second value.
 * @returns {number} Frame per second.
 */
StatsDisplay.prototype.getFPS = function() {

  'use strict';

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
StatsDisplay.prototype._update = function() {

  'use strict';

  var elementCount = exports.elementList.count();

  if (Date.now) {
    this._time = Date.now();
  } else {
    this._time = 0;
  }
  this._frameCount++;

  // at least a second has passed
  if (this._time > this._timeLastSecond + 1000) {

    this._fps = this._frameCount;
    this._timeLastSecond = this._time;
    this._frameCount = 0;

    this._fpsValue.nodeValue = this._fps;
    this._totalElementsValue.nodeValue = elementCount;
  }
  window.requestAnimFrame(this._update.bind(this));
};

StatsDisplay.prototype.name = 'StatsDisplay';

exports.StatsDisplay = StatsDisplay;
/*global exports */
/**
 * Creates a new FeatureDetector.
 *
 * @constructor
 */
function FeatureDetector(options) {
  'use strict';
}

FeatureDetector.prototype.name = 'FeatureDetector';

/**
 * Checks if the class has a method to detect the passed feature.
 * If so, it calls the method.
 *
 * @param {string} feature The feature to check.
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.prototype.detect = function(feature) {

  'use strict';

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
FeatureDetector.prototype.csstransforms = function() {

  'use strict';

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
FeatureDetector.prototype.csstransforms3d = function() {

  'use strict';

  var transforms = [
    '-webkit-transform: translateX(1px) translateY(1px) translateZ(0)',
    '-moz-transform: translateX(1px) translateY(1px) translateZ(0)',
    '-o-transform: translateX(1px) translateY(1px) translateZ(0)',
    '-ms-transform: translateX(1px) translateY(1px) translateZ(0)'
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
FeatureDetector.prototype.touch = function() {

  'use strict';

  var el = document.createElement('div');
  el.setAttribute('ongesturestart', 'return;');
  if (typeof el.ongesturestart === "function") {
    return true;
  }
  return false;
};

exports.FeatureDetector = FeatureDetector;
}(exports));
