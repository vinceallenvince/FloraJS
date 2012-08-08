/*ignore!
This is the license.
*/
/* Build time: August 8, 2012 10:10:08 */
/** @namespace */
var Flora = {}, exports = Flora;

/**
 * RequestAnimationFrame shim layer with setTimeout fallback
 * @param {function} callback The function to call.
 * @returns {function|Object} An animation frame or a timeout object. 
 */
Flora.requestAnimFrame = (function(callback){

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
/*global window */
/** 
    A module representing a FloraSystem.
    @module florasystem
 */

/**
 * Creates a new FloraSystem.
 *
 * @constructor
 */
function FloraSystem(el) {

  'use strict';

  this.el = el || null;
  
  exports.elements = [];
  exports.liquids = [];
  exports.repellers = [];
  exports.attractors = [];
  exports.heats = [];
  exports.colds = [];
  exports.lights = [];
  exports.oxygen = [];
  exports.food = [];
  exports.predators = [];

  exports.world = new exports.World();
  exports.world.configure(); // call configure after DOM has loaded
  exports.elements.push(exports.world);

  exports.Camera = new exports.Camera();

  exports.destroyElement = function (id) {

    var i, max;

    for (i = 0, max = this.elements.length; i < max; i += 1) {
      if (this.elements[i].id === id) {
        exports.world.el.removeChild(this.elements[i].el);
        this.elements.splice(i, 1);
        break;
      }
    }
  };
  
  exports.animLoop = function () {

    var i, max;

    exports.requestAnimFrame(exports.animLoop);

    for (i = exports.elements.length - 1; i >= 0; i -= 1) {
      exports.elements[i].step();
      if (exports.elements[i]) {
        exports.elements[i].draw();
      }
      if (exports.world.clock) {
        exports.world.clock += 1;
      }
    }
  };
}

/**
 * Starts a FloraSystem.
 * @param {function} func A list of instructions to execute when the system starts.
 */
FloraSystem.prototype.start = function (func) {

  'use strict';

  func = exports.Interface.getDataType(func) === "function" ? func : function () {};

  func.call();
  exports.animLoop();
};

exports.FloraSystem = FloraSystem;
/*global console */
/*jshint supernew:true */
/** 
    A module representing Utils.
    @module Utils
 */

/**
 * @namespace
 * @alias module:Utils
 */
var Utils = (function () {

  'use strict';

  /** @private */
  var PI = Math.PI;
  
  /** @scope Utils */
  return {
    inherit: function(cls, superclass) {
      function F() {}
      F.prototype = superclass.prototype;
      cls.prototype = new F;
      cls.prototype.constructor = cls;
    },
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
    map: function(value, min1, max1, min2, max2) { // returns a new value relative to a new rangee
      var unitratio = (value - min1) / (max1 - min1);
      return (unitratio * (max2 - min2)) + min2;
    },
    /**
     * Generates a psuedo-random number within a range.
     *
     * @param {number} low The low end of the range.
     * @param {number} high The high end of the range.
     * @param {boolean} [flt] Set to true to return a float.
     * @returns {number} A number.
     */
    getRandomNumber: function(low, high, flt) {
      if (flt) {
        return Math.random()*(high-(low-1)) + low;
      }
      return Math.floor(Math.random()*(high-(low-1))) + low;
    },
    /**
     * Converts degrees to radians.
     *
     * @param {number} degrees The degrees value to be converted.
     * @returns {number} A number in radians.
     */       
    degreesToRadians: function(degrees) {
      if (typeof degrees !== 'undefined') {
        return 2 * PI * (degrees/360);
      } else {
        if (typeof console !== 'undefined') {
          console.log('Error: Utils.degreesToRadians is missing degrees param.');
        }
        return false;
      }
    },
    /**
     * Converts radians to degrees.
     *
     * @param {number} radians The radians value to be converted.
     * @returns {number} A number in degrees.
     */       
    radiansToDegrees: function(radians) {
      if (typeof radians !== 'undefined') {
        return radians * (180/PI);
      } else {
        if (typeof console !== 'undefined') {
          console.log('Error: Utils.radiansToDegrees is missing radians param.');
        }
        return false;
      }
    },
    /**
     * Constrain a value within a range.
     *
     * @param {number} val The value to constrain.
     * @param {number} low The lower bound of the range.
     * @param {number} high The upper bound of the range.
     * @returns {number} A number.
     */     
    constrain: function(val, low, high) {
      if (val > high) {
        return high;
      } else if (val < low) {
        return low;
      }
      return val;
    },
    /**
     * Returns a new object with all properties and methods of the 
     * old object copied to the new object's prototype.
     *
     * @param {Object} object The object to clone.
     * @returns {Object} An object.
     */       
    clone: function(object) {
        function F() {}
        F.prototype = object;
        return new F;
    },
    /**
     * Generate a unique id based on the current time in milliseconds + a random number.
     *
     * @returns {number} A number.
     */     
    getUniqueId: function() {
         var dateObj = new Date();
         return dateObj.getTime() + this.getRandomNumber(0,1000000000);
    },
    /**
     * Add an event listener to a DOM element.
     *
     * @param {Object} target The element to receive the event listener.
     * @param {string} eventType The event type.
     * @param {function} The function to run when the event is triggered.    
     */     
    addEvent: function(target, eventType, handler) {      
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
    }
  };
}());
exports.Utils = Utils;
/*jshint supernew:true */
/** 
    A module representing a PVector.
    @module PVector
 */

/** 
 * @namespace
 */
var PVector = (function() {

  'use strict';

  /** @scope PVector */
  return {
    /**
     * Subtract two vectors. Uses clone to avoid affecting the values of the vectors.
     *
     * @returns {Object} A vector.
     */ 
    PVectorSub: function(v1, v2) {
      return this.create(v1.x - v2.x, v1.y - v2.y);
    },
    /**
     * Add two vectors. Uses clone to avoid affecting the values of the vectors.
     *
     * @returns {Object} A vector.
     */       
    PVectorAdd: function(v1, v2) {
      return this.create(v1.x + v2.x, v1.y + v2.y);
    },
    /**
     * Multiply two vectors. Uses clone to avoid affecting the values of the vectors.
     *
     * @returns {Object} A vector.
     */       
    PVectorMult: function(v, n) {
      return this.create(v.x * n, v.y * n);
    },  
    /**
     * Divide two vectors. Uses clone to avoid affecting the values of the vectors.
     *
     * @returns {Object} A vector.
     */           
    PVectorDiv: function(v1, v2) {
      return this.create(v1.x / v2.x, v1.y / v2.y);
    },
    /**
     * Get the midpoint between two vectors. Uses clone to avoid affecting the values of the vectors.
     *
     * @returns {Object} A vector.
     */       
    PVectorMidPoint: function(v1, v2) {
      return this.PVectorAdd(v1, v2).div(2); // midpoint = (v1 + v2)/2
    },
    /**
     * Get the angle between two vectors.
     *
     * @returns {Object} A vector.
     */       
    PVectorAngleBetween: function(v1, v2) {
        var dot = v1.dot(v2),
        theta = Math.acos(dot / (v1.mag() * v2.mag()));
        return theta;
    },
    /**
     * Returns an new vector with all properties and methods of the 
     * old vector copied to the new vector's prototype.
     *
     * @returns {Object} A vector.
     */             
    clone: function() {
      function F() {}
      F.prototype = this;
      return new F;
    },
    /**
     * Creates a new vector based on passed x, y locations. 
     * The new vector will have all PVector methods on its prototype.
     *
     * @param {number} x The x coordinate of the vector.
     * @param {number} y The y coordinate of the vector.
     * @returns {Object} A vector.
     */       
    create: function(x, y) {
      var obj;
      function F() {}
      F.prototype = this;
      obj = new F;
      obj.x = x;
      obj.y = y;
      return obj;
    },
    /**
     * Adds a vector to this vector.
     *
     * @param {Object} vector The vector to add.
     * @returns {Object} This vector.
     */       
    add: function(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    },
    /**
     * Subtracts a vector from this vector.
     *
     * @param {Object} vector The vector to subtract.
     * @returns {Object} This vector.
     */       
    sub: function(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    },
    /**
     * Multiplies this vector by a passed value.
     *
     * @param {number} n Vector will be multiplied by this number.
     * @returns {Object} This vector.
     */         
    mult: function(n) {
      this.x *= n;
      this.y *= n;
      return this;
    },
    /**
     * Divides this vector by a passed value.
     *
     * @param {number} n Vector will be divided by this number.
     * @returns {Object} This vector.
     */       
    div: function(n) {
      this.x = this.x / n;
      this.y = this.y / n;
      return this;
    },
    /**
     * Calculates the magnitude of this vector.
     *
     * @returns {number} The vector's magnitude.
     */       
    mag: function() {
      return Math.sqrt((this.x * this.x) + (this.y * this.y));
    },
    /**
     * Limits the vector's magnitude.
     *
     * @param {number} high The upper bound of the vector's magnitude.
     */       
    limit: function(high) {
      if (this.mag() > high) {
        this.normalize();
        this.mult(high);
      }
    },    
    limitLow: function(low) {
      if (this.mag() < low) {
        this.normalize();
        this.mult(low);
      }
    },
    /**
     * Divides a vector by its magnitude to reduce its magnitude to 1. 
     * Typically used to retrieve the direction of the vector for later manipulation.
     * 
     * @returns {Object} This vector.
     */       
    normalize: function() {
      var m = this.mag();
      if (m !== 0) {
        return this.div(m);
      }
    },
    /**
     * Calculates the distance between this vector and a passed vector.
     * 
     * @param {Object} vector The target vector.
     * @returns {Object} This vector.
     */
    distance: function(vector) {
      return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
    },
    /**
     * Calculates the length of this vector.
     * 
     * @returns {number} This vector's length.
     */ 
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    /**
     * Rotates a vector using a passed angle in radians.
     * 
     * @param {number} radians The angle to rotate in radians.
     * @returns {Object} This vector.
     */       
    rotate: function(radians) {
      var cos = Math.cos(radians),
        sin = Math.sin(radians),
        x = this.x,
        y = this.y;

      this.x = x * cos - y * sin;
      this.y = x * sin + y * cos;
      return this;
    },
    /**
     * Calulates the midpoint between two vectors.
     * 
     * @param {Object} v1 The first vector.
     * @param {Object} v1 The second vector.
     * @returns {Object} A vector representing the midpoint between the passed vectors.
     */       
    midpoint: function(v1, v2) {
      return this.PVectorAdd(v1, v2).div(2);
    },
    /**
     * Calulates the dot product.
     * 
     * @param {Object} vector The target vector.
     * @returns {Object} A vector.
     */       
    dot: function(vector) {
      if (this.z && vector.z) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
      }
      return this.x * vector.x + this.y * vector.y;
    }
  };
}());
exports.PVector = PVector;
/*jshint bitwise:false */
/** 
    A module representing SimplexNoise.
    @module SimplexNoise
 */

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

/** @scope SimplexNoise */
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
var Interface = (function () {

  'use strict';

  /** @scope Interface */
  return {
  
      /**
        @description Compares passed parameters to a set of required parameters.
        @param {Object} params_passed An object containing parameters passed to a function.
        @param {Object} params_required An object containing a function's required parameters.
        @returns {Boolean} Returns true if all required params are present and of the right data type.
            Returns false if any required params are missing or are the wrong data type. Also returns false if any of the passed params are empty.
        @example
params_passed = {
form: document.getElementById("form"),
color: "blue",
total: 100,
names: ["jimmy", "joey"]
}
params_required = {
form: "object",
color: "string",
total: "number",
names: "array"
}
Interface.checkRequiredParams(params_passed, params_required) returns true in this case.
       */
    checkRequiredParams: function (params_passed, params_required) {
      var i, msg, check = true;
      for (i in params_required) { // loop thru required params
        if (params_required.hasOwnProperty(i)) {
          try {
            if (this.getDataType(params_passed[i]) !== params_required[i] || params_passed[i] === "") { // if there is not a corresponding key in the passed params; or params passed value is blank
              check = false;
              if (params_passed[i] === "") {
                msg = "Interface.checkRequiredParams: required param '" + i + "' is empty.";
              } else if (typeof params_passed[i] === "undefined") {
                msg = "Interface.checkRequiredParams: required param '" + i + "' is missing from passed params.";
              } else {
                msg = "Interface.checkRequiredParams: passed param '" + i + "' must be type " + params_required[i] + ". Passed as " + this.getDataType(params_passed[i]) + ".";
              }
              throw new Error(msg);
            }
          } catch (err) {
            if (typeof console !== "undefined") {
              console.log("ERROR: " + err.message);
            }
          }
        }
      }
      return check;
    },
    /**
     * Checks for data type.
     *
     * @returns {string} The data type of the passed variable.
     */
    getDataType: function (element) {

      if (Object.prototype.toString.call(element) === '[object Array]') {
        return "array";
      }

      return typeof element;
    }
  };
}());
exports.Interface = Interface;
/*global $ */

/** 
    A module representing World.
    @module World
 */

/**
 * Creates a new World.
 *
 * @constructor
 *
 * @param {boolean} [opt_options.showStats = false] Set to true to render mr doob stats on startup.
 * @param {number} [opt_options.statsInterval = 0] Holds a reference to the interval used by mr doob's stats monitor.
 * @param {number} [opt_options.clock = 0] Increments each frame.
 * @param {number} [opt_options.c = 0.01] Coefficient of friction.
 * @param {Object} [opt_options.gravity = {x: 0, y: 1}] Gravity
 * @param {Object} [opt_options.wind = {x: 0, y: 0}] Wind 
 * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location  
 */
function World(opt_options) {

  'use strict';

  var me = this, options = opt_options || {};
  
  this.showStats = options.showStats || false;
  this.statsInterval = options.statsInterval || 0;
  this.clock = options.clock || 0;
  this.c = options.c || 0.01;
  this.gravity = options.gravity || exports.PVector.create(0, 1);
  this.wind =  options.wind || exports.PVector.create(0, 0);
  this.location = options.location || exports.PVector.create(0, 0);
  

  this.width = $(window).width();
  this.height = $(window).height();
  this.mouseX = this.width/2;
  this.mouseY = this.height/2;
  this.isTopDown = true;
  this.compassHeading = 0;
  this.compassAccuracy = 0;
  this.isDeviceMotion = false;
  
  if (this.showStats) {
    this.createStats();
  }

  $(document).mousemove(function(e) {
    me.mouseX = e.pageX;
    me.mouseY = e.pageY;        
  });
  
  if (window.addEventListener && this.isDeviceMotion) {
    window.addEventListener("devicemotion", function(e) { // listens for device motion events
      me.devicemotion.call(me, e);
    }, false);
  }

  if (window.addEventListener && this.isDeviceOrientation) {
    window.addEventListener("deviceorientation", function(e) { // listens for device orientation events
      me.deviceorientation.call(me, e);
    }, false);
  }

  $(window).bind("resize", function (e) { // listens for window resize
    me.resize.call(me);
  });
}

/**
 * Configures a new World.
 */
World.prototype.configure = function() { // should be called after doc ready()

  'use strict';

  this.el = document.body;
  this.el.style.width = this.width + "px";
  this.el.style.height = this.height + "px";
};

/**
 * Updates a world instance with passed arguments.
 * Typically called to change the window's default size or
 * change the world's style.
 *
 * @param {Object} props A hash of properties to update.
 */   
World.prototype.update = function(opt_props) {

  'use strict';

  var i, key, props = exports.Interface.getDataType(opt_props) === "object" ? opt_props : {};

  for (key in props) {
    if (props.hasOwnProperty(key)) {
      this[key] = props[key];
    }
  }

  if (props.el) { // if updating the element; update the width and height
    this.width = parseInt(this.el.style.width.replace('px', ''), 10);
    this.height = parseInt(this.el.style.height.replace('px', ''), 10);
  }

  if (props.style) {
    for (i in props.style) {
      if (props.style.hasOwnProperty(i)) {
        this.el.style[i] = props.style[i];
      }
    }
  }
  if (props.showStats) {
    this.createStats();
  }
};

/**
 * Called from a window resize event, resize() repositions all Flora elements relative
 * to the new window size. Also, if the world is the document.body, resets the body's
 * width and height attributes. 
 */ 
World.prototype.resize = function() {

  'use strict';

  var i, max, elementLoc, controlCamera,
    windowWidth = $(window).width(),
    windowHeight = $(window).height();
  
  // check of any elements control the camera
  for (i = 0, max = exports.elements.length; i < max; i += 1) {
    if (exports.elements[i].controlCamera) {
      controlCamera = true;
      break;
    }
  }

  // loop thru elements
  if (!controlCamera) {
    for (i = 0, max = exports.elements.length; i < max; i += 1) {
      
      elementLoc = exports.elements[i].location; // recalculate location
      
      elementLoc.x = windowWidth * (elementLoc.x/this.width);
      elementLoc.y = windowHeight * (elementLoc.y/this.height);
      
    }

    if (this.el === document.body) {
      this.width = windowWidth;
      this.height = windowHeight;
    }
  }
};

/**
 * Called from a window devicemotion event, updates the world's gravity
 * relative to the accelerometer's values.
 */ 
World.prototype.devicemotion = function() {

  'use strict';

  var e = arguments[0];

  if (window.orientation === 0) {
    if (this.isTopDown) {
      this.gravity = exports.PVector.create(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y * -1); // portrait
    } else {
      this.gravity = exports.PVector.create(e.accelerationIncludingGravity.x, (e.accelerationIncludingGravity.z + 7.5) * 2); // portrait 45 degree angle
    }
  } else if (window.orientation === -90) {
    this.gravity = exports.PVector.create(e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.x );
  } else {
    this.gravity = exports.PVector.create(e.accelerationIncludingGravity.y * -1, e.accelerationIncludingGravity.x * -1);
  }

  /*if (World.showDeviceOrientation) {
    $(".console").val("orientation: " + window.orientation + " x: " + e.accelerationIncludingGravity.x.toFixed(2) + " y: " + e.accelerationIncludingGravity.y.toFixed(2) + " z: " + e.accelerationIncludingGravity.z.toFixed(2));
  }*/
};

/**
 * Called from a window deviceorientation event, updates the world's compass values.
 *
 * @param {Object} e An event object passed from the event listener.
 */ 
World.prototype.deviceorientation = function(e) {

  'use strict';

  var compassHeading = e.webkitCompassHeading,
    compassAccuracy = e.webkitCompassAccuracy;

  this.compassAccuracy = compassAccuracy;
  this.compassHeading = compassHeading;

  if (this.showCompassHeading) {
    $(".console").val("heading: " + compassHeading.toFixed(2) + " accuracy: +/- " + compassAccuracy);
  }
};

/**
 * Creates a new instance of mr doob's stats monitor.
 */ 
World.prototype.createStats = function() {

  'use strict';

  var stats = new exports.Stats();

  stats.getDomElement().style.position = 'absolute'; // Align top-left
  stats.getDomElement().style.left = '0px';
  stats.getDomElement().style.top = '0px';
  stats.getDomElement().id = 'stats';

  document.body.appendChild(stats.getDomElement());

  this.statsInterval = setInterval(function() {
      stats.update();
  }, 1000 / 60);
};

/**
 * Destroys an instance of mr doob's stats monitor.
 */     
World.prototype.destroyStats = function() {

  'use strict';  

  clearInterval(this.statsInterval);
  document.body.removeChild(document.getElementById('stats'));
};

/**
 * Called every frame, step() updates the world's properties.
 */ 
World.prototype.step = function() {};

/**
 * Called every frame, draw() renders the world.
 */ 
World.prototype.draw = function() {

  'use strict';

  var x = this.location.x,
    y = this.location.y,
    s = 1,
    a = 0,
    o = 1,
    w = this.width,
    h = this.height,
    style = this.el.style;

  if (Modernizr.csstransforms3d) { //  && Modernizr.touch 
    style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
    style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
    style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
    style.opacity = o;
    style.width = w + 'px';
    style.height = h + 'px';
  } else if (Modernizr.csstransforms) {
    style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
    style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
    style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
    style.opacity = o;
    style.width = w + 'px';
    style.height = h + 'px';
  } else {
    $(this.el).css({
      'position': 'absolute',
      'left': x + 'px',
      'top': y + 'px',
      'width': w + 'px',
      'height': h + 'px',
      'opacity': o
    });
  }
};
exports.World = World;
/** 
    A module representing a Camera.
    @module camera
 */

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

  this.location = options.location || exports.PVector.create(0, 0);
  this.controlObj = options.controlObj || null;
}

exports.Camera = Camera;
/*global $ */
/** 
    A module representing an Obj.
    @module Obj
 */

/**
 * Creates a new Obj. All Flora elements extend Obj.
 * @constructor
 */ 
function Obj() {

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
}

Obj.events =[
  "mouseenter",
  "mousedown",
  "mousemove",
  "mouseup",
  "mouseleave"
];

/**
 * Called by a mouseenter event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */ 
Obj.mouseenter = function(e) {

  'use strict';

  this.isMouseOut = false;
  //clearInterval(this.myInterval);
};

/**
 * Called by a mousedown event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */ 
Obj.mousedown = function(e) {

  'use strict';

  var target = $(e.target);

  this.isPressed = true;
  this.isMouseOut = false;
  this.offsetX = e.pageX - target.position().left;
  this.offsetY = e.pageY - target.position().top;
};

/**
 * Called by a mousemove event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */ 
Obj.mousemove = function(e) {

  'use strict';

  var x, y,
    worldOffset = $(".world").offset();

  if (this.isPressed) {

    this.isMouseOut = false;

    x = e.pageX - worldOffset.left;
    y = e.pageY - worldOffset.top;

    this.item.location = exports.PVector.create(x, y);

    //if (World.first().isPaused) { // if World is paused, need to call draw() to render change in location
      //this.draw();
    //}
  }
};

/**
 * Called by a mouseup event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */     
Obj.mouseup = function(e) {

  'use strict';

  this.isPressed = false;
  //this.item.trigger("saveCurrentPosition");
};

/**
 * Called by a mouseleave event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */     
Obj.mouseleave = function(e) {

  'use strict';

  var me = this,
    item = this.item,
    x, y,
    worldOffset = $(".world").offset();

  if (this.isPressed) {
    this.isMouseOut = true;
    this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up


      if (me.isPressed && me.isMouseOut) {

        x = exports.Flora.World.mouseX - worldOffset.left;
        y = exports.Flora.World.mouseY - worldOffset.top;

        item.location = exports.PVector.create(x, y);

        //if (World.first().isPaused) { // if World is paused, need to call draw() to render change in location
          //me.draw();
        //}
      }
    }, 16);

    $(document).bind("mouseup", function () {
      me.isPressed = false;
    });

  }
};

/**
 * Renders the element to the DOM. Called every frame.
 */     
Obj.prototype.draw = function() {
  
  'use strict';

  var v = this.velocity,
    x = this.location.x - this.width/2,
    y = this.location.y - this.height/2,
    s = this.scale,
    a = this.angle,
    o = this.opacity,
    w = this.width,
    h = this.height,
    cm = this.colorMode,
    c = this.color, 
    z = this.zIndex,
    border = this.border,
    borderRadius = this.borderRadius,
    boxShadow = this.boxShadow,
    style = this.el.style,
    nose = this.el.firstChild,
    i, max;

  // !! try elt.setAttribute('style', '...')

  if (v && nose) { // if this object has a velocity; fade in nose relative to velocity
    nose.style.opacity = exports.Utils.map(v.mag(), 0, this.maxSpeed, 0.25, 1);
  }

  if (Modernizr.csstransforms3d) { //  && Modernizr.touch 
    style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
    style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
    style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
    style.opacity = o;
    style.width = w + "px";
    style.height = h + "px";
    if (c) {
      style.background = cm + "(" + c.r + ", " + c.g + ", " + c.b + ")";
    }
    style.zIndex = z;
    style.border = border;
    style.borderRadius = borderRadius;
    style.boxShadow = boxShadow;
  } else if (Modernizr.csstransforms) {
    style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
    style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
    style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
    style.opacity = o;
    style.width = w + 'px';
    style.height = h + 'px';
    style.background = cm + '(' + c.r + ', ' + c.g + ', ' + c.b + ')';
    style.zIndex = z;
  } else {
    $(this.el).css({
      'position': 'absolute',
      'left': x + 'px',
      'top': y + 'px',
      'width': w + 'px',
      'height': h + 'px'
    });
  }
};
exports.Obj = Obj;
/*global $ */
/** 
    A module representing a Mover.
    @module Mover
 */

/**
 * Creates a new Mover and appends it to Flora.elements.
 *
 * @constructor
 * @extends Obj
 *
 * @param {Object} [opt_options] Mover options.
 * @param {string} [opt_options.id = "m-" + Mover._idCount] An id. If an id is not provided, one is created.
 * @param {Object|function} [opt_options.view] HTML representing the Mover instance.
 * @param {string} [opt_options.className = 'mover'] The corresponding DOM element's class name.
 * @param {number} [opt_options.mass = 10] Mass
 * @param {number} [opt_options.maxSpeed = 10] Maximum speed
 * @param {number} [opt_options.minSpeed = 0] Minimum speed
 * @param {number} [opt_options.scale = 1] Scale
 * @param {number} [opt_options.angle = 0] Angle
 * @param {number} [opt_options.opacity = 0.85] Opacity
 * @param {number} [opt_options.lifespan = -1] Life span. Set to -1 to live forever.
 * @param {number} [opt_options.width = 20] Width
 * @param {number} [opt_options.height = 20] Height
 * @param {string} [opt_options.colorMode = 'rgb'] Color mode
 * @param {Object} [opt_options.color = {r: 197, g: 177, b: 115}] The object's color.
 * @param {number} [opt_options.zIndex = 10] z-index
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
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
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {array} [opt_options.sensors = []] A list of sensors attached to this object.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 * @param {Object} [opt_options.acceleration = {x: 0, y: 0}] The object's initial acceleration.
 * @param {Object} [opt_options.velocity = {x: 0, y: 0}] The object's initial velocity.
 * @param {Object} [opt_options.location = The center of the world] The object's initial location.
 */

 
function Mover(opt_options) {

  'use strict';

  var options = opt_options || {},
      world = exports.world || document.createElement("div"),
      elements = exports.elements || [],
      liquids = exports.liquids || [],
      repellers = exports.repellers || [],
      attractors = exports.attractors || [],
      heats = exports.heats || [],
      colds = exports.colds || [],
      predators = exports.predators || [],
      lights = exports.lights || [],
      oxygen = exports.oxygen || [],
      food = exports.food || [],
      i, max, evt;

  for (i in options) {
    if (options.hasOwnProperty(i)) {
      this[i] = options[i];
    }
  }

  this.id = options.id || this.constructor.name.toLowerCase() + "-" + Mover._idCount; // if no id, create one

  if (options.view && exports.Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
    this.el = options.view.call();
  } else if (exports.Interface.getDataType(options.view) === "object") { // if view is supplied and is an object
    this.el = options.view;
  } else {
    this.el = document.createElement("div");
  }
  
  // optional
  this.className = options.className || this.constructor.name.toLowerCase();
  this.mass = options.mass || 10;  
  this.maxSpeed = options.maxSpeed || 10;
  this.minSpeed = options.minSpeed || 0;
  this.scale = options.scale || 1;   
  this.angle = options.angle || 0;   
  this.opacity = options.opacity || 0.85;   
  this.lifespan = options.lifespan || -1;    
  this.width = options.width || 20; 
  this.height = options.height || 20;    
  this.colorMode = options.colorMode || 'rgb';     
  this.color = options.color || {r: 197, g: 177, b: 115};
  this.zIndex = options.zIndex || 10;  
  this.pointToDirection = options.pointToDirection || true;      
  this.followMouse = options.followMouse || false;     
  this.isStatic = options.isStatic || false;    
  this.checkEdges = options.checkEdges || true;    
  this.wrapEdges = options.wrapEdges || false;   
  this.avoidEdges = options.avoidEdges || false;    
  this.avoidEdgesStrength = options.avoidEdgesStrength || 200;    
  this.bounciness = options.bounciness || 0.75;    
  this.maxSteeringForce = options.maxSteeringForce || 10;  
  this.flocking = options.flocking || false;  
  this.desiredSeparation = options.desiredSeparation || this.width * 2;
  this.separateStrength = options.separateStrength || 1;  
  this.alignStrength = options.alignStrength || 1;     
  this.cohesionStrength = options.cohesionStrength || 1;      
  this.sensors = options.sensors || [];
  this.flowField = options.flowField || null;   
  this.acceleration = options.acceleration || exports.PVector.create(0, 0);
  this.velocity = options.velocity || exports.PVector.create(0, 0);
  this.location = options.location || exports.PVector.create(world.width/2, world.height/2);
  this.controlCamera = options.controlCamera || false;
  this.beforeStep = options.beforeStep || undefined;    
  this.afterStep = options.afterStep || undefined;

  elements.push(this); // push new instance of Mover

  this.el.id = this.id;
  this.el.className = this.className;

  if (world.el) {
    world.el.appendChild(this.el); // append the view to the World
  } 
  
  Mover._idCount += 1; // increment id

  if (this.className === "liquid") {
    liquids.push(this); // push new instance of liquids to liquid list
  } else if (this.className === "repeller") {
    repellers.push(this); // push new instance of repeller to repeller list
  } else if (this.className === "attractor") {
    attractors.push(this); // push new instance of attractor to attractor list
  } else if (this.className === "heat") {
    heats.push(this);
  } else if (this.className === "cold") {
    colds.push(this);
  } else if (this.className === "predator") {
    predators.push(this);
  } else if (this.className === "light") {
    lights.push(this);
  } else if (this.className === "oxygen") {
    oxygen.push(this);
  } else if (this.className === "food") {
    food.push(this);
  }
  
  if (this.controlCamera) { // if this object controls the camera

    exports.Camera.controlObj = this;
    
    // need to position world so controlObj is centered on screen
    world.location.x = -world.width/2 + $(window).width()/2 + (world.width/2 - this.location.x);
    world.location.y = -world.height/2 + $(window).height()/2 + (world.height/2 - this.location.y);
  }

  /*inst.el.addEventListener("mouseenter", function (e) { Obj.mouseenter.call(inst, e); }, false);
  inst.el.addEventListener("mousedown", function (e) { Obj.mousedown.call(inst, e); }, false);
  inst.el.addEventListener("mousemove", function (e) { Obj.mousemove.call(inst, e); }, false);
  inst.el.addEventListener("mouseup", function (e) { Obj.mouseup.call(inst, e); }, false);
  inst.el.addEventListener("mouseleave", function (e) { Obj.mouseleave.call(inst, e); }, false);*/      
  
}
exports.Utils.inherit(Mover, exports.Obj);

/**
 * Increments as each Mover is created.
 * @type number
 * @default 0
 */
Mover._idCount = 0;


/**
 * Called every frame, step() updates the instance's properties.
 */   
Mover.prototype.step = function() {

  'use strict';

  var i, max, dir, friction, force, nose,
    world = exports.world;
  
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
    
    if (exports.attractors.length > 0) { // repeller
      for (i = 0, max = exports.attractors.length; i < max; i += 1) {
        if (this.id !== exports.attractors[i].id) {
          force = this.attract(exports.attractors[i]);
          this.applyForce(force);
        }
      }
    }
    
    if (this.sensors.length > 0) { // Sensors
      for (i = 0, max = this.sensors.length; i < max; i += 1) {
        
        var sensor = this.sensors[i];
        
        var r = sensor.length; // use angle to calculate x, y
        var theta = exports.Utils.degreesToRadians(this.angle + sensor.offsetAngle);
        var x = r * Math.cos(theta);
        var y = r * Math.sin(theta);
        
        sensor.location.x = this.location.x;
        sensor.location.y = this.location.y;
        sensor.location.add(exports.PVector.create(x, y)); // position the sensor
        
        if (sensor.activated) {
          this.applyForce(sensor.getActivationForce({
            mover: this
          }));
        }
        
      }
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
        location: exports.PVector.create(world.mouseX, world.mouseY)
      };
      this.applyForce(this.seek(t));      
    }
    
    if (this.target) { // follow target
      this.applyForce(this.seek(this.target));
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
            location: exports.PVector.create(loc.x, loc.y)
          };
        } else {
          target = {
            location: exports.PVector.create(this.location.x, this.location.y)
          };              
        }
        this.applyForce(this.follow(target));
      }
      
    }
    
    if (this.flocking) {
      this.flock(exports.elements);
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
      this.location = this.parent.location;
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
Mover.prototype.applyForce = function(force) {

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
Mover.prototype.seek = function(target, arrive) {

  'use strict';

  var world = exports.world,
    desiredVelocity = exports.PVector.PVectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();
  
  if (distanceToTarget < world.width/2) {
    var m = exports.Utils.map(distanceToTarget, 0, world.width/2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }
  
  var steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
  steer.limit(this.maxSteeringForce);
  return steer;
};

/**
 * Calculates a steering force to apply to an object following another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 */ 
Mover.prototype.follow = function(target) {

  'use strict';

  var desiredVelocity = target.location;

  desiredVelocity.mult(this.maxSpeed);

  var steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
  steer.limit(this.maxSteeringForce);
  return steer;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 */     
Mover.prototype.flock = function(elements) {

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
Mover.prototype.separate = function(elements) {

  'use strict';

  var i, max, element, diff, d,
  sum = exports.PVector.create(0, 0),
  count = 0, steer;
  
  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    if (this.className === element.className && this.id !== element.id) {
      
      d = this.location.distance(element.location);
      
      if ((d > 0) && (d < this.desiredSeparation)) {
        diff = exports.PVector.PVectorSub(this.location, element.location);
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
    steer = exports.PVector.PVectorSub(sum, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return exports.PVector.create(0, 0);
};    

/**
 * Loops through a passed elements array and calculates a force to apply 
 * to align with all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */     
Mover.prototype.align = function(elements) {

  'use strict';

  var i, max, element, diff, d,
    sum = exports.PVector.create(0, 0),
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
    steer = exports.PVector.PVectorSub(sum, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return exports.PVector.create(0, 0);
};

/**
 * Loops through a passed elements array and calculates a force to apply 
 * to stay close to all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */     
Mover.prototype.cohesion = function(elements) {

  'use strict';

  var i, max, element, diff, d,
    sum = exports.PVector.create(0, 0),
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
    desiredVelocity = exports.PVector.PVectorSub(sum, this.location);
    desiredVelocity.normalize();
    desiredVelocity.mult(this.maxSpeed);
    steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return exports.PVector.create(0, 0);
};

/**
 * Calculates a force to apply to flee a target. The force is the inverse
 * of the object's maximum speed.
 *
 * @param {Object} target The object to flee from.
 * @returns {Object} A force to apply.
 */     
Mover.prototype.flee = function(target) {

  'use strict';

  var desiredVelocity = exports.PVector.PVectorSub(target.location, this.location); // find vector pointing at target

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
Mover.prototype.drag = function(target) {

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
Mover.prototype.attract = function(attractor) {

  'use strict';

  var force = exports.PVector.PVectorSub(attractor.location, this.location),
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
Mover.prototype.checkWorldEdges = function(world) {

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
      this.location = exports.PVector.create(0, this.location.y);
      diff = exports.PVector.create(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
      check = true;
    } else if (this.location.x < 0) {
      this.location = exports.PVector.create(world.width, this.location.y);
      diff = exports.PVector.create(x - this.location.x, 0);
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
        desiredVelocity = exports.PVector.create(maxSpeed, this.velocity.y),
        steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }
    }
    if (this.location.x + this.width/2 > world.width) {         
      this.location = exports.PVector.create(world.width - this.width/2, this.location.y);
      diff = exports.PVector.create(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
      this.velocity.x *= -1 * this.bounciness;    
      check = true;
     } else if (this.location.x < this.width/2) {       
      this.location = exports.PVector.create(this.width/2, this.location.y);
      diff = exports.PVector.create(x - this.location.x, 0);
      this.velocity.x *= -1 * this.bounciness;      
      check = true; 
    }
  }
   
  ////

  maxSpeed = null;
  if (this.wrapEdges) {
    if (this.location.y > world.height) {
      this.location = exports.PVector.create(this.location.x, 0);
      diff = exports.PVector.create(0, y - this.location.y);
      check = true;
    } else if (this.location.y < 0) {
      this.location = exports.PVector.create(this.location.x, world.height);
      diff = exports.PVector.create(0, y - this.location.y);
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
        desiredVelocity = exports.PVector.create(this.velocity.x, maxSpeed),
        steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }
    } 
    if (this.location.y + this.height/2 > world.height) {
      this.location = exports.PVector.create(this.location.x, world.height - this.height/2);
      diff = exports.PVector.create(0, y - this.location.y);
      this.velocity.y *= -1 * this.bounciness;
      check = true;
      } else if (this.location.y < this.height/2) {       
      this.location = exports.PVector.create(this.location.x, this.height/2);
      diff = exports.PVector.create(0, y - this.location.y);
      this.velocity.y *= -1 * this.bounciness;
      check = true;
    }
  }

  if (check && this.controlCamera) {
    exports.world.location.add(diff); // !! do we need this? // add the distance difference to World.location
  }
  return check;
};

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 *
 * @param {Object} world The world object.
 * @returns {boolean} Returns true if the object is outside the world.
 */     
Mover.prototype.checkCameraEdges = function() {

  'use strict';

  var vel = this.velocity.clone();

  exports.world.location.add(vel.mult(-1));
};

/**
 * Returns this object's location.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */ 
Mover.prototype.getLocation = function (type) {

  'use strict';

  if (!type) {
    return exports.PVector.create(this.location.x, this.location.y);
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
Mover.prototype.getVelocity = function (type) {

  'use strict';

  if (!type) {
    return exports.PVector.create(this.velocity.x, this.velocity.y);
  } else if (type === "x") {
    return this.velocity.x;
  } else if (type === "y") {
    return this.velocity.y;
  }
};

exports.Mover = Mover;
/** 
    A module representing Walker.
    @module Walker
 */

/**
 * Creates a new Walker.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Walker options.
 * @param {string} [opt_options.className = 'walker'] The corresponding DOM element's class name.
 * @param {boolean} [opt_options.isPerlin = false] If set to true, object will use Perlin Noise to calculate its location.
 * @param {boolean} [opt_options.remainsOnScreen = false] If set to true and isPerlin = true, object will avoid world edges.
 * @param {number} [opt_options.perlinSpeed = 0.005] If isPerlin = true, perlinSpeed determines how fast the object location moves through the noise space.
 * @param {number} [opt_options.perlinTime = 0] Sets the Perlin Noise time.
 * @param {number} [opt_options.perlinAccelLow = -0.075] The lower bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.perlinAccelHigh = 0.075] The upper bound of acceleration when isPerlin = true.
 * @param {number} [opt_options.offsetX = Math.random() * 10000] The x offset in the Perlin Noise space.
 * @param {number} [opt_options.offsetY = Math.random() * 10000] The y offset in the Perlin Noise space.
 * @param {boolean} [opt_options.isRandom = false] Set to true for walker to move in a random direction.
 * @param {number} [opt_options.isRandom = 100] If isRandom = true, walker will look for a new location each frame based on this radius.
 * @param {boolean} [opt_options.isHarmonic = false] If set to true, walker will move using harmonic motion.
 * @param {Object} [opt_options.isHarmonic = {x: 6, y: 6}] If isHarmonic = true, sets the motion's amplitude.
 * @param {Object} [opt_options.harmonicPeriod = {x: 150, y: 150}] If isHarmonic = true, sets the motion's period.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {Object} [opt_options.color = {r: 255, g: 150, b: 50}] The object's color.
 * @param {number} [opt_options.maxSpeed = 30] Maximum speed
 * @param {boolean} [opt_options.wrapEdges = false] Set to true to set the object's location to the opposite side of the world if the object moves outside the world's bounds.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.  
 */
function Walker(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);
  
  this.isPerlin = options.isPerlin || false;
  this.remainsOnScreen = options.remainsOnScreen || false;
  this.perlinSpeed = options.perlinSpeed || 0.005;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = options.perlinAccelLow || -0.075;
  this.perlinAccelHigh = options.perlinAccelHigh || 0.075;
  this.offsetX = options.offsetX || Math.random() * 10000;
  this.offsetY = options.offsetY || Math.random() * 10000;   
  this.isRandom = options.isRandom || false;
  this.randomRadius = options.randomRadius || 100;
  this.isHarmonic = options.isHarmonic || false;
  this.harmonicAmplitude = options.harmonicAmplitude || exports.PVector.create(6, 6);
  this.harmonicPeriod = options.harmonicPeriod || exports.PVector.create(150, 150);    
  this.width = options.width || 10;
  this.height = options.height || 10;     
  this.color = options.color || {r: 255, g: 150, b: 50};   
  this.maxSpeed = options.maxSpeed || 30;
  this.wrapEdges = options.wrapEdges || false;
  this.isStatic = options.isStatic || false;
}
exports.Utils.inherit(Walker, exports.Mover);


/**
 * Called every frame, step() updates the instance's properties.
 */     
Walker.prototype.step = function () {

  'use strict';

  var world = exports.world,
      friction;

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  if (!this.isStatic && !this.isPressed) {

    if (this.isPerlin) {
      
      this.perlinTime += this.perlinSpeed;

      if (this.remainsOnScreen) {
        this.acceleration = exports.PVector.create(0, 0);
        this.velocity = exports.PVector.create(0, 0);
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
        location: exports.PVector.PVectorAdd(this.location, exports.PVector.create(exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius), exports.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
      };
    }

    if (this.target) { // follow target
      this.applyForce(this.seek(this.target));
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

    this.acceleration.mult(0); // reset acceleration
  }
};  
exports.Walker = Walker;
/** 
    A module representing a Particle.
    @module Particle
 */

/**
 * Creates a new Particle.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Particle options.
 * @param {number} [opt_options.lifespan = 40] The number of frames before particle dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {Object} [opt_options.color = {r: 200, g: 200, b: 200}] The particle's color.
 * @param {string} [opt_options.borderRadius = '100%'] The particle's border radius.  
 */
 function Particle(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.lifespan = options.lifespan || 40;
  this.width = options.width || 10;
  this.height = options.height || 10; 
  this.color = options.color || {r: 200, g: 20, b: 20};
  this.borderRadius = options.borderRadius || '100%';
 }
 exports.Utils.inherit(Particle, exports.Mover);


Particle.prototype.step = function () {

  'use strict';

	var world = exports.world,
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
		this.opacity = exports.Utils.map(this.lifespan, 0, 40, 0, 1);
		

		if (this.lifespan > 0) {
			this.lifespan -= 1;
		} else if (this.lifespan === 0) {
			exports.destroyElement(this.id);
		}
		this.acceleration.mult(0); // reset acceleration
	}
};
exports.Particle = Particle;    
/** 
    A module representing a ParticleSystem.
    @module ParticleSystem
 */
 
/**
 * Creates a new ParticleSystem.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Particle options.
 * @param {boolean} [opt_options.isStatic = true] If set to true, particle system does not move. 
 * @param {number} [opt_options.lifespan = -1] The number of frames before particle system dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 0] Width
 * @param {number} [opt_options.height = 0] Height
 * @param {Object} [opt_options.color = null] Color
 * @param {number} [opt_options.burst = 1] The number of particles to create per frame.
 * @param {Object} [opt_options.particle = A particle at the system's location w random acceleration.] The particle to create. At minimum, should have a location vector. Use this.getLocation to get location of partilce system.
 */
 function ParticleSystem(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.beforeStep = function () {
   
    var i, max, p;
    
    for (i = 0; i < this.burst; i += 1) {
      p = new exports.Particle(this.particle());
    }
    if (this.lifespan > 0) {
      this.lifespan -= 1;
    } else if (this.lifespan === 0) {
      exports.destroyElement(this.id);
    }
  };
  this.isStatic = options.isStatic || true;
  this.lifespan = options.lifespan || -1;
  this.width = options.width || 0;
  this.height = options.height || 0;
  this.color = options.color || '';
  this.burst = options.burst || 1;
  this.particle = options.particle || function () {
    return {
      location: this.getLocation(),
      acceleration: exports.PVector.create(exports.Utils.getRandomNumber(-4, 4), exports.Utils.getRandomNumber(-4, 4))
    };
  };
}
exports.Utils.inherit(ParticleSystem, exports.Mover);
exports.ParticleSystem = ParticleSystem;    
/** 
    A module representing a Liquid object.
    @module Liquid
 */

/**
 * Creates a new Liquid.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.c = 1] Drag coefficient.
 * @param {number} [opt_options.mass = 50] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 100] Width.
 * @param {number} [opt_options.height = 100] Height. 
 * @param {Object} [opt_options.color = {r: 97, g: 210, b: 214}] The liquid's color.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.  
 */
function Liquid(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.c = options.c || 1;
  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 100;
  this.height = options.height || 100;
  this.color = options.color  || {r: 97, g: 210, b: 214};
  this.opacity = options.opacity || 0.75;
}
exports.Utils.inherit(Liquid, exports.Mover);
exports.Liquid = Liquid;
/** 
    A module representing a Attractor object.
    @module Attractor
 */

/**
 * Creates a new Attractor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.G = -1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height. 
 * @param {Object} [opt_options.color = {r: 97, g: 210, b: 214}] Color.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.  
 */
function Attractor(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.G = options.G || 1;
  this.mass = options.mass || 100;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 50;
  this.height = options.height || 50;
  this.color = options.color || {r: 97, g: 210, b: 214};
  this.opacity = options.opacity || 0.75;
}
exports.Utils.inherit(Attractor, exports.Mover);
exports.Attractor = Attractor;
/** 
    A module representing a Repeller object.
    @module Repeller
 */

/**
 * Creates a new Repeller object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.G = -1] Universal Gravitational Constant.
 * @param {number} [opt_options.mass = 100] Mass.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 50] Width.
 * @param {number} [opt_options.height = 50] Height. 
 * @param {Object} [opt_options.color = {r: 97, g: 210, b: 214}] Color.
 * @param {number} [opt_options.opacity = 0.75] The particle's opacity.  
 */
function Repeller(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.G = options.G || -1;
  this.mass = options.mass || 100;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 50;
  this.height = options.height || 50;
  this.color = options.color || {r: 97, g: 210, b: 214};
  this.opacity = options.opacity || 0.75;
}
exports.Utils.inherit(Repeller, exports.Mover);
exports.Repeller = Repeller;
/** 
    A module representing a Heat object.
    @module Heat
 */

/**
 * Creates a new Heat object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height. 
 * @param {Object} [opt_options.color = {r: 255, g: 69, b: 0}] Color.
 * @param {number} [opt_options.opacity = 0.5] Opacity.  
 */
function Heat(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || {r: 255, g: 69, b: 0};
  this.opacity = options.opacity || 0.5;
}
exports.Utils.inherit(Heat, exports.Mover);
exports.Heat = Heat;
/** 
    A module representing a Cold object.
    @module Cold
 */

/**
 * Creates a new Cold object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height. 
 * @param {Object} [opt_options.color = {r: 132, g: 192, b: 201}] Color.
 * @param {number} [opt_options.opacity = 0.5] Opacity.  
 */
function Cold(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || {r: 132, g: 192, b: 201};
  this.opacity = options.color || 0.5;
}
exports.Utils.inherit(Cold, exports.Mover);
exports.Cold = Cold;
/** 
    A module representing a Light object.
    @module Light
 */

/**
 * Creates a new Light object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height. 
 * @param {Object} [opt_options.color = {r: 255, g: 200, b: 0}] Color.
 * @param {number} [opt_options.opacity = 0.5] Opacity.  
 */
function Light(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || {r: 255, g: 200, b: 0};
  this.opacity = options.opacity || 0.5;
}
exports.Utils.inherit(Light, exports.Mover);
exports.Light = Light;
/** 
    A module representing an Oxygen object.
    @module Oxygen
 */

/**
 * Creates a new Oxygen object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height. 
 * @param {Object} [opt_options.color = {r: 255, g: 200, b: 0}] Color.
 * @param {number} [opt_options.opacity = 0.5] The particle's opacity.  
 */
function Oxygen(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || {r: 255, g: 200, b: 0};
  this.opacity = options.opacity || 0.5;
}
exports.Utils.inherit(Oxygen, exports.Mover);
exports.Oxygen = Oxygen;
/** 
    A module representing a Food object.
    @module Food
 */

/**
 * Creates a new Food object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 20] Width.
 * @param {number} [opt_options.height = 20] Height. 
 * @param {Object} [opt_options.color = {r: 155, g: 231, b: 93}] Color.
 * @param {number} [opt_options.opacity = 0.5] The particle's opacity.  
 */
function Food(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || {r: 155, g: 231, b: 93};
  this.opacity = options.opacity || 0.5;
}
exports.Utils.inherit(Food, exports.Mover);
exports.Food = Food;
/** 
    A module representing a Predator object.
    @module Predator
 */

/**
 * Creates a new Predator object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.mass = 50] Mass. Increase for a greater gravitational effect.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 * @param {number} [opt_options.width = 75] Width.
 * @param {number} [opt_options.height = 75] Height. 
 * @param {Object} [opt_options.color = {r: 200, g: 0, b: 0}] Color.
 * @param {number} [opt_options.opacity = 0.5] The particle's opacity.  
 */
function Predator(opt_options) {

  'use strict';
  
  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.mass = options.mass || 50;
  this.isStatic = options.isStatic || true;
  this.width = options.width || 75;
  this.height = options.height || 75;
  this.color = options.color || {r: 200, g: 0, b: 0};
  this.opacity = options.opacity || 0.5;
}
exports.Utils.inherit(Predator, exports.Mover);
exports.Predator = Predator;
/*global exports */
/** 
    A module representing a Sensor object.
    @module Sensor
 */

/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = 'LOVE'] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 2] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height. 
 * @param {number} [opt_options.length = 30] Length.
 * @param {number} [opt_options.offsetAngle = 30] The angle of rotation around the vehicle carrying the sensor.    
 * @param {Object} [opt_options.color = {}] Color.
 * @param {number} [opt_options.opacity = 1] Opacity. 
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.   
 */      
function Sensor(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.type = options.type || '';
  this.behavior = options.behavior || 'LOVE';
  this.sensitivity = options.sensitivity || 2;
  this.width = options.width || 5;
  this.height = options.height || 5;
  this.length = options.length || 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.color = options.color || {};
  this.opacity = options.opacity || 1;    
  this.target = options.target || null;
  this.activated = options.activated || false;
}
exports.Utils.inherit(Sensor, exports.Mover);

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
  }
  if (this.afterStep) {
    this.afterStep.apply(this);
  }
  
};

/**
 * Returns the force to apply the vehicle when its sensor is activated.
 *
 * @param {Object} params A list of properties.
 * @param {Object} params.mover The vehicle carrying the sensor.
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
     * Arrives at target and keeps moving
     */
    case "LIKES":
      var dvLikes = exports.PVector.PVectorSub(this.target.location, this.location); // desiredVelocity
      dvLikes.normalize();
      dvLikes.mult(0.5);
      return dvLikes;
    /**
     * Arrives at target and remains
     */      
    case "LOVES":
      var dvLoves = exports.PVector.PVectorSub(this.target.location, this.location); // desiredVelocity
      distanceToTarget = dvLoves.mag();
      dvLoves.normalize();
  
      if (distanceToTarget > this.width) {
        m = distanceToTarget/params.mover.maxSpeed;
        dvLoves.mult(m);
        steer = exports.PVector.PVectorSub(dvLoves, params.mover.velocity);
        steer.limit(params.mover.maxSteeringForce);
        return steer;
      }
      params.mover.velocity = exports.PVector.create(0, 0);
      params.mover.acceleration = exports.PVector.create(0, 0);
      params.mover.isStatic = true;
      return exports.PVector.create(0, 0);
    /**
     * Arrives at target but does not stop
     */ 
    case "EXPLORER": 
      var dvExplorer = exports.PVector.PVectorSub(this.target.location, this.location);
      distanceToTarget = dvExplorer.mag();
      dvExplorer.normalize();
          
      m = distanceToTarget/params.mover.maxSpeed;
      dvExplorer.mult(-m);
      steer = exports.PVector.PVectorSub(dvExplorer, params.mover.velocity);
      steer.limit(params.mover.maxSteeringForce * 0.1);
      return steer;
    /**
     * Moves in the opposite direction as fast as possible
     */ 
    case "RUN":
      return this.flee(this.target);

    case "ACCELERATE":
      var forceAccel = params.mover.velocity.clone();
      forceAccel.normalize(); // get direction
      return forceAccel.mult(params.mover.minSpeed);

    case "DECELERATE":
      var forceDecel = params.mover.velocity.clone();
      forceDecel.normalize(); // get direction
      return forceDecel.mult(-params.mover.minSpeed);            

    default:
      return exports.PVector.create(0, 0);         
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
/*global console */
/** 
    A module representing a FlowFieldMarker.
    @module FlowFieldMarker
 */

/**
 * Creates a new FlowFieldMarker.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 * @param {Object} opt_options.location Location.
 * @param {number} opt_options.scale Scale. 
 * @param {number} opt_options.opacity Opacity
 * @param {number} opt_options.width Width.
 * @param {number} opt_options.height Height. 
 * @param {number} opt_options.angle Angle. 
 * @param {string} opt_options.colorMode Color mode. 
 * @param {Object} opt_options.color Color. 
 */    
function FlowFieldMarker(opt_options) {

  'use strict';

  /**
   * TODO(vince): these should be required. Use Interface.
   */
  var options = opt_options || {},
      el = document.createElement("div"),
      nose = document.createElement("div");/*,
      x = options.location.x - options.width/2,
      y = options.location.y - options.height/2,
      s = options.scale,
      a = options.angle,
      o = options.opacity,
      w = options.width,
      h = options.height,
      cm = options.colorMode,
      c = options.color,  
      style = el.style;*/

  el.className = "flowFieldMarker";
  nose.className = "nose";
  el.appendChild(nose); 

  /*if (Modernizr.csstransforms3d) { //  && Modernizr.touch 
    style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
    style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
    style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
    style.opacity = o;
    style.width = w + "px";
    style.height = h + "px";
    style.background = cm + "(" + c.r + ", " + c.g + ", " + c.b + ")";
  }*/

  el.style.cssText = this.getCSSText({
    x: options.location.x - options.width/2,
    y: options.location.y - options.height/2,
    s: options.scale,
    a: options.angle,
    o: options.opacity,
    w: options.width,
    h: options.height,
    cm: options.colorMode,
    c: options.color
  });

  exports.world.el.appendChild(el);


}

FlowFieldMarker.prototype.getCSSText = function(props) {

  'use strict';

  return [
    '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
    '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
    '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
    'opacity: ' + props.o,
    'width: ' + props.w + 'px',
    'height: ' + props.h + 'px',
    'background: ' + props.cm + '(' + props.c.r + ', ' + props.c.g + ', ' + props.c.b + ')'
  ].join(';');
};

exports.FlowFieldMarker = FlowFieldMarker;
/** 
    A module representing a FlowField.
    @module FlowField
 */

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
}

/**
 * Builds a FlowField. 
 */ 
FlowField.prototype.build = function() {

  'use strict';

  var i, max, col, colMax, row, rowMax, x, y, theta, fieldX, fieldY, field, angle,
      vectorList = {},
      world = exports.world,
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
      field = exports.PVector.create(fieldX, fieldY);
      vectorList[col][row] = field;
      angle = exports.Utils.radiansToDegrees(Math.atan2(fieldY, fieldX)); // get the angle of the vector
      
      if (this.createMarkers) {

        var ffm = new exports.FlowFieldMarker({ // create the marker
          location: exports.PVector.create(x, y),
          scale: 1,
          opacity: exports.Utils.map(angle, -360, 360, 0.1, 1),
          width: this.resolution,
          height: this.resolution/2,
          field: field,
          angle: angle,
          colorMode: "rgb",
          color: {
            r: 200,
            g: 100,
            b: 50
          }
        });
      }
      yoff += parseFloat(this.perlinSpeed);
    }
    xoff += parseFloat(this.perlinSpeed);
  }
  this.field = vectorList;
};

exports.FlowField = FlowField;
/** 
    A module representing a Connector.
    @module Connector
 */

/**
 * Creates a new Connector.
 *
 * @constructor
 * @extends Mover 
 * @param {Object} [opt_options] Options.
 * @param {Object} [opt_options.color = {r: 255, g: 0, b: 0}] Color.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 1] Height.
 * @param {Object} [opt_options.parentA = null] The parent A object.
 * @param {Object} [opt_options.parentB = null] The parent B object. 
 */
function Connector(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.color = options.color || {r: 255, g: 0, b: 0};
  this.zIndex = options.zIndex || 0;
  this.opacity = options.opacity || 0.25;
  this.width = options.width || 10;
  this.height = options.height || 1;
  this.parentA = options.parentA || null;
  this.parentB = options.parentB || null;
}
exports.Utils.inherit(Connector, exports.Mover);
/**
 * Called every frame, step() updates the instance's properties.
 */  
Connector.prototype.step = function() {

  'use strict';

  var a = this.parentA.location, b = this.parentB.location;
  
  this.width = Math.floor(exports.PVector.PVectorSub(this.parentA.location, this.parentB.location).mag());
  this.location = exports.PVector.PVectorAdd(this.parentA.location, this.parentB.location).div(2); // midpoint = (v1 + v2)/2
  this.angle = exports.Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};

exports.Connector = Connector;  
/** 
    A module representing a Point.
    @module Point
 */

/**
 * Creates a new Point.
 *
 * @constructor
 * @extends Mover 
 * @param {Object} [opt_options] Options.
 * @param {Object} [opt_options.color = {r: 0, g: 255, b: 0}] Color.
 * @param {number} [opt_options.zIndex = 0] zIndex.
 * @param {number} [opt_options.opacity = 0.25] Opacity.
 * @param {number} [opt_options.width = 5] Width.
 * @param {number} [opt_options.height = 5] Height.
 * @param {boolean} [opt_options.isStatic = true] If true, object will not move. 
 */
function Point(opt_options) {

  'use strict';

  var options = opt_options || {};

  exports.Mover.call(this, options);

  this.color = {r: 0, g: 255, b: 0};
  this.zIndex = options.zIndex || 0;
  this.opacity = options.opacity || 0.25;
  this.width = options.width || 5;
  this.height = options.height || 5;
  this.isStatic = options.isStatic || true;
}
exports.Utils.inherit(Point, exports.Mover);
exports.Point = Point;
/**
 * Creates a new Stats object.
 *
 * @author mr.doob / http://mrdoob.com/
 * @constructor
 */
function Stats() {

  'use strict';

  var _container, _bar, _mode = 0, _modes = 2,
  _frames = 0, _time = Date.now(), _timeLastFrame = _time, _timeLastSecond = _time,
  _fps = 0, _fpsMin = 1000, _fpsMax = 0, _fpsDiv, _fpsText, _fpsGraph,
  _fpsColors = [ [ 16, 16, 48 ], [ 0, 255, 255 ] ],
  _ms = 0, _msMin = 1000, _msMax = 0, _msDiv, _msText, _msGraph,
  _msColors = [ [ 16, 48, 16 ], [ 0, 255, 0 ] ];

  _container = document.createElement( 'div' );
  _container.style.cursor = 'pointer';
  _container.style.width = '80px';
  _container.style.opacity = '0.9';
  _container.style.zIndex = '10001';
  _container.addEventListener( 'mousedown', function ( event ) {

    event.preventDefault();

    _mode = ( _mode + 1 ) % _modes;

    if (_mode === 0) {
      _fpsDiv.style.display = 'block';
      _msDiv.style.display = 'none';
    } else {
      _fpsDiv.style.display = 'none';
      _msDiv.style.display = 'block';
    }
  }, false );

  // fps

  _fpsDiv = document.createElement( 'div' );
  _fpsDiv.style.textAlign = 'left';
  _fpsDiv.style.lineHeight = '1.2em';
  _fpsDiv.style.backgroundColor = 'rgb(' + Math.floor( _fpsColors[ 0 ][ 0 ] / 2 ) + ',' + Math.floor( _fpsColors[ 0 ][ 1 ] / 2 ) + ',' + Math.floor( _fpsColors[ 0 ][ 2 ] / 2 ) + ')';
  _fpsDiv.style.padding = '0 0 3px 3px';
  _container.appendChild( _fpsDiv );

  _fpsText = document.createElement( 'div' );
  _fpsText.style.fontFamily = 'Helvetica, Arial, sans-serif';
  _fpsText.style.fontSize = '9px';
  _fpsText.style.color = 'rgb(' + _fpsColors[ 1 ][ 0 ] + ',' + _fpsColors[ 1 ][ 1 ] + ',' + _fpsColors[ 1 ][ 2 ] + ')';
  _fpsText.style.fontWeight = 'bold';
  _fpsText.innerHTML = 'FPS';
  _fpsDiv.appendChild( _fpsText );

  _fpsGraph = document.createElement( 'div' );
  _fpsGraph.style.position = 'relative';
  _fpsGraph.style.width = '74px';
  _fpsGraph.style.height = '30px';
  _fpsGraph.style.backgroundColor = 'rgb(' + _fpsColors[ 1 ][ 0 ] + ',' + _fpsColors[ 1 ][ 1 ] + ',' + _fpsColors[ 1 ][ 2 ] + ')';
  _fpsDiv.appendChild( _fpsGraph );

  while ( _fpsGraph.children.length < 74 ) {
    _bar = document.createElement( 'span' );
    _bar.style.width = '1px';
    _bar.style.height = '30px';
    _bar.style.cssFloat = 'left';
    _bar.style.backgroundColor = 'rgb(' + _fpsColors[ 0 ][ 0 ] + ',' + _fpsColors[ 0 ][ 1 ] + ',' + _fpsColors[ 0 ][ 2 ] + ')';
    _fpsGraph.appendChild( _bar );
  }

  // ms

  _msDiv = document.createElement( 'div' );
  _msDiv.style.textAlign = 'left';
  _msDiv.style.lineHeight = '1.2em';
  _msDiv.style.backgroundColor = 'rgb(' + Math.floor( _msColors[ 0 ][ 0 ] / 2 ) + ',' + Math.floor( _msColors[ 0 ][ 1 ] / 2 ) + ',' + Math.floor( _msColors[ 0 ][ 2 ] / 2 ) + ')';
  _msDiv.style.padding = '0 0 3px 3px';
  _msDiv.style.display = 'none';
  _container.appendChild( _msDiv );

  _msText = document.createElement( 'div' );
  _msText.style.fontFamily = 'Helvetica, Arial, sans-serif';
  _msText.style.fontSize = '9px';
  _msText.style.color = 'rgb(' + _msColors[ 1 ][ 0 ] + ',' + _msColors[ 1 ][ 1 ] + ',' + _msColors[ 1 ][ 2 ] + ')';
  _msText.style.fontWeight = 'bold';
  _msText.innerHTML = 'MS';
  _msDiv.appendChild( _msText );

  _msGraph = document.createElement( 'div' );
  _msGraph.style.position = 'relative';
  _msGraph.style.width = '74px';
  _msGraph.style.height = '30px';
  _msGraph.style.backgroundColor = 'rgb(' + _msColors[ 1 ][ 0 ] + ',' + _msColors[ 1 ][ 1 ] + ',' + _msColors[ 1 ][ 2 ] + ')';
  _msDiv.appendChild( _msGraph );

  while ( _msGraph.children.length < 74 ) {
    _bar = document.createElement( 'span' );
    _bar.style.width = '1px';
    _bar.style.height = Math.random() * 30 + 'px';
    _bar.style.cssFloat = 'left';
    _bar.style.backgroundColor = 'rgb(' + _msColors[ 0 ][ 0 ] + ',' + _msColors[ 0 ][ 1 ] + ',' + _msColors[ 0 ][ 2 ] + ')';
    _msGraph.appendChild( _bar );
  }

  var _updateGraph = function (dom, value) {
    var child = dom.appendChild( dom.firstChild );
    child.style.height = value + 'px';
  };

  return {
    getDomElement: function() {
      return _container;
    },
    getFps: function() {
      return _fps;
    },
    getFpsMin: function() {
      return _fpsMin;
    },
    getFpsMax: function() {
      return _fpsMax;
    },
    getMs: function() {
      return _ms;
    },
    getMsMin: function() {
      return _msMin;
    },
    getMsMax: function() {
      return _msMax;
    },
    update: function() {

      _time = Date.now();

      _ms = _time - _timeLastFrame;
      _msMin = Math.min( _msMin, _ms );
      _msMax = Math.max( _msMax, _ms );

      _msText.textContent = _ms + ' MS (' + _msMin + '-' + _msMax + ')';
      _updateGraph( _msGraph, Math.min( 30, 30 - ( _ms / 200 ) * 30 ) );

      _timeLastFrame = _time;

      _frames ++;

      if (_time > _timeLastSecond + 1000) {

        _fps = Math.round((_frames * 1000) / (_time - _timeLastSecond));
        _fpsMin = Math.min( _fpsMin, _fps );
        _fpsMax = Math.max( _fpsMax, _fps );

        _fpsText.textContent = _fps + ' FPS (' + _fpsMin + '-' + _fpsMax + ')';
        _updateGraph( _fpsGraph, Math.min( 30, 30 - ( _fps / 100 ) * 30 ) );

        _timeLastSecond = _time;
        _frames = 0;
      }
    }
  };
}
exports.Stats = Stats;
