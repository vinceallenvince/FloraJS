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
/* Version: 2.0.8 */
/* Build time: June 16, 2013 07:51:47 *//**
 * @namespace
 * @requires Burner
 */
var Flora = {}, exports = Flora;

(function(exports) {

'use strict';

Burner.Classes = Flora;/*global exports */
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
      name: 'cold',
      startColor: [88, 129, 135],
      endColor: [171, 244, 255],
      boxShadowColor: [132, 192, 201]
    },
    {
      name: 'food',
      startColor: [186, 255, 130],
      endColor: [84, 187, 0],
      boxShadowColor: [57, 128, 0]
    },
    {
      name: 'heat',
      startColor: [255, 132, 86],
      endColor: [175, 47, 0],
      boxShadowColor: [255, 69, 0]
    },
    {
      name: 'light',
      startColor: [255, 255, 255],
      endColor: [189, 148, 0],
      boxShadowColor: [255, 200, 0]
    },
    {
      name: 'oxygen',
      startColor: [130, 136, 255],
      endColor: [49, 56, 205],
      boxShadowColor: [60, 64, 140]
    }
  ],
  keyMap: {
    pause: 80,
    resetSystem: 82,
    stats: 83
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
/*global exports, Burner, document, window, console */
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
  subClass._superClass = superClass;
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
 * @example getWindowSize() returns {width: 1024, height: 768}
 */
Utils.getWindowSize = function() {
  var d = {
    'width' : false,
    'height' : false
  };
  if (typeof(window.innerWidth) !== 'undefined') {
    d.width = window.innerWidth;
  } else if (typeof(document.documentElement) !== 'undefined' &&
      typeof(document.documentElement.clientWidth) !== 'undefined') {
    d.width = document.documentElement.clientWidth;
  } else if (typeof(document.body) !== 'undefined') {
    d.width = document.body.clientWidth;
  }
  if (typeof(window.innerHeight) !== 'undefined') {
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== 'undefined' &&
      typeof(document.documentElement.clientHeight) !== 'undefined') {
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== 'undefined') {
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
 * Determines if one object is inside another.
 *
 * @param {Object} obj The object.
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
  var mouse = Burner.System.mouse,
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
/**
 * Creates a new BorderPalette object.
 *
 * Use this class to create a palette of border styles.
 *
 * @param {string|number} [opt_id=] An optional id. If an id is not passed, a default id is created.
 * @constructor
 */
function BorderPalette(opt_id) {

  /**
   * Holds a list of border styles.
   * @private
   */
  this._borders = [];

  this.id = opt_id || BorderPalette._idCount;
  BorderPalette._idCount++; // increment id
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
 * @param {string|number} [opt_id=] An optional id. If an id is not passed, a default id is created.
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
  ColorPalette._idCount++; // increment id
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
/*global exports, Burner, document */
/**
 * Creates a new Caption object.
 * Use captions to communicate short messages to users like a title
 * or simple instructions like 'click for more particles'.
 *
 * @constructor
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_options.world] A world.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the caption's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {string} [opt_options.text = ''] The caption's text.
 * @param {number} [opt_options.opacity = 0.75] The caption's opacity.
 * @param {Array} [opt_options.color = [255, 255, 255]] The caption's color.
 * @param {number} [opt_options.borderWidth = 1] The caption's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The caption's border style.
 * @param {Array} [opt_options.borderColor = [204, 204, 204]] The caption's border color.
 */
function Caption(opt_options) {

  var options = opt_options || {}, i, max, classNames;

  // if a world is not passed, use the first world in the system
  this.world = options.world || Burner.System.firstWorld();
  this.position = options.position || 'top left';
  this.text = options.text || '';
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = 'rgb';

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
  this.el.style.borderWidth = this.borderWidth + 'px';
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
 * A noop.
 */
Caption.prototype.reset = function () {};

/**
 * A noop.
 */
Caption.prototype.init = function () {};

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
/*global exports, Burner, document */
/**
 * Creates a new InputMenu object.
 * An Input Menu lists key strokes and other input available
 * for the user to interact with the system.
 *
 * @constructor
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_options.world] A world.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the menu's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {number} [opt_options.opacity = 0.75] The menu's opacity.
 * @param {Array} [opt_options.color = [255, 255, 255]] The menu's color.
 * @param {number} [opt_options.borderWidth = 1] The menu's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The menu's border style.
 * @param {Array} [opt_options.borderColor = [204, 204, 204]] The menu's border color.
 */
function InputMenu(opt_options) {

  var me = this, options = opt_options || {}, i, max, classNames;

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  this.position = options.position || 'top left';
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = 'rgb';

  if (Burner.System.supportedFeatures.touch) {
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
  this.el.style.borderWidth = this.borderWidth + 'px';
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

  if (Burner.System.supportedFeatures.touch) {
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
 * A noop.
 */
InputMenu.prototype.reset = function () {};

/**
 * A noop.
 */
InputMenu.prototype.init = function () {};

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
/*global exports, Burner, document, clearInterval, setInterval */
/**
 * Creates a new Mover. All Flora elements extend Mover.
 *
 * @constructor
 * @extends Burner.Item
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Mover(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Mover';
  Burner.Item.call(this, options);
}
exports.Utils.extend(Mover, Burner.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {string|Array} [opt_options.color = [255, 255, 255]] Color.
 * @param {number} [opt_options.motorSpeed = 2] Motor speed
 * @param {number} [opt_options.angle = 0] Angle
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.draggable = false] If true, object can move via drag and drop.
 * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
 * @param {boolean} [opt_options.pointToParentDirection = false] If true, object points in the direction of the parent's velocity.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
 * @param {number} [opt_options.offsetAngle = 0] The rotation around the center of the object's parent.
 * @param {function} [opt_options.beforeStep = null] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = null] A function to run after the step() function.
 */
Mover.prototype.init = function(options) {

  this.width = options.width === undefined ? 20 : options.width;
  this.height = options.height === undefined ? 20 : options.height;
  this.color = options.color || [255, 255, 255];
  this.motorSpeed = options.motorSpeed || 0;
  this.angle = options.angle || 0;
  this.pointToDirection = options.pointToDirection === undefined ? true : options.pointToDirection;
  this.draggable = !!options.draggable;
  this.parent = options.parent || null;
  this.pointToParentDirection = !!options.pointToParentDirection;
  this.offsetDistance = options.offsetDistance === undefined ? 30 : options.offsetDistance;
  this.offsetAngle = options.offsetAngle || 0;
  this.beforeStep = options.beforeStep || null;
  this.afterStep = options.afterStep || null;

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
};

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
      this.location = new Burner.Vector(x, y);
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



  var me = obj, mouse = Burner.System.mouse,
      x, y;

  if (obj.isPressed) {

    obj.isMouseOut = true;

    obj.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

      if (me.isPressed && me.isMouseOut) {

        x = mouse.location.x - me.world.el.offsetLeft;
        y = mouse.location.y - me.world.el.offsetTop;

        me.location = new Burner.Vector(x, y);
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

    this.velocity.limit(this.maxSpeed, this.minSpeed);

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

  if (this.checkWorldEdges) {
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
      this.location.add(new Burner.Vector(x, y)); // position the child

      if (this.pointToParentDirection) {
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(this.parent.velocity.y, this.parent.velocity.x));
      }

    } else {
      this.location = this.parent.location;
    }
  }

  this.acceleration.mult(0);

  if (this.life < this.lifespan) {
    this.life += 1;
  } else if (this.lifespan !== -1) {
    Burner.System.destroyItem(this);
  }

  if (this.afterStep) {
    this.afterStep.apply(this);
  }
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
    desiredVelocity = Burner.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.bounds[1] / 2) { // slow down to arrive at target
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
 * Checks if object is within range of a world edge. If so, steers the object
 * in the opposite direction.
 * @private
 */
Mover.prototype._checkAvoidEdges = function() {

  var maxSpeed, desiredVelocity;

  if (this.location.x < this.avoidWorldEdgesStrength) {
    maxSpeed = this.maxSpeed;
  } else if (this.location.x > this.world.bounds[1] - this.avoidWorldEdgesStrength) {
    maxSpeed = -this.maxSpeed;
  }
  if (maxSpeed) {
    desiredVelocity = new Burner.Vector(maxSpeed, this.velocity.y);
    desiredVelocity.sub(this.velocity);
    desiredVelocity.limit(this.maxSteeringForce);
    this.applyForce(desiredVelocity);
  }

  if (this.location.y < this.avoidWorldEdgesStrength) {
    maxSpeed = this.maxSpeed;
  } else if (this.location.y > this.world.bounds[2] - this.avoidWorldEdgesStrength) {
    maxSpeed = -this.maxSpeed;
  }
  if (maxSpeed) {
    desiredVelocity = new Burner.Vector(this.velocity.x, maxSpeed);
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

  var force = Burner.Vector.VectorSub(attractor.location, this.location),
    distance, strength;

  distance = force.mag();
  distance = exports.Utils.constrain(distance, this.width * this.height, attractor.width * attractor.height); // min = scale/8 (totally arbitrary); max = scale; the size of the attractor
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

exports.Mover = Mover;
/*global exports, Burner, document */
/**
 * Creates a new Agent.
 *
 * Agents are basic Flora elements that respond to forces like gravity, attraction,
 * repulsion, etc. They can also chase after other Agents, organize with other Agents
 * in a flocking behavior, and steer away from obstacles. They can also follow the mouse.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 * @extends Mover
 */
function Agent(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Agent';
  exports.Mover.call(this, options);
}
exports.Utils.extend(Agent, exports.Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
 * @param {number} [opt_options.maxSteeringForce = 10] Set the maximum strength of any steering force.
 * @param {Object} [opt_options.seekTarget = null] An object to seek.
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {Array} [opt_options.sensors = []] A list of sensors attached to this object.
 * @param {Array} [opt_options.color = [197, 177, 115]] Color.
 * @param {number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {number} [opt_options.borderRadius = 0] Border radius.
 */
Agent.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Agent._superClass.prototype.init.call(this, options);

  this.followMouse = !!options.followMouse;
  this.maxSteeringForce = options.maxSteeringForce === undefined ? 10 : options.maxSteeringForce;
  this.seekTarget = options.seekTarget || null;
  this.flocking = !!options.flocking;
  this.desiredSeparation = options.desiredSeparation === undefined ? this.width * 2 : options.desiredSeparation;
  this.separateStrength = options.separateStrength === undefined ? 0.3 : options.separateStrength;
  this.alignStrength = options.alignStrength === undefined ? 0.2 : options.alignStrength;
  this.cohesionStrength = options.cohesionStrength === undefined ? 0.1 : options.cohesionStrength;
  this.flowField = options.flowField || null;
  this.sensors = options.sensors || [];

  this.color = options.color || [197, 177, 115];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || this.sensors.length ? 100 : 0;

  //

  this.separateSumForceVector = new Burner.Vector(); // used in Agent.separate()
  this.alignSumForceVector = new Burner.Vector(); // used in Agent.align()
  this.cohesionSumForceVector = new Burner.Vector(); // used in Agent.cohesion()
  this.followTargetVector = new Burner.Vector(); // used in Agent.applyForces()
  this.followDesiredVelocity = new Burner.Vector(); // used in Agent.follow()
};

/**
 * Applies Agent-specific forces.
 *
 * @returns {Object} This object's acceleration vector.
 */
Agent.prototype.applyForces = function() {

  var i, max, sensorActivated, dir, sensor, r, theta, x, y,
      liquids = Burner.System._caches.Liquid,
      attractors = Burner.System._caches.Attractor,
      repellers = Burner.System._caches.Repeller,
      heat = Burner.System._caches.Heat;

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

  if (repellers && repellers.list.length > 0) { // repeller
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
      sensor.location.add(new Burner.Vector(x, y)); // position the sensor

      if (i) {
        sensor.borderStyle = 'none';
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

  if (this.followMouse && !Burner.System.supportedFeatures.touch) { // follow mouse
    var t = {
      location: new Burner.Vector(Burner.System.mouse.location.x,
          Burner.System.mouse.location.y)
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
    this.flock(Burner.System.getAllItemsByName('Agent'));
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
        diff = Burner.Vector.VectorSub(this.location, element.location);
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
  return new Burner.Vector();
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
  return new Burner.Vector();
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
  return new Burner.Vector();
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
    return new Burner.Vector(this.location.x, this.location.y);
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
    return new Burner.Vector(this.location.x, this.location.y);
  } else if (type === 'x') {
    return this.velocity.x;
  } else if (type === 'y') {
    return this.velocity.y;
  }
};
exports.Agent = Agent;
/*global exports, Burner, document */
/**
 * Creates a new Walker.
 *
 * Walkers have no seeking, steering or directional behavior and just randomly
 * explore their World. Use Walkers to create wandering objects or targets
 * for Agents to seek. They are not affected by gravity or friction.
 *
 * @constructor
 * @extends Mover
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Walker(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Walker';
  exports.Mover.call(this, options);
}
exports.Utils.extend(Walker, exports.Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
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
 * @param {string|Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {string} [opt_options.borderRadius = 100] Border radius.
 * @param {boolean} [opt_options.avoidWorldEdges = false] If set to true, object steers away from
 *    world boundaries.
 * @param {number} [opt_options.avoidWorldEdgesStrength = 0] The distance threshold for object
 *    start steering away from world boundaries.
 */
Walker.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.width = options.width === undefined ? 10 : options.width;
  this.height = options.height === undefined ? 10 : options.height;
  this.perlin = options.perlin === undefined ? true : options.perlin;
  this.remainsOnScreen = !!options.remainsOnScreen;
  this.perlinSpeed = options.perlinSpeed === undefined ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow === undefined ? -0.075 : options.perlinAccelLow;
  this.perlinAccelHigh = options.perlinAccelHigh === undefined ? 0.075 : options.perlinAccelHigh;
  this.offsetX = options.offsetX === undefined ? Math.random() * 10000 : options.offsetX;
  this.offsetY = options.offsetY === undefined ? Math.random() * 10000 : options.offsetY;
  this.random = !!options.random;
  this.randomRadius = options.randomRadius === undefined ? 100 : options.randomRadius;
  this.color = options.color || [255, 150, 50];
  this.borderWidth = options.borderWidth === undefined ? 2 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.avoidWorldEdges = !!options.avoidWorldEdges;
  this.avoidWorldEdgesStrength = options.avoidWorldEdgesStrength === undefined ?
      50 : options.avoidWorldEdgesStrength;
};

/**
 */
Walker.prototype.applyForces = function() {

  // walker use either perlin noise or random walk
  if (this.perlin) {

    this.perlinTime += this.perlinSpeed;

    if (this.remainsOnScreen) {
      this.acceleration = new Burner.Vector();
      this.velocity = new Burner.Vector();
      this.location.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, 0, this.world.bounds[1]);
      this.location.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, 0, this.world.bounds[2]);
    } else {
      this.acceleration.x =  exports.Utils.map(exports.SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
      this.acceleration.y =  exports.Utils.map(exports.SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
    }

  } else if (this.random) {
    this.seekTarget = { // find a random point and steer toward it
      location: Burner.Vector.VectorAdd(this.location, new Burner.Vector(exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius), exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
    };
    this.applyForce(this._seek(this.seekTarget));
  }

  if (this.avoidWorldEdges) {
    this._checkAvoidEdges();
  }
};

exports.Walker = Walker;
/*global exports, Burner */
/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Sensor(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Sensor';
  exports.Mover.call(this, options);
}
exports.Utils.extend(Sensor, exports.Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
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
 * @param {Array} [opt_options.activatedColor = [255, 255, 255]] The color the sensor will display when activated.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 */
Sensor.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Sensor._superClass.prototype.init.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || 'LOVE';
  this.sensitivity = options.sensitivity === undefined ? 2 : options.sensitivity;
  this.width = options.width === undefined ? 7 : options.width;
  this.height = options.height === undefined ? 7 : options.height;
  this.offsetDistance = options.offsetDistance === undefined ? 30 : options.offsetDistance;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [255, 255, 255];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.borderWidth = options.borderWidth === undefined ? 2 : options.borderWidth;
  this.borderStyle = 'solid';
  this.borderColor = [255, 255, 255];
};

/**
 * Called every frame, step() updates the instance's properties.
 */
Sensor.prototype.step = function() {

  var check = false, i, max;

  var heat = Burner.System._caches.Heat || {list: []},
      cold = Burner.System._caches.Cold || {list: []},
      predators = Burner.System._caches.Predators || {list: []},
      lights = Burner.System._caches.Light || {list: []},
      oxygen = Burner.System._caches.Oxygen || {list: []},
      food = Burner.System._caches.Food || {list: []};

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
 * Returns a force to apply to an agent when its sensor is activated.
 *
 */
Sensor.prototype.getActivationForce = function(agent) {

  var distanceToTarget, desiredVelocity, m, v, steer;

  switch (this.behavior) {

    /**
     * Steers toward target
     */
    case 'AGGRESSIVE':
      desiredVelocity = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = desiredVelocity.mag();
      desiredVelocity.normalize();

      m = distanceToTarget/agent.maxSpeed;
      desiredVelocity.mult(m);

      desiredVelocity.sub(agent.velocity);
      desiredVelocity.limit(agent.maxSteeringForce);

    return desiredVelocity;

    /**
     * Steers away from the target
     */
    case 'COWARD':
      desiredVelocity = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = desiredVelocity.mag();
      desiredVelocity.normalize();

      m = distanceToTarget/agent.maxSpeed;
      desiredVelocity.mult(-m);

      desiredVelocity.sub(agent.velocity);
      desiredVelocity.limit(agent.maxSteeringForce);

    return desiredVelocity;

    /**
     * Speeds toward target and keeps moving
     */
    case 'LIKES':
      var dvLikes = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvLikes.mag();
      dvLikes.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvLikes.mult(m);

      steer = Burner.Vector.VectorSub(dvLikes, agent.velocity);
      steer.limit(agent.maxSteeringForce);
      return steer;

    /**
     * Arrives at target and remains
     */
    case 'LOVES':
      var dvLoves = Burner.Vector.VectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();

      if (distanceToTarget > this.width) {
        m = distanceToTarget/agent.maxSpeed;
        dvLoves.mult(m);
        steer = Burner.Vector.VectorSub(dvLoves, agent.velocity);
        steer.limit(agent.maxSteeringForce);
        return steer;
      }
      agent.velocity = new Burner.Vector();
      agent.acceleration = new Burner.Vector();
      return new Burner.Vector();

    /**
     * Arrives at target but does not stop
     */
    case 'EXPLORER':

      var dvExplorer = Burner.Vector.VectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();

      m = distanceToTarget/agent.maxSpeed;
      dvExplorer.mult(-m);

      steer = Burner.Vector.VectorSub(dvExplorer, agent.velocity);
      steer.limit(agent.maxSteeringForce * 0.05);
      return steer;

    /**
     * Moves in the opposite direction as fast as possible
     */
    /*case "RUN":
      return this.flee(this.target);*/

    case 'ACCELERATE':
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(agent.minSpeed);

    case 'DECELERATE':
      v = agent.velocity.clone();
      v.normalize();
      return v.mult(-agent.minSpeed);

    default:
      return new Burner.Vector();
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
/*global exports, Burner */
/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Burner.Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Connector(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Connector';
  Burner.Item.call(this, options);
}
exports.Utils.extend(Connector, Burner.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} options A map of initial properties.
 * @param {Object} parentA The object that starts the connection.
 * @param {Object} parentB The object that ends the connection.
 * @param {number} [options.opacity = 1] Opacity.
 * @param {number} [options.zIndex = 0] zIndex.
 * @param {number} [options.borderWidth = 1] Border width.
 * @param {string} [options.borderStyle = 'dotted'] Border style.
 * @param {Array} [options.borderColor = [150, 150, 150]] Border color.
 */
Connector.prototype.init = function(options) {

  if (!options || !options.parentA || !options.parentB) {
    throw new Error('Connector: both parentA and parentB are required.');
  }
  this.parentA = options.parentA;
  this.parentB = options.parentB;

  this.opacity = options.opacity === undefined ? 1 : options.opacity;
  this.zIndex = options.zIndex || 0;

  this.borderWidth = 1;
  this.borderRadius = 0;
  this.borderStyle = 'dotted';
  this.borderColor = options.borderColor === undefined ? [150, 150, 150] : options.borderColor;

  this.width = 0;
  this.height = 0;
  this.color = 'transparent';
};

/**
 * Called every frame, step() updates the instance's properties.
 */
Connector.prototype.step = function() {

  var a = this.parentA.location,
      b = this.parentB.location;

  this.width = Math.floor(Burner.Vector.VectorSub(this.parentA.location,
      this.parentB.location).mag());

  this.location = Burner.Vector.VectorAdd(this.parentA.location,
      this.parentB.location).div(2); // midpoint = (v1 + v2)/2

  this.angle = exports.Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};

exports.Connector = Connector;
/*global exports, Burner */
/**
 * Creates a new Point.
 *
 * @constructor
 * @extends Mover
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Point(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Point';
  exports.Mover.call(this, options);
}
exports.Utils.extend(Point, exports.Mover);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.zIndex = 1] zIndex.
 * @param {Array} [opt_options.color = [200, 200, 200]] Color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [60, 60, 60]] Border color.
 */
Point.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.width = options.width === undefined ? 10 : options.width;
  this.height = options.height === undefined ? 10 : options.height;
  this.opacity = options.opacity === undefined ? 1 : options.opacity;
  this.isStatic = options.isStatic === false ? false : options.isStatic || true;
  this.zIndex = options.zIndex === undefined ? 1 : options.zIndex;
  this.color = options.color || [200, 200, 200];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.borderWidth = options.borderWidth === undefined ? 2 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [60, 60, 60];
};

exports.Point = Point;
/*global exports, Burner */
/**
 * Creates a new Particle.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Particle(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Particle';
  exports.Agent.call(this, options);
}
exports.Utils.extend(Particle, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {number} [opt_options.lifespan = 40] The max life of the object. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, object is destroyed.
 * @param {boolean} {opt_options.fade = true} If true, opacity decreases proportionally with life.
 * @param {boolean} {opt_options.shrink = true} If true, width and height decrease proportionally with life.
 * @param {boolean} [opt_options.checkWorldEdges = false] Set to true to check the object's location against the world's bounds.
 * @param {number} [opt_options.maxSpeed = 4] Maximum speed.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {Array} [opt_options.color = [200, 200, 200]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {number} [opt_options.borderRadius = 100] The particle's border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {string|Array} [opt_options.boxShadowColor = 'transparent'] Box-shadow color.
 */
Particle.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Particle._superClass.prototype.init.call(this, options);

  this.width = options.width === undefined ? 20 : options.width;
  this.height = options.height === undefined ? 20 : options.height;
  this.lifespan = options.lifespan === undefined ? 50 : options.lifespan;
  this.life = options.life || 0;
  this.fade = options.fade === undefined ? true : false;
  this.shrink = options.shrink === undefined ? true : false;
  this.checkWorldEdges = !!options.checkWorldEdges;
  this.maxSpeed = options.maxSpeed === undefined ? 4 : 0;
  this.zIndex = options.zIndex === undefined ? 1 : 0;
  this.color = options.color || [200, 200, 200];
  this.borderWidth = options.borderWidth === undefined ? this.width / 4 : 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius === undefined ? 100 : 0;
  this.boxShadowSpread = options.boxShadowSpread === undefined ? this.width / 4 : 0;
  this.boxShadowColor = options.boxShadowColor || 'transparent';
  if (!options.acceleration) {
    this.acceleration = new Burner.Vector(1, 1);
    this.acceleration.normalize();
    this.acceleration.mult(this.maxSpeed ? this.maxSpeed : 3);
    this.acceleration.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
  }
  if (!options.velocity) {
    this.velocity = new Burner.Vector();
  }
  this.initWidth = this.width;
  this.initHeight = this.height;
};

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
    Burner.System.destroyItem(this);
  }

};

exports.Particle = Particle;
/*global exports, Burner */
/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function ParticleSystem(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'ParticleSystem';
  exports.Agent.call(this, options);
}
exports.Utils.extend(ParticleSystem, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move.
 * @param {number} [opt_options.lifespan = 1000] The max life of the system. Set to -1 for infinite life.
 * @param {number} [opt_options.life = 0] The current life value. If greater than this.lifespan, system is destroyed.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {number} [opt_options.burst = 1] The number of particles to create per burst.
 * @param {number} [opt_options.burstRate = 1] The number of frames between bursts. Lower values = more particles.
 * @param {number} [opt_options.emitRadius = 3] The ParticleSystem adds this offset to the location of the Particles it creates.
 * @param {Array} [opt_options.startColor = [100, 20, 20]] The starting color of the particle's palette range.
 * @param {Array} [opt_options.endColor = [255, 0, 0]] The ending color of the particle's palette range.
 * @param {Object} [opt_options.particleOptions] A map of options for particles created by system.
 * @param {number} [opt_options.borderWidth = 0] Border width.
 * @param {string} [opt_options.borderStyle = 'none'] Border style.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] Border color.
 * @param {number} [opt_options.borderRadius = 0] Border radius.
 */
ParticleSystem.prototype.init = function(opt_options) {

  var options = opt_options || {};
  ParticleSystem._superClass.prototype.init.call(this, options);

  this.isStatic = options.isStatic === undefined ? true : options.isStatic;
  this.lifespan = options.lifespan === undefined ? -1: options.lifespan;
  this.life = options.life || 0;
  this.width = options.width || 0;
  this.height = options.height || 0;
  this.burst = options.burst === undefined ? 1 : options.burst;
  this.burstRate = options.burstRate === undefined ? 4 : options.burstRate;
  this.emitRadius = options.emitRadius === undefined ? 3 : options.emitRadius;
  this.startColor = options.startColor || [100, 20, 20];
  this.endColor = options.endColor || [255, 0, 0];
  this.particleOptions = options.particleOptions || {
    width : 15,
    height : 15,
    lifespan : 50,
    borderRadius : 100,
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
  this.borderRadius = options.borderRadius || 0;
  this.clock = 0;

  if (this.particleOptions.acceleration) {
    this.initParticleAcceleration = new Burner.Vector(this.particleOptions.acceleration.x,
      this.particleOptions.acceleration.y);
  }

  var pl = new exports.ColorPalette();
  pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: this.startColor,
    endColor: this.endColor
  });

  this.beforeStep = function () {

    var location, offset,
        initAcceleration = this.initParticleAcceleration;

    if (this.life < this.lifespan) {
      this.life += 1;
    } else if (this.lifespan !== -1) {
      Burner.System.destroyItem(this);
      return;
    }

    if (this.clock % this.burstRate === 0) {

      location = this.getLocation(); // use the particle system's location
      offset = new Burner.Vector(1, 1); // get the emit radius
      offset.normalize();
      offset.mult(this.emitRadius); // expand emit radius in a random direction
      offset.rotate(exports.Utils.getRandomNumber(0, Math.PI * 2, true));
      location.add(offset);

      for (var i = 0; i < this.burst; i++) {
        this.particleOptions.world = this.world;
        this.particleOptions.life = 0;
        this.particleOptions.color = pl.getColor();
        this.particleOptions.borderStyle = 'solid';
        this.particleOptions.borderColor = pl.getColor();
        this.particleOptions.boxShadowColor = pl.getColor();
        if (initAcceleration) {
          this.particleOptions.acceleration = new Burner.Vector(initAcceleration.x, initAcceleration.y);
        }
        this.particleOptions.location = ParticleSystem.getParticleLocation(location);

        Burner.System.add('Particle', this.particleOptions);
      }
    }
    this.clock++;
  };
};

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
    return new Burner.Vector(location.x, location.y);
  })();
};

exports.ParticleSystem = ParticleSystem;
/*global exports, Burner */
/**
 * Creates a new Oscillator.
 *
 * Oscillators simulate wave patterns and move according to
 * amplitude and angular velocity. Oscillators are not affected
 * by gravity or friction.
 *
 * @constructor
 * @extends Burner.Item
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Oscillator(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Oscillator';
  Burner.Item.call(this, options);
}
exports.Utils.extend(Oscillator, Burner.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_options.initialLocation = The center of the world] The object's initial location.
 * @param {Object} [opt_options.lastLocation = {x: 0, y: 0}] The object's last location. Used to calculate
 *    angle if pointToDirection = true.
 * @param {Object} [opt_options.amplitude = {x: world width, y: world height}] Sets amplitude, the distance from the object's
 *    initial location (center of the motion) to either extreme.
 * @param {Object} [opt_options.acceleration = {x: 0, y: 0}] The object's acceleration. Oscillators have a
 *    constant acceleration.
 * @param {Object} [opt_options.aVelocity = new Vector()] Angular velocity.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.isPerlin = false] If set to true, object will use Perlin Noise to calculate its location.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -2] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 2] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height.
 * @param {Array} [opt_options.color = [200, 100, 0]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 150, 0]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [147, 199, 196]] Box-shadow color.
 */
Oscillator.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.initialLocation = options.initialLocation ||
      new Burner.Vector(this.world.bounds[1] / 2, this.world.bounds[2] / 2);
  this.lastLocation = new Burner.Vector();
  this.amplitude = options.amplitude || new Burner.Vector(this.world.bounds[1] / 2 - this.width,
      this.world.bounds[2] / 2 - this.height);
  this.acceleration = options.acceleration || new Burner.Vector(0.01, 0);
  this.aVelocity = options.aVelocity || new Burner.Vector();
  this.isStatic = !!options.isStatic;

  this.isPerlin = !!options.isPerlin;
  this.perlinSpeed = options.perlinSpeed === undefined ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow === undefined ? -2 : options.perlinAccelLow;
  this.perlinAccelHigh = options.perlinAccelHigh === undefined ? 2 : options.perlinAccelHigh;
  this.perlinOffsetX = options.perlinOffsetX === undefined ? Math.random() * 10000 : options.perlinOffsetX;
  this.perlinOffsetY = options.perlinOffsetY === undefined ? Math.random() * 10000 : options.perlinOffsetY;

  this.width = options.width === undefined ? 20 : options.width;
  this.height = options.height === undefined ? 20 : options.height;
  this.color = options.color || [200, 100, 0];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 150, 50];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || [200, 100, 0];
};

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
        velDiff = Burner.Vector.VectorSub(this.location, this.lastLocation);
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(velDiff.y, velDiff.x));
    }

    if (this.controlCamera) {
      this._checkCameraEdges();
    }

    if (this.checkWorldEdges || this.wrapWorldEdges) {
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
/*global exports, Burner */
/**
 * Creates a new Liquid.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Liquid(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Liquid';
  exports.Agent.call(this, options);
}
exports.Utils.extend(Liquid, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {string|Array} [opt_options.color = [105, 210, 231]] Color.
 * @param {string|number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {string|Array} [opt_options.borderColor = [167, 219, 216]] Border color.
 * @param {string} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [147, 199, 196]] Box-shadow color.
 */
Liquid.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Liquid._superClass.prototype.init.call(this, options);

  this.c = options.c === undefined ? 1 : options.c;
  this.mass = options.mass === undefined ? 50 : options.mass;
  this.isStatic = options.isStatic === undefined ? true : options.isStatic;
  this.width = options.width === undefined ? 100 : options.width;
  this.height = options.height === undefined ? 100 : options.height;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.zIndex = options.zIndex === undefined ? 1 : options.zIndex;
  this.color = options.color || [105, 210, 231];
  this.borderWidth = options.borderWidth === undefined ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [167, 219, 216];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.boxShadowSpread = options.boxShadowSpread === undefined ? this.width / 8 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [147, 199, 196];

  Burner.System.updateCache(this);
};

exports.Liquid = Liquid;
/*global exports, Burner */
/**
 * Creates a new Attractor object.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Attractor(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Attractor';
  exports.Agent.call(this, options);
}
exports.Utils.extend(Attractor, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.G = 10] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {Array} [opt_options.color = [92, 187, 0]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [224, 228, 204]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 8] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [92, 187, 0]] Box-shadow color.
 */
Attractor.prototype.init = function(opt_options) {

  var options = opt_options || {};

  Attractor._superClass.prototype.init.call(this, options);

  this.G = options.G === undefined ? 10 : options.G;
  this.mass = options.mass === undefined ? 1000 : options.mass;
  this.isStatic = options.isStatic === undefined ? true : options.isStatic;
  this.width = options.width === undefined ? 100 : options.width;
  this.height = options.height === undefined ? 100 : options.height;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.zIndex = options.zIndex === undefined ? 1 : options.zIndex;
  this.color = options.color || [92, 187, 0];
  this.borderWidth = options.borderWidth === undefined ? this.width / 4 : 0;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius === undefined ? 100 : 0;
  this.boxShadowSpread = options.boxShadowSpread === undefined ? this.width / 4 : 0;
  this.boxShadowColor = options.boxShadowColor || [64, 129, 0];

  Burner.System.updateCache(this);
};

exports.Attractor = Attractor;
/*global exports, Burner */
/**
 * Creates a new Repeller.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Repeller(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Repeller';
  exports.Agent.call(this, options);
}
exports.Utils.extend(Repeller, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.G = 1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 1000] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 10] The object's zIndex.
 * @param {Array} [opt_options.color = [250, 105, 0]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [224, 228, 204]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 8] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [250, 105, 0]] Box-shadow color.
 */
Repeller.prototype.init = function(opt_options) {

  var options = opt_options || {};
  Repeller._superClass.prototype.init.call(this, options);

  this.G = options.G === undefined ? -10 : options.G;
  this.mass = options.mass === undefined ? 1000 : options.mass;
  this.isStatic = options.isStatic === undefined ? true : options.isStatic;
  this.width = options.width === undefined ? 100 : options.width;
  this.height = options.height === undefined ? 100 : options.height;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.zIndex = options.zIndex === undefined ? 10 : options.zIndex;
  this.color = options.color || [250, 105, 0];
  this.borderWidth = options.borderWidth === undefined ? this.width / 4 : options.borderWidth;
  this.borderStyle = options.borderStyle || 'double';
  this.borderColor = options.borderColor || [224, 228, 204];
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.boxShadowSpread = options.boxShadowSpread === undefined ? this.width / 4 : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor || [250, 105, 0];

  Burner.System.updateCache(this);
};

exports.Repeller = Repeller;
/*global exports, Burner */

var i, max, pal, color, palettes = {}, border, borderPalette, borderColors = {}, boxShadowColors = {},
    borderStyles = ['double', 'double', 'dotted', 'dashed'];

for (i = 0, max = exports.config.defaultColorList.length; i < max; i++) {
  color = exports.config.defaultColorList[i];
  pal = new exports.ColorPalette();
  pal.addColor({
    min: 20,
    max: 200,
    startColor: color.startColor,
    endColor: color.endColor
  });
  palettes[color.name] = pal;
  borderColors[color.name] = color.borderColor;
  boxShadowColors[color.name] = color.boxShadowColor;
}

borderPalette = new exports.BorderPalette();
for (i = 0, max = borderStyles.length; i < max; i++) {
  border = borderStyles[i];
  borderPalette.addBorder({
    min: 2,
    max: 10,
    style: border
  });
}

/**
 * Creates a new Stimulus.
 *
 * @constructor
 * @extends Agent
 *
 * @param {Object} options A map of initial properties.
 */
function Stimulus(options) {

  if (!options || !options.type) {
    throw new Error('Stimulus: options.type is required.');
  }
  options.name = options.type.substr(0, 1).toUpperCase() +
      options.type.toLowerCase().substr(1, options.type.length);
  exports.Agent.call(this, options);
}
exports.Utils.extend(Stimulus, exports.Agent);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move.
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height.
 * @param {number} [opt_options.opacity = 0.75] The object's opacity.
 * @param {number} [opt_options.zIndex = 1] The object's zIndex.
 * @param {Array} [opt_options.color = [255, 200, 0]] Color.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {string} [opt_options.borderStyle = 'double'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 * @param {Array} [opt_options.boxShadowColor = [255, 200, 0]] Box-shadow color.
 */
Stimulus.prototype.init = function(opt_options) {

  var options = opt_options || {}, name = this.name.toLowerCase();
  Stimulus._superClass.prototype.init.call(this, options);

  this.mass = options.mass === undefined ? 50 : options.mass ;
  this.isStatic = options.isStatic === undefined ? true : options.isStatic;
  this.width = options.width === undefined ? 50 : options.width;
  this.height = options.height === undefined ? 50 : options.height;
  this.opacity = options.opacity === undefined ? 0.75 : options.opacity;
  this.zIndex = options.zIndex === undefined ? 1 : options.zIndex;
  this.color = options.color || palettes[name].getColor();
  this.borderWidth = options.borderWidth === undefined ?
      this.width / exports.Utils.getRandomNumber(2, 8) : options.borderWidth;
  this.borderStyle = options.borderStyle === undefined ?
      borderPalette.getBorder() : options.borderStyle;
  this.borderColor = options.borderColor === undefined ? palettes[name].getColor() : options.borderColor;
  this.borderRadius = options.borderRadius === undefined ? 100 : options.borderRadius;
  this.boxShadowSpread = options.boxShadowSpread === undefined ?
      this.width / exports.Utils.getRandomNumber(2, 8) : options.boxShadowSpread;
  this.boxShadowColor = options.boxShadowColor === undefined ? boxShadowColors[name] : options.boxShadowColor;

  Burner.System.updateCache(this);
};

exports.Stimulus = Stimulus;
/*global exports, Burner */
/**
 * Creates a new FlowField.
 *
 * @constructor
 */
function FlowField(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'FlowField';
  Burner.Item.call(this, options);
}
exports.Utils.extend(FlowField, Burner.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.resolution = 50] The lower the value, the more vectors are created
 *    to define the flow field. Low values increase processing time to create the field.
 * @param {number} [opt_options.perlinSpeed = 0.01] The speed to move through the Perlin Noise space.
 * @param {number} [opt_options.perlinTime = 100] Sets the Perlin Noise time.
 * @param {Object} [opt_options.field = null] A list of vectors that define the flow field.
 * @param {Object} [opt_options.createMarkers = false] Set to true to visualize the flow field.
 */
FlowField.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.resolution = options.resolution === undefined ? 50 : options.resolution;
  this.perlinSpeed = options.perlinSpeed === undefined ? 0.01 : options.perlinSpeed;
  this.perlinTime = options.perlinTime === undefined ? 100 : options.perlinTime;
  this.field = options.field || null;
  this.createMarkers = !!options.createMarkers;
  // if a world is not passed, use the first world in the system
  this.world = options.world || Burner.System.firstWorld();
};

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
      field = new Burner.Vector(fieldX, fieldY);
      vectorList[col][row] = field;
      angle = exports.Utils.radiansToDegrees(Math.atan2(fieldY, fieldX)); // get the angle of the vector

      if (this.createMarkers) {

        var ffm = new exports.FlowFieldMarker({ // create the marker
          location: new Burner.Vector(x, y),
          scale: 1,
          opacity: exports.Utils.map(angle, -360, 360, 0.1, 0.75),
          width: this.resolution,
          height: this.resolution/2,
          field: field,
          angle: angle,
          colorMode: 'rgb',
          color: [200, 100, 50],
          borderRadius: 0,
          zIndex: 0
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
/*global exports, Burner, document */
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

    el = document.createElement('div');
    nose = document.createElement('div');
    el.className = 'flowFieldMarker item';
    nose.className = 'nose';
    el.appendChild(nose);

    el.style.cssText = Burner.System.getCSSText({
      x: options.location.x - options.width / 2,
      y: options.location.y - options.height / 2,
      width: options.width,
      height: options.height,
      opacity: options.opacity,
      angle: options.angle,
      scale: 1,
      colorMode: options.colorMode,
      color0: options.color[0],
      color1: options.color[1],
      color2: options.color[2],
      zIndex: options.zIndex,
      borderRadius: options.borderRadius
    });

    return el;
  }
}

FlowFieldMarker.prototype.name = 'FlowFieldMarker';

exports.FlowFieldMarker = FlowFieldMarker;
}(exports)); // FloraJS end.
