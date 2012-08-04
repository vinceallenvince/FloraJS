/** 
    A module representing Utils.
    @module Utils
 */

/**
 * @namespace
 * @alias module:Utils
 */
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