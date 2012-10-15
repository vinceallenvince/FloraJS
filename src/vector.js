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
 * Subtract two vectors. Uses clone to avoid affecting the values of the vectors.
 *
 * @returns {Object} A vector.
 */
Vector.VectorSub = function(v1, v2) {
  'use strict';
  return new Vector(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Add two vectors. Uses clone to avoid affecting the values of the vectors.
 *
 * @returns {Object} A vector.
 */
Vector.VectorAdd = function(v1, v2) {
  'use strict';
  return new Vector(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Multiply a vector by a scalar value. Uses clone to avoid affecting the values of the vectors.
 *
 * @returns {Object} A vector.
 */
Vector.VectorMult = function(v, n) {
  'use strict';
  return new Vector(v.x * n, v.y * n);
};

/**
 * Divide two vectors. Uses clone to avoid affecting the values of the vectors.
 *
 * @returns {Object} A vector.
 */
Vector.VectorDiv = function(v1, v2) {
  'use strict';
  return new Vector(v1.x / v2.x, v1.y / v2.y);
};

/**
 * Get the midpoint between two vectors. Uses clone to avoid affecting the values of the vectors.
 *
 * @returns {Object} A vector.
 */
Vector.VectorMidPoint = function(v1, v2) {
  'use strict';
  return this.VectorAdd(v1, v2).div(2); // midpoint = (v1 + v2)/2
};

/**
 * Get the angle between two vectors.
 *
 * @returns {Object} A vector.
 */
Vector.VectorAngleBetween = function(v1, v2) {
  'use strict';
  var dot = v1.dot(v2),
  theta = Math.acos(dot / (v1.mag() * v2.mag()));
  return theta;
};

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
 * @returns {Object} This vector.
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
 * Calulates the midpoint between two vectors.
 *
 * @param {Object} v1 The first vector.
 * @param {Object} v1 The second vector.
 * @returns {Object} A vector representing the midpoint between the passed vectors.
 */
Vector.prototype.midpoint = function(v1, v2) {
  'use strict';
  return this.VectorAdd(v1, v2).div(2);
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