/*!
This is the license.
*/
/* Build time: July 29, 2012 05:22:54 */
/** @namespace */
var Flora = {},
    exports = Flora;

(function(exports){
  
  /**
   * Creates a new FloraSystem.
   * @namespace
   * @constructor
   */
  function FloraSystem (el) {

    this.el = el || null;
    
    Flora.elements = [];
    Flora.liquids = [];
    Flora.repellers = [];
    Flora.attractors = [];
    Flora.heats = [];
    Flora.colds = [];
    Flora.lights = [];
    Flora.oxygen = [];
    Flora.food = [];
    Flora.predators = [];

    Flora.World = new Flora.World();
    Flora.World.configure(); // call configure after DOM has loaded
    Flora.elements.push(Flora.World);

    Flora.Camera = new Flora.Camera();

    Flora.destroyElement = function (id) {

      var i, max;

      for (i = 0, max = this.elements.length; i < max; i += 1) {
        if (this.elements[i].id === id) {
          Flora.World.el.removeChild(this.elements[i].el);
          this.elements.splice(i, 1);
          break;
        }
      }
    }
    
    Flora.interval = setInterval(function () {
      
      var i, max;

      for (i = Flora.elements.length - 1; i >= 0; i -= 1) {
        Flora.elements[i].step();
        if (Flora.elements[i]) {
          Flora.elements[i].draw();
        }
        if (Flora.World.clock) {
          Flora.World.clock += 1;
        }
      }
    }, 16);

  };

  /**
   * Starts a FloraSystem.
   * @param {function} func A list of instructions to execute when the system starts.
   */
  FloraSystem.prototype.start = function (func) {
    var func = Flora.Interface.getDataType(func) === "function" ? func : function () {}; 
    func.call();
  };

  exports.FloraSystem = FloraSystem;
}(exports));
/*global exports*/
(function(exports) {

  /** @namespace */
  Utils = (function () {

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
          Log.message('Error: Utils.degreesToRadians is missing degrees param.');
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
          Log.message("Error: Utils.radiansToDegrees is missing radians param.");
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
       * Returns an new object with all properties and methods of the 
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
          } 
        } else if (target.attachEvent) { // IE
          this.addEventHandler = function(target, eventType, handler) {
            target.attachEvent("on" + eventType, handler);
          }
        }
        this.addEventHandler(target, eventType, handler);
      }
    };
  }());
  exports.Utils = Utils;
}(exports));
/*global exports*/
(function(exports) {

  /** @namespace */
  PVector = (function() {

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
        m = this.mag();
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
}(exports));
 /*global exports*/
(function(exports) {

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

   /** @namespace */
  SimplexNoise = (function (r) {
    
    if (r == undefined) {
      r = Math;
    }
    var grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
    var p = [];
    for (var i = 0; i < 256; i += 1) {
      p[i] = Math.floor(r.random()*256);
    }
    // To remove the need for index wrapping, double the permutation table length 
    var perm = []; 
    for(var i = 0; i < 512; i += 1) {
      perm[i]=p[i & 255];
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
        if(t0<0) n0 = 0.0; 
        else { 
        t0 *= t0; 
        n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient 
        } 
        var t1 = 0.5 - x1*x1-y1*y1; 
        if(t1<0) n1 = 0.0; 
        else { 
        t1 *= t1; 
        n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); 
        }
        var t2 = 0.5 - x2*x2-y2*y2; 
        if(t2<0) n2 = 0.0; 
        else { 
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
        if(t0<0) n0 = 0.0; 
        else { 
        t0 *= t0; 
        n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0); 
        }
        var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1; 
        if(t1<0) n1 = 0.0; 
        else { 
        t1 *= t1; 
        n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1); 
        } 
        var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2; 
        if(t2<0) n2 = 0.0; 
        else { 
        t2 *= t2; 
        n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2); 
        } 
        var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3; 
        if(t3<0) n3 = 0.0; 
        else { 
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
      return .1;
    }
  }));
  exports.SimplexNoise = SimplexNoise;
}(exports));
/*global exports*/
(function(exports) {

  /** @namespace */
  Interface = (function () {
    
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
    }
    }());
  exports.Interface = Interface;
}(exports));
/*global exports*/
(function(exports) {

  /** @namespace */
  World = (function() {
    
    /**
     * Creates a new World.
     *
     * @contructor
     */
    function World(opt_options) {

      var me = this, options = opt_options || {};
      
      this.c = options.c || this.c;
      this.gravity = options.gravity || this.gravity;
      this.wind =  options.wind || this.wind;
      this.location = options.location || this.location;
      this.showStats = options.showStats || this.showStats;

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
      
    };
    
    /**
     * Configures a new World.
     */
    World.prototype.configure = function() { // should be called after doc ready()
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
    World.prototype.update = function(props) {
      var i, key, props = Interface.getDataType(props) === "object" ? props : {}; 
      for (key in props) {
        if (props.hasOwnProperty(key)) {
          this[key] = props[key];
        }
      }

      if (props.el) { // if updating the element; update the width and height
        this.width = parseInt(this.el.style.width.replace("px", ""));
        this.height = parseInt(this.el.style.height.replace("px", ""));
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

      var i, max, elementLoc, controlCamera,
        windowWidth = $(window).width(),
        windowHeight = $(window).height();
      
      // check of any elements control the camera
      for (i = 0, max = Flora.elements.length; i < max; i += 1) {
        if (Flora.elements[i].controlCamera) {
          controlCamera = true;
          break;
        }
      }

      // loop thru elements
      if (!controlCamera) {
        for (i = 0, max = Flora.elements.length; i < max; i += 1) {
          
          elementLoc = Flora.elements[i].location; // recalculate location
          
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
      var e = arguments[0];
      if (window.orientation === 0) {
        if (this.isTopDown) {
          this.gravity = PVector.create(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y * -1); // portrait
        } else {
          this.gravity = PVector.create(e.accelerationIncludingGravity.x, (e.accelerationIncludingGravity.z + 7.5) * 2); // portrait 45 degree angle
        }
      } else if (window.orientation === -90) {
        this.gravity = PVector.create(e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.x );
      } else {
        this.gravity = PVector.create(e.accelerationIncludingGravity.y * -1, e.accelerationIncludingGravity.x * -1);
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
      
      stats = new Stats();

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
      clearInterval(this.statsInterval);
      document.body.removeChild(document.getElementById('stats'));
    }

    /**
     * Called every frame, step() updates the world's properties.
     */ 
    World.prototype.step = function() {};
    
    /**
     * Called every frame, draw() renders the world.
     */ 
    World.prototype.draw = function() {
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
    
    /**
     * Set to true to render mr doob stats on startup. default: false
     */ 
    World.prototype.showStats = false;

    /**
     * Holds a reference to the interval used by mr doob's stats monitor. default: 0
     */
    World.prototype.statsInterval = 0;

    /**
     * Increments each frame. default: 0
     */   
    World.prototype.clock = 0;

    /**
     * Coefficient of friction. default: 0.01
     */ 
    World.prototype.c = 0.01;

    /**
     * Gravity. default: {x: 0, y: 1}
     */     
    World.prototype.gravity = PVector.create(0, 1);

    /**
     * Wind. default: {x: 0, y: 0}
     */ 
    World.prototype.wind = PVector.create(0, 0);

    /**
     * Initial location. default: {x: 0, y: 0}
     */
    World.prototype.location = PVector.create(0, 0);
    
    return World;
    
  }());
  exports.World = World;
}(exports));
/*global exports*/
(function(exports) {

  /**
   * Creates a new Camera.
   *
   * @constructor
   * @param {Object} [opt_options]
   * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location.
   * @param {Object} [opt_options.controlObj = null] The object that controls the camera.
   */   
  function Camera (opt_options) {

    var options = opt_options || {};

    this.location = options.location || Flora.PVector.create(0, 0);
    this.controlObj = options.controlObj || null;
  };

  exports.Camera = Camera;
}(exports));
/*global exports*/
/** @module Obj */
(function(exports) { 
    
  /**
   * Creates a new Obj. All Flora elements extend Obj.
   * @constructor
   * @alias module:Obj
   */ 
  function Obj() {
    var i, max, key, prop;
    for (i = 0, max = arguments.length; i < max; i += 1) {
      prop = arguments[i];
      for (key in prop) {
        if (prop.hasOwnProperty(key)) {
          this[key] = prop[key];
        }
      }
    }
  };

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
    this.isMouseOut = false;
    //clearInterval(this.myInterval);
  };

  /**
   * Called by a mousedown event listener.
   *
   * @param {Object} e The event object passed by the listener.
   */ 
  Obj.mousedown = function(e) {

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

    var x, y,
      worldOffset = $(".world").offset();

    if (this.isPressed) {

      this.isMouseOut = false;

      x = e.pageX - worldOffset.left;
      y = e.pageY - worldOffset.top;

      this.item.location = PVector.create(x, y);

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
    this.isPressed = false;
    //this.item.trigger("saveCurrentPosition");
  };

  /**
   * Called by a mouseleave event listener.
   *
   * @param {Object} e The event object passed by the listener.
   */     
  Obj.mouseleave = function(e) {

    var me = this,
      item = this.item,
      x, y,
      worldOffset = $(".world").offset();

    if (this.isPressed) {
      this.isMouseOut = true;
      this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up


        if (me.isPressed && me.isMouseOut) {

          x = Flora.World.mouseX - worldOffset.left;
          y = Flora.World.mouseY - worldOffset.top;

          item.location = PVector.create(x, y);

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

    if (v && nose) { // if this object has a velocity; fade in nose relative to velocity
      nose.style.opacity = Utils.map(v.mag(), 0, this.maxSpeed, 0.25, 1);
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
  }
  exports.Obj = Obj;
}(exports));
/*global exports*/
(function(exports) {  

  /**
   * Creates a new Mover.
   *
   * @constructor
   * @extends Obj
   * @param {Object} options
   * @param {string} options.id
   * @param {Object} options.el
   */ 
  function Mover(opt_options) {
    //Mover.__super__.constructor.apply(this, arguments);

    var options = opt_options || {}, i, max, evt;

    this.id = options.id || "m-" + Mover.idCount; // if no id, create one

    if (options.view && Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
      this.el = options.view.call();
    } else if (Interface.getDataType(options.view) === "object") { // if view is supplied and is an object
      this.el = options.view;
    } else {
      this.el = document.createElement("div");
    }
    
    // optional
    this.className = options.className || this.className;
    this.mass = options.mass || this.mass;  
    this.maxSpeed = options.maxSpeed || this.maxSpeed;
    this.minSpeed = options.minSpeed || this.minSpeed;
    this.scale = options.scale || this.scale;   
    this.angle = options.angle || this.angle;   
    this.opacity = options.opacity || this.opacity;   
    this.lifespan = options.lifespan || this.lifespan;    
    this.width = options.width || this.width; 
    this.height = options.height || this.height;    
    this.colorMode = options.colorMode || this.colorMode;     
    this.color = options.color || this.color;
    this.zIndex = options.zIndex || this.zIndex;  
    this.pointToDirection = options.pointToDirection || this.pointToDirection;      
    this.followMouse = options.followMouse || this.followMouse;     
    this.isStatic = options.isStatic || this.isStatic;    
    this.checkEdges = options.checkEdges || this.checkEdges;    
    this.wrapEdges = options.wrapEdges || this.wrapEdges;   
    this.avoidEdges = options.avoidEdges || this.avoidEdges;    
    this.avoidEdgesStrength = options.avoidEdgesStrength || this.avoidEdgesStrength;    
    this.bounciness = options.bounciness || this.bounciness;    
    this.maxSteeringForce = options.maxSteeringForce || this.maxSteeringForce;  
    this.flocking = options.flocking || this.flocking;  
    this.desiredSeparation = options.desiredSeparation || this.desiredSeparation;
    this.separateStrength = options.separateStrength || this.separateStrength;  
    this.alignStrength = options.alignStrength || this.alignStrength;     
    this.cohesionStrength = options.cohesionStrength || this.cohesionStrength;      
    this.sensors = options.sensors || this.sensors;
    this.flowField = options.flowField || this.flowField;
    this.beforeStep = options.beforeStep || this.beforeStep;    
    this.afterStep = options.afterStep || this.afterStep;   
    this.acceleration = options.acceleration || exports.PVector.create(0, 0);
    this.velocity = options.velocity || exports.PVector.create(0, 0);
    this.location = options.location || exports.PVector.create(Flora.World.width/2, Flora.World.height/2);

    exports.elements.push(this); // push new instance of Mover

    exports.World.el.appendChild(this.el); // append the view to the World
    
    Mover.idCount += 1; // increment id
    
  };
  exports.Utils.inherit(Mover, exports.Obj);
 
  /**
   * Creates a new Mover instance and appends it to Flora.elements.
   *
   * @param {Object} [opt_options] Mover options.
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

  Mover.create = function(opt_options) {
    
    var inst, options = opt_options || {}, i, max, evt;

    options.id = options.id || "m-" + Mover.idCount; // if no id, create one

    if (options.view && Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
      options.el = options.view.call();
    } else if (Interface.getDataType(options.view) === "object") { // if view is supplied and is an object
      options.el = options.view;
    } else {
      options.el = document.createElement("div");
    }
    
    inst = new this(options); // create Mover instance
    inst.el.id = options.id; // assign id to element
    inst.el.className = inst.className; // assign className to element

    Flora.elements.push(inst); // push new instance of Mover

    /*inst.el.addEventListener("mouseenter", function (e) { Obj.mouseenter.call(inst, e); }, false);
    inst.el.addEventListener("mousedown", function (e) { Obj.mousedown.call(inst, e); }, false);
    inst.el.addEventListener("mousemove", function (e) { Obj.mousemove.call(inst, e); }, false);
    inst.el.addEventListener("mouseup", function (e) { Obj.mouseup.call(inst, e); }, false);
    inst.el.addEventListener("mouseleave", function (e) { Obj.mouseleave.call(inst, e); }, false);*/
    
    Flora.World.el.appendChild(inst.el); // append the view to the World
    
    if (inst.className === "liquid") {
      Flora.liquids.push(inst); // push new instance of liquids to liquid list
    } else if (inst.className === "repeller") {
      Flora.repellers.push(inst); // push new instance of repeller to repeller list
    } else if (inst.className === "attractor") {
      Flora.attractors.push(inst); // push new instance of attractor to attractor list
    } else if (inst.className === "heat") {
      Flora.heats.push(inst);
    } else if (inst.className === "cold") {
      Flora.colds.push(inst);
    } else if (inst.className === "predator") {
      Flora.predators.push(inst);
    } else if (inst.className === "light") {
      Flora.lights.push(inst);
    } else if (inst.className === "oxygen") {
      Flora.oxygen.push(inst);
    } else if (inst.className === "food") {
      Flora.food.push(inst);
    }
    
    Mover.idCount += 1; // increment id

    if (inst.controlCamera) { // if this object controls the camera
      Flora.Camera.controlObj = inst;
      // need to position world so controlObj is centered on screen
      Flora.World.location.x = -Flora.World.width/2 + $(window).width()/2 + (Flora.World.width/2 - inst.location.x);
      Flora.World.location.y = -Flora.World.height/2 + $(window).height()/2 + (Flora.World.height/2 - inst.location.y);
    }
    
    return Flora.elements[Flora.elements.length - 1];
  };
  
  /**
   * Increments as each Mover is created.
   * @type number
   * @default 0
   */
  Mover.idCount = 0;
  

  /**
   * Called every frame, step() updates the instance's properties.
   */   
  Mover.prototype.step = function() {

    var i, max, dir, friction, force, nose,
      world = Flora.World;
    
    //
    
    if (this.beforeStep) {
      this.beforeStep.apply(this);
    }
    
    //
      
    if (!this.isStatic && !this.isPressed) {

      // APPLY FORCES -- start

      if (Flora.liquids.length > 0) { // liquid
        for (i = 0, max = Flora.liquids.length; i < max; i += 1) {
          if (this.id !== Flora.liquids[i].id && this.isInside(Flora.liquids[i])) {
            force = this.drag(Flora.liquids[i]);
            this.applyForce(force);
          }
        }
      }
      
      if (Flora.repellers.length > 0) { // repeller
        for (i = 0, max = Flora.repellers.length; i < max; i += 1) {
          if (this.id !== Flora.repellers[i].id) {
            force = this.attract(Flora.repellers[i]);
            this.applyForce(force);
          }
        }
      }
      
      if (Flora.attractors.length > 0) { // repeller
        for (i = 0, max = Flora.attractors.length; i < max; i += 1) {
          if (this.id !== Flora.attractors[i].id) {
            force = this.attract(Flora.attractors[i]);
            this.applyForce(force);
          }
        }
      }
      
      if (this.sensors.length > 0) { // Sensors
        for (i = 0, max = this.sensors.length; i < max; i += 1) {
          
          var sensor = this.sensors[i];
          
          var r = sensor.length; // use angle to calculate x, y
          var theta = Utils.degreesToRadians(this.angle + sensor.offsetAngle);
          var x = r * Math.cos(theta);
          var y = r * Math.sin(theta);
          
          sensor.location.x = this.location.x;
          sensor.location.y = this.location.y;
          sensor.location.add(exports.PVector.create(x, y)); // position the sensor
          
          if (sensor.activated) {
            this.applyForce(sensor.getActivationForce({
              mover: this
            }))
          }
          
        }
      }
      
      if (world.c) { // friction
        friction = Utils.clone(this.velocity);
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
        this.flock(Flora.elements);
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
        if (this.velocity.mag() > .1) {
          this.angle = Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
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
  }
  
  /**
   * Applies a force to this object's acceleration.
   *
   * @param {Object} force The force to be applied (expressed as a vector).
   */   
  Mover.prototype.applyForce = function(force) {

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
    
    var world = Flora.World,
      desiredVelocity = exports.PVector.PVectorSub(target.location, this.location),
      distanceToTarget = desiredVelocity.mag();

    desiredVelocity.normalize();
    
    if (distanceToTarget < world.width/2) {
      var m = Utils.map(distanceToTarget, 0, world.width/2, 0, this.maxSpeed);
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
    var speed = this.velocity.mag(),
      dragMagnitude = -1 * target.c * speed * speed, // drag magnitude
      drag = Utils.clone(this.velocity);

    drag.normalize(); // drag direction
    drag.mult(dragMagnitude);

    return drag;
  }

  /**
   * Calculates a force to apply to simulate attraction on an object.
   *
   * @param {Object} attractor The attracting object.
   * @returns {Object} A force to apply.
   */     
  Mover.prototype.attract = function(attractor) {

    var force = exports.PVector.PVectorSub(attractor.location, this.location),
      distance, strength;

    distance = force.mag();
    distance = Utils.constrain(distance, attractor.mass/4, attractor.mass/2); // min = scale/16 (totally arbitrary); max = 1/2 the size of the attractor
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
      if (this.location.x + this.width/2 > container.location.x - container.width/2 
        && this.location.x - this.width/2 < container.location.x + container.width/2 
        && this.location.y + this.height/2 > container.location.y - container.height/2 
        && this.location.y - this.height/2 < container.location.y + container.height/2) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determines if this object is outside the world bounds.
   *
   * @param {Object} world The world object.
   * @returns {boolean} Returns true if the object is outside the world.
   */     
  Mover.prototype.checkWorldEdges = function(world) {

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
        } else if (this.location.x > Flora.World.width - this.avoidEdgesStrength) {
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
        } else if (this.location.y > Flora.World.height - this.avoidEdgesStrength) {
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
      Flora.World.location.add(diff); // !! do we need this? // add the distance difference to World.location
    }

    return check;
  }

  /**
   * Moves the world in the opposite direction of the Camera's controlObj.
   *
   * @param {Object} world The world object.
   * @returns {boolean} Returns true if the object is outside the world.
   */     
  Mover.prototype.checkCameraEdges = function() {

    var vel = this.velocity.clone();

    Flora.World.location.add(vel.mult(-1));
  }

  /**
   * Returns this object's location.
   *
   * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                            Accepts 'x', 'y' to return their respective values.
   * @returns {boolean} Returns true if the object is outside the world.
   */ 
  Mover.prototype.getLocation = function (type) {
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
    if (!type) {
      return exports.PVector.create(this.velocity.x, this.velocity.y);
    } else if (type === "x") {
      return this.velocity.x;
    } else if (type === "y") {
      return this.velocity.y;
    }
  };
  
  Mover.prototype.className = 'mover';
  Mover.prototype.mass = 10;  
  Mover.prototype.maxSpeed = 10;    
  Mover.prototype.minSpeed = 0;
  Mover.prototype.scale = 1;    
  Mover.prototype.angle = 0;    
  Mover.prototype.opacity = 0.85;   
  Mover.prototype.lifespan = -1;    
  Mover.prototype.width = 20;
  Mover.prototype.height = 20;    
  Mover.prototype.colorMode = 'rgb';    
  Mover.prototype.color = {
    r: 197,
    g: 177,
    b: 115
  };      
  Mover.prototype.zIndex = 10;    
  Mover.prototype.pointToDirection = true;    
  Mover.prototype.followMouse = false;      
  Mover.prototype.isStatic = false;   
  Mover.prototype.checkEdges = true;    
  Mover.prototype.wrapEdges = false;    
  Mover.prototype.avoidEdges = false; 
  Mover.prototype.avoidEdgesStrength = 200;   
  Mover.prototype.bounciness = 0.75;    
  Mover.prototype.maxSteeringForce = 10;    
  Mover.prototype.flocking = false;   
  Mover.prototype.desiredSeparation = Mover.prototype.width * 2;  
  Mover.prototype.separateStrength = 1;   
  Mover.prototype.alignStrength = 1;      
  Mover.prototype.cohesionStrength = 1;   
  Mover.prototype.sensors = [];
  Mover.prototype.flowField = null; 
  Mover.prototype.beforeStep = '';    
  Mover.prototype.afterStep = ''; 

  exports.Mover = Mover;
}(exports));
