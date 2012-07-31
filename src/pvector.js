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