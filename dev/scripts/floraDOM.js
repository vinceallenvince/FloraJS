/*
FloraJS | DOM Renderer
Copyright (c) 2012 Vince Allen
Brooklyn, NY 11215, USA
email: vince@vinceallen.com
web: http://www.vinceallen.com

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
/* Version: 0.0.8 */
/* Build time: December 2, 2012 07:01:58 */
/** @namespace */
var Flora = {}, exports = Flora;

(function(exports) {
/*global window */
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
 */
function ElementList() {

  'use strict';

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
 * Returns an array of elements with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' property must equal 'val'.
 * @returns {Array} An array of elements.
 */
ElementList.prototype.getAllByAttribute = function(attr, opt_val) {

  'use strict';

  var i, max, arr = [], val = opt_val !== undefined ? opt_val : null;

  for (i = 0, max = this._records.length; i < max; i++) {
    if (this._records[i][attr] !== undefined) {
      if (val !== null && this._records[i][attr] !== val) {
        continue;
      }
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

    var i, universe = exports.universe,
        elements = exports.elementList.all();

    if (universe.isPlaying) {
      window.requestAnimFrame(exports.animLoop);

      if (universe.zSorted) {
        elements = elements.sort(function(a,b){return (b.zIndex - a.zIndex);});
      }

      /*
       * Using two loops here because it's faster and frame rate
       * is more consistent if all properties are updated in one loop,
       * and all DOM updates are done in a separate loop.
       */

      // update elements' properties
      for (i = elements.length - 1; i >= 0; i -= 1) {
        elements[i].step();
      }

      // updated elements' DOM element
      for (i = elements.length - 1; i >= 0; i -= 1) {
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

  var positionStr = '',
      width = typeof props.w === 'number' ? props.w + 'px' : props.w,
      height = typeof props.h === 'number' ? props.h + 'px' : props.h;

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
      '-webkit-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
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
    'width: ' + width,
    'height: ' + height,
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
  'use strict';
  this.x = opt_x || 0;
  this.y = opt_y || 0;
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
  this.x /= n;
  this.y /= n;
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
function BorderPalette(opt_id) {

  'use strict';

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
/*global exports, document, window */
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

  var me = this,
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
/*global exports, document, window */
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

  exports.Utils.addEvent(window, 'resize', function() { // listens for window resize
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
/*global exports, document, clearInterval, setInterval */
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
      world, constructorName = this.name || 'anon',
      viewArgs = options.viewArgs || [];

  this.id = options.id || constructorName.toLowerCase() + "-" + Element._idCount; // if no id, create one

  if (options.view && exports.Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
    this.el = options.view.apply(this, viewArgs);
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

  // Vector caches
  this.zeroForceVector = new exports.Vector(); // use when returning {x: 0, y: 0}
  this.applyForceVector = new exports.Vector(); // used in Agent.applyForce()
  this.followDesiredVelocity = new exports.Vector(); // used in Agent.follow()
  this.followTargetVector = new exports.Vector(); // used in Agent.step()
  this.separateSumForceVector = new exports.Vector(); // used in Agent.separate()
  this.alignSumForceVector = new exports.Vector(); // used in Agent.align()
  this.cohesionSumForceVector = new exports.Vector(); // used in Agent.cohesion()
  this.checkCameraEdgesVector = new exports.Vector(); // used in Agent.checkCameraEdges()
  this.cameraDiffVector = new exports.Vector(); // used in Agent.checkWorldEdges()

    // set sensors
  this.sensors = options.sensors || [];

  this.className = options.className || constructorName.toLowerCase();
  this.className += ' floraElement';

  elements[elements.length] = this; // push new instance of Element

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
 * @private
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
 * @param {Object} obj The object associated with the event target.
 */
Element.mouseover = function(e, obj) {

  'use strict';

  obj.isMouseOut = false;
  clearInterval(obj.mouseOutInterval);
};

/**
 * Called by a mousedown event listener.
 *
 * @param {Object} e The event object passed by the listener.
 * @param {Object} obj The object associated with the event target.
 */
Element.mousedown = function(e, obj) {

  'use strict';

  var target = e.target;

  obj.isPressed = true;
  obj.isMouseOut = false;
  obj.offsetX = e.pageX - target.offsetLeft;
  obj.offsetY = e.pageY - target.offsetTop;
};

/**
 * Called by a mousemove event listener.
 *
 * @param {Object} e The event object passed by the listener.
 * @param {Object} obj The object associated with the event target.
 */
Element.mousemove = function(e, obj) {

  'use strict';

  var x, y;

  if (obj.isPressed) {

    obj.isMouseOut = false;

    x = e.pageX - obj.world.el.offsetLeft;
    y = e.pageY - obj.world.el.offsetTop;

    if (Element.mouseIsInsideWorld(obj.world)) {
      obj.location = new exports.Vector(x, y);
    } else {
      obj.isPressed = false;
    }
  }
};

/**
 * Called by a mouseup event listener.
 *
 * @param {Object} e The event object passed by the listener.
 * @param {Object} obj The object associated with the event target.
 */
Element.mouseup = function(e, obj) {

  'use strict';

  obj.isPressed = false;
};

/**
 * Called by a mouseout event listener.
 *
 * @param {Object} e The event object passed by the listener.
 * @param {Object} obj The object associated with the event target.
 */
Element.mouseout = function(e, obj) {

  'use strict';

  var me = obj,
    x, y;

  if (obj.isPressed) {

    obj.isMouseOut = true;

    obj.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

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

  var width = typeof this.width === 'number' ? this.width : this.el.offsetWidth, // !! no
      height = typeof this.height === 'number' ? this.height : this.el.offsetHeight; // !! no

  this.el.style.cssText = exports.Utils.getCSSText({
    x: this.location.x - width/2,
    y: this.location.y - height/2,
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
    exports.Utils.addEvent(this._el, 'touchstart', function() {
      me.destroy();
    });
  } else {
    exports.Utils.addEvent(this._el, 'mouseup', function() {
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
StatsDisplay.prototype._update = function(me) {

  'use strict';

  var elementCount = exports.elementList.count();

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

  window.requestAnimFrame(reqAnimFrame);
};

StatsDisplay.prototype.name = 'StatsDisplay';

exports.StatsDisplay = StatsDisplay;
/*global exports, document */
/**
 * Creates a new FeatureDetector.
 *
 * The FeatureDetector tests for specific browser features and stores
 * results in Flora.System.supportedFeatures.
 * @example console.log(Flora.System.supportedFeatures.csstransforms3d);
 * @constructor
 */
function FeatureDetector() {
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
