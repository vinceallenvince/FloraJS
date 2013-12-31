/*! Burner v2.1.5 - 2013-12-07 05:12:29 
 *  Vince Allen 
 *  Brooklyn, NY 
 *  vince@vinceallen.com 
 *  @vinceallenvince 
 *  License: MIT */

var Burner = {}, exports = Burner;

(function(exports) {

"use strict";

/*jshint unused:false */
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

  this.name = 'StatsDisplay';

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
  this.el.style.backgroundColor = 'black';
  this.el.style.color = 'white';
  this.el.style.fontFamily = 'Helvetica';
  this.el.style.padding = '0.5em';
  this.el.style.opacity = '0.5';

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
  labelContainer.style.marginLeft = '0.5em';
  label = document.createTextNode('total elements: ');
  labelContainer.appendChild(label);
  this.el.appendChild(labelContainer);

  // create textNode for totalElements
  this._totalElementsValue = document.createTextNode('0');
  this.el.appendChild(this._totalElementsValue);

  // create fps label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  labelContainer.style.marginLeft = '0.5em';
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

exports.StatsDisplay = StatsDisplay;

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

/**
 * Creates a new Item.
 *
 * @param {Object} options A map of initial properties.
 * @constructor
 */
function Item(options) {

  if (!options || !options.world || typeof options.world !== 'object') {
    throw new Error('Item: A valid DOM object is required for the new Item "world" property.');
  }

  this.world = options.world;
  this.name = options.name || 'Item';
  this.id = this.name + exports.System.getNewId();

  this._force = new exports.Vector();
  this._camera = new exports.Vector();

  this.el = document.createElement('div');
  this.el.id = this.id;
  this.el.className = 'item ' + this.name.toLowerCase();
  this.el.style.visibility = 'hidden';
  this.world.el.appendChild(this.el);
}

/**
 * Resets all properties.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {Array} [opt_options.color = 0, 0, 0] Color.
 * @param {string} [opt_options.colorMode = 'rgb'] Color mode. Accepted values: 'rgb', 'hsl'.
 * @param {string} [opt_options.visibility = 'visible'] Visibility. Accepted values: 'visible', 'hidden'.
 * @param {number} [opt_options.opacity = 1] Opacity.
 * @param {number} [opt_options.zIndex = 1] zIndex.
 * @param {number} [opt_options.borderWidth = 0] borderWidth.
 * @param {string} [opt_options.borderStyle = 'none'] borderStyle.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] borderColor.
 * @param {number} [opt_options.borderRadius = 0] borderRadius.
 * @param {Object} [opt_options.boxShadowOffset = new Vector()] boxShadowOffset.
 * @param {number} [opt_options.boxShadowBlur = 0] boxShadowBlur.
 * @param {number} [opt_options.boxShadowSpread = 0] boxShadowSpread.
 * @param {string|Array} [opt_options.boxShadowColor = 'transparent'] boxShadowColor.
 * @param {number} [opt_options.bounciness = 0.8] bounciness.
 * @param {number} [opt_options.mass = 10] mass.
 * @param {Function|Object} [opt_options.acceleration = new Vector()] acceleration.
 * @param {Function|Object} [opt_options.velocity = new Vector()] velocity.
 * @param {Function|Object} [opt_options.location = new Vector()] location.
 * @param {number} [opt_options.maxSpeed = 10] maxSpeed.
 * @param {number} [opt_options.minSpeed = 10] minSpeed.
 * @param {number} [opt_options.angle = 0] Angle.
 * @param {string} [opt_options.position = 'absolute'] A css position. Possible values: 'absoulte', 'fixed', 'static', 'relative'.
 * @param {number} [opt_options.paddingTop = 0] Padding top.
 * @param {number} [opt_options.paddingRight = 0] Padding right.
 * @param {number} [opt_options.paddingBottom = 0] Padding bottom.
 * @param {number} [opt_options.paddingLeft = 0] Padding left.
 * @param {number} [opt_options.lifespan = -1] Lifespan.
 * @param {number} [opt_options.life = 0] Life.
 * @param {boolean} [opt_options.isStatic = false] If set to true, object will not move.
 * @param {boolean} [opt_options.controlCamera = false] If set to true, object controls the camera.
 * @param {Array} [opt_options.worldBounds = true, true, true, true] Defines the boundaries checked
 *    checkWorldEdges is true.
 * @param {boolean} [opt_options.checkWorldEdges = false] If set to true, system restricts object
 *    movement to world boundaries.
 * @param {boolean} [opt_options.wrapWorldEdges = false] If set to true, system checks if object
 *    intersects world boundaries and resets location to the opposite boundary.
 * @param {boolean} [opt_options.avoidWorldEdges = false] If set to true, object steers away from
 *    world boundaries.
 * @param {number} [opt_options.avoidWorldEdgesStrength = 0] The distance threshold for object
 *    start steering away from world boundaries.
 */
Item.prototype.reset = function(opt_options) {

  var i, options = opt_options || {};

  for (i in options) {
    if (options.hasOwnProperty(i)) {
      this[i] = options[i];
    }
  }

  this.width = typeof options.width === 'undefined' ? 10 : options.width;
  this.height = typeof options.height === 'undefined' ? 10 : options.height;
  this.color = options.color || [0, 0, 0];
  this.colorMode = options.colorMode || 'rgb';
  this.visibility = options.visibility || 'visible';
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || 0;
  this.boxShadowOffset = typeof options.boxShadowOffset === 'undefined' ? new exports.Vector() : options.boxShadowOffset;
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = typeof options.boxShadowColor === 'undefined' ? 'transparent' : options.boxShadowColor;

  this.bounciness = typeof options.bounciness === 'undefined' ? 0.8 : options.bounciness;
  this.mass = typeof options.mass === 'undefined' ? 10 : options.mass;
  this.acceleration = typeof options.acceleration === 'function' ? options.acceleration.call(this) :
      options.acceleration || new exports.Vector();
  this.velocity = typeof options.velocity === 'function' ? options.velocity.call(this) :
      options.velocity || new exports.Vector();
  this.location = typeof options.location === 'function' ? options.location.call(this) :
      options.location || new exports.Vector(this.world.width / 2, this.world.height / 2);
  this.initLocation = new exports.Vector();
  this.initLocation.x = this.location.x;
  this.initLocation.y = this.location.y;

  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;
  this.minSpeed = options.minSpeed || 0;
  this.angle = options.angle || 0;

  this.position = options.position || 'absolute';
  this.paddingTop = options.paddingTop || 0;
  this.paddingRight = options.paddingRight || 0;
  this.paddingBottom = options.paddingBottom || 0;
  this.paddingLeft = options.paddingLeft || 0;
  this.marginTop = options.marginTop || 0;

  this.lifespan = typeof options.lifespan === 'undefined' ? -1 : options.lifespan;
  this.life = options.life || 0;
  this.isStatic = !!options.isStatic;
  this.controlCamera = !!options.controlCamera;
  this.worldBounds = options.worldBounds || [true, true, true, true];
  this.checkWorldEdges = typeof options.checkWorldEdges === 'undefined' ? true : options.checkWorldEdges;
  this.wrapWorldEdges = !!options.wrapWorldEdges;
  this.wrapWorldEdgesSoft = !!options.wrapWorldEdgesSoft;
  this.avoidWorldEdges = !!options.avoidWorldEdges;
  this.avoidWorldEdgesStrength = typeof options.avoidWorldEdgesStrength === 'undefined' ? 50 : options.avoidWorldEdgesStrength;

  // if controlCamera is true, world is not static.
  this.world.isStatic = false;
};

/**
 * Updates properties.
 */
Item.prototype.step = function() {
  if (!this.isStatic) {
    this.applyForce(this.world.gravity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.minSpeed);
    this.location.add(this.velocity);
    if (this.controlCamera) {
      this._checkCameraEdges();
    }
    if (this.checkWorldEdges) {
      this._checkWorldEdges();
    }
    this.acceleration.mult(0);
    if (this.life < this.lifespan) {
      this.life++;
    } else if (this.lifespan !== -1) {
      exports.System.destroyItem(this);
    }
  }
};

/**
 * Adds a force to this object's acceleration.
 *
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Item.prototype.applyForce = function(force) {
  // calculated via F = m * a
  if (force) {
    this._force.x = force.x;
    this._force.y = force.y;
    this._force.div(this.mass);
    this.acceleration.add(this._force);
    return this.acceleration;
  }
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @private
 */
Item.prototype._checkWorldEdges = function() {

  var x, y, worldRight = this.world.bounds[1],
      worldBottom = this.world.bounds[2],
      worldBounds = this.worldBounds,
      location = this.location,
      velocity = this.velocity,
      width = this.width,
      height = this.height,
      bounciness = this.bounciness;

  // transform origin is at the center of the object
  if (this.wrapWorldEdgesSoft) {

    x = location.x;
    y = location.y;

    if (location.x > worldRight) {
      location.x = -(worldRight - location.x);
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    } else if (location.x < 0) {
      location.x = worldRight + location.x;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    }

    if (location.y > worldBottom) {
      location.y = -(worldBottom - location.y);
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    } else if (location.y < 0) {
      location.y = worldBottom + location.y;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    }
  } else if (this.wrapWorldEdges) {

    x = location.x;
    y = location.y;

    if (location.x > worldRight) {
      location.x = 0;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    } else if (location.x < 0) {
      location.x = worldRight;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    }

    if (location.y > worldBottom) {
      location.y = 0;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    } else if (location.y < 0) {
      location.y = worldBottom;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    }
  } else {

    if (location.x + width / 2 > worldRight && worldBounds[1]) {
      location.x = worldRight - width / 2;
      velocity.x *= -1 * bounciness;
    } else if (location.x < width / 2 && worldBounds[3]) {
      location.x = width / 2;
      velocity.x *= -1 * bounciness;
    }

    if (location.y + height / 2 > worldBottom && worldBounds[2]) {
      location.y = worldBottom - height / 2;
      velocity.y *= -1 * bounciness;
    } else if (location.y < height / 2 && worldBounds[0]) {
      location.y = height / 2;
      velocity.y *= -1 * bounciness;
    }
  }
};

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 */
Item.prototype._checkCameraEdges = function() {
  this._camera.x = this.velocity.x;
  this._camera.y = this.velocity.y;
  this.world.location.add(this._camera.mult(-1));
};

/**
 * Updates the corresponding DOM element's style property.
 */
Item.prototype.draw = function() {
  exports.System._draw(this);
};

exports.Item = Item;

/*jshint supernew:true */
/** @namespace */
var System = {
  name: 'System'
};

/**
 * Holds a transform property based on supportedFeatures.
 * @private
 */
System._stylePosition = '';

/**
 * Increments each time update() is executed.
 */
System.clock = 0;

/**
 * A map of supported browser features.
 */
System.supportedFeatures = {
  csstransforms: true,
  csstransforms3d: true
};

/**
 * Stores references to all items in the system.
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
System._worlds = {
  lookup: {},
  list: []
};

/**
 * Stores references to all items in the system.
 * @private
 */
System._caches = {};

/**
 * Used to create unique ids.
 * @private
 */
System._idCount = 0;

/**
 * Holds the current and last mouse/touch positions relative
 * to the browser window. Also, holds the current mouse velocity.
 * @public
 */
System.mouse = {
  location: new Vector(),
  lastLocation: new Vector(),
  velocity: new Vector()
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
 * Set to true log flags in a performance tracing tool.
 */
System.trace = false;

/**
 * Initializes the system and starts the update loop.
 *
 * @function init
 * @memberof System
 * @param {Function=} opt_setup Creates the initial system conditions.
 * @param {Object=} opt_world A reference to a DOM element representing the System world.
 * @param {Object=} opt_supportedFeatures A map of supported browser features.
 * @param {boolean=} opt_noStartLoop If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 */
System.init = function(opt_setup, opt_worlds, opt_supportedFeatures, opt_noStartLoop) {

  var setup = opt_setup || function () {},
      worlds = opt_worlds || new exports.World(document.body),
      supportedFeatures = opt_supportedFeatures || null,
      noStartLoop = !opt_noStartLoop ? false : true;

  // check if supportedFeatures were passed
  if (!supportedFeatures) {
    this.supportedFeatures = System._getSupportedFeatures();
  } else if (typeof supportedFeatures === 'object' &&
      typeof supportedFeatures.csstransforms !== 'undefined' &&
      typeof supportedFeatures.csstransforms3d !== 'undefined') {
    this.supportedFeatures = supportedFeatures;
  } else {
    throw new Error('System: supportedFeatures should be passed as an object.');
  }

  if (System.supportedFeatures.csstransforms3d) {
    this._stylePosition = 'transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-webkit-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-moz-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-o-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-ms-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>);';
  } else if (System.supportedFeatures.csstransforms) {
    this._stylePosition = 'transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-webkit-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-moz-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-o-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); ' +
        '-ms-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>);';
  } else {
    this._stylePosition = 'position: absolute; left: <x>px; top: <y>px;';
  }

  if (Object.prototype.toString.call(worlds) === '[object Array]') {
    for (var i = 0, max = worlds.length; i < max; i++) {
      System._addWorld(worlds[i]);
    }
  } else {
    System._addWorld(worlds);
  }

  document.body.onorientationchange = System.updateOrientation;

  // listen for resize events
  this._addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });

  // save the current and last mouse position
  this._addEvent(document, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // save the current and last touch position
  this._addEvent(window, 'touchstart', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  this._addEvent(window, 'touchmove', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  this._addEvent(window, 'touchend', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // listen for device motion events (ie. accelerometer)
  this._addEvent(window, 'devicemotion', function(e) {

    var world, worlds = System._caches.World.list,
        x = e.accelerationIncludingGravity.x,
        y = e.accelerationIncludingGravity.y;

    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      if (window.orientation === 0) {
        world.gravity.x = x;
        world.gravity.y = y * -1;
      } else if (window.orientation === -90) {
        world.gravity.x = y;
        world.gravity.y = x;
      } else {
        world.gravity.x = y * -1;
        world.gravity.y = x * -1;
      }
    }
  });

    // listen for key up
  this._addEvent(window, 'keyup', function(e) {
    System._keyup.call(System, e);
  });

  this._setup = setup;
  this._setup.call(this);

  if (!noStartLoop) {
    this._update();
  }
};

/**
 * Adds world to System records and worlds cache.
 *
 * @function _addWorld
 * @memberof System
 * @private
 * @param {Object} world A world.
 */
System._addWorld = function(world) {
  System._records.list.push(world);
  System._worlds.list.push(System._records.list[System._records.list.length - 1]);
  System._worlds.lookup[world.el.id] = System._records.list[System._records.list.length - 1];
};

/**
 * Adds an item to the system.
 *
 * @function add
 * @memberof System
 * @param {string} klass Function will try to create an instance of this class.
 * @param {Object=} opt_options Object properties.
 * @param {string=} opt_world The world to contain the item.
 */
System.add = function(klass, opt_options, opt_world) {

  var i, max, last, parentNode, pool,
      records = this._records.list,
      recordsLookup = this._records.lookup,
      options = opt_options || {};

  options.world = opt_world || records[0];

  // recycle object if one is available
  pool = this.getAllItemsByName(klass, options.world._pool);

  if (pool.length) {
    for (i = 0, max = options.world._pool.length; i < max; i++) {
      if (options.world._pool[i].name === klass) {
        records[records.length] = options.world._pool.splice(i, 1)[0];
        records[records.length - 1].options = options;
        System._updateCacheLookup(records[records.length - 1], true);
        break;
      }
    }
  } else {
    if (Burner[klass]) {
      records[records.length] = new Burner[klass](options);
    } else {
      records[records.length] = new Burner.Classes[klass](options);
    }
  }
  last = records.length - 1;
  parentNode = records[last].el.parentNode;
  recordsLookup[records[last].id] = parentNode;
  records[last].reset(options);
  records[last].init(options);
  return records[last];
};

/**
 * Starts the render loop.
 * @function start
 * @memberof System
 */
System.start = function() {
  this._update();
};

/**
 * Adds an object to a cache based on its constructor name.
 *
 * @function updateCache
 * @memberof System
 * @param {Object} obj An object.
 * returns {Object} The cache that received the passed object.
 */
System.updateCache = function(obj) {

  // Create cache object, unless it already exists
  var cache = System._caches[obj.name] ||
      (System._caches[obj.name] = {
        lookup: {},
        list: []
      });

  cache.list[cache.list.length] = obj;
  cache.lookup[obj.id] = true;
  return cache;
};

/**
 * Assigns the given 'val' to the given object's record in System._caches.
 *
 * @function _updateCacheLookup
 * @memberof System
 * @private
 * @param {Object} obj An object.
 * @param {Boolean} val True if object is active, false if object is destroyed.
 */
System._updateCacheLookup = function(obj, val) {

  var cache = System._caches[obj.name];

  if (cache) {
    cache.lookup[obj.id] = val;
  }
};

/**
 * Returns the total number of items in the system.
 *
 * @function count
 * @memberof System
 * @returns {number} Total number of items.
 */
System.count = function() {
  return this._records.list.length;
};

/**
 * Returns the first world in the system.
 *
 * @function firstWorld
 * @memberof System
 * @returns {null|Object} A world.
 */
System.firstWorld = function() {
  return this._worlds.list.length ? this._worlds.list[0] : null;
};

/**
 * Returns the last world in the system.
 *
 * @function lastWorld
 * @memberof System
 * @returns {null|Object} A world.
 */
System.lastWorld = function() {
  return this._worlds.list.length ? this._worlds.list[this._worlds.list.length - 1] : null;
};

/**
 * Returns the first item in the system.
 *
 * @function firstItem
 * @memberof System
 * @returns {Object} An item.
 */
System.firstItem = function() {
  return this._records.list[0];
};

/**
 * Returns the last item in the system.
 *
 * @function lastItem
 * @memberof System
 * @returns {Object} An item.
 */
System.lastItem = function() {
  return this._records.list[this._records.list.length - 1];
};

/**
 * Returns all worlds.
 *
 * @function getAllWorlds
 * @memberof System
 * @return {Array.<World>} An array of worlds.
 */
System.getAllWorlds = function() {
  return System._worlds.list;
};

/**
 * Iterates over objects in the system and calls step() and draw().
 *
 * @function _update
 * @memberof System
 * @private
 */
System._update = function() {

  var i, max, records = System._records.list, record, worlds, world = System.firstWorld();

  // check for resize stop
  if (System._resizeTime && new Date().getTime() - System._resizeTime > 100) {
    System._resizeTime = 0;
    worlds = System.getAllWorlds();
    for (i = 0, max = worlds.length; i < max; i++) {
      worlds[i].pauseStep = false;
    }
    if (world.afterResize) {
      world.afterResize.call(this);
    }
  }

  if (System.trace) {
    console.time('update');
  }

  // step
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step && !record.world.pauseStep) {
      record.step();
    }
  }

  if (System.trace) {
    console.timeEnd('update');
    console.time('render');
  }

  // draw
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.draw && !record.world.drawStep) {
      record.draw();
    }
  }

  if (System.trace) {
    console.timeEnd('render');
  }


  System.clock++;
  window.requestAnimFrame(System._update);
};

/**
 * Pauses the system and processes one step in records.
 *
 * @function _stepForward
 * @memberof System
 * @private
 */
System._stepForward = function() {

  var i, j, max, records = System._records.list,
      world, worlds = System.getAllWorlds();

    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      world.pauseStep = true;
      for (j = records.length - 1; j >= 0; j -= 1) {
        if (records[j].step) {
          records[j].step();
        }
      }
      for (j = records.length - 1; j >= 0; j -= 1) {
        if (records[j].draw) {
          records[j].draw();
        }
      }
    }
  System.clock++;
};

/**
 * Resets the system.
 *
 * @function _resetSystem
 * @memberof System
 * @private
 * @param {boolean} opt_noRestart= Pass true to not restart the system.
 */
System._resetSystem = function(opt_noRestart) {

  var i, max, world, worlds = System.getAllWorlds();

  for (i = 0, max = worlds.length; i < max; i++) {
    world = worlds[i];
    world.pauseStep = false;
    world.pauseDraw = false;

    while(world.el.firstChild) {
      world.el.removeChild(world.el.firstChild);
    }
  }

  System._caches = {};

  System._destroyAllItems();

  System._idCount = 0;

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };

  System._resizeTime = 0;

  if (!opt_noRestart) {
    System._setup.call(System);
  }
};

/**
 * Destroys the system.
 *
 * @function _destroySystem
 * @memberof System
 * @private
 */
System._destroySystem = function() {
  this._resetSystem(true);
  this._destroyAllWorlds();
  this.clock = 0;
  this._idCount = 0;
};

/**
 * Removes all items in all worlds.
 *
 * @function _destroyAllItems
 * @memberof System
 * @private
 */
System._destroyAllItems = function() {

  var i, items = this._records.list;

  for (i = items.length - 1; i >= 0; i--) {
    if (items[i].name !== 'World') {
      items.splice(i, 1);
    }
  }
};

/**
 * Removes all worlds.
 *
 * @function _destroyAllWorlds
 * @memberof System
 * @private
 */
System._destroyAllWorlds = function() {

  var i, item, items = this._records.list;

  for (i = items.length - 1; i >= 0; i--) {
    item = items[i];
    if (item.name === 'World') {
      item.el.parentNode.removeChild(item.el);
      items.splice(i, 1);
    }
  }
  this._worlds = {
    lookup: {},
    list: []
  };
};

/**
 * Removes an item from a world.
 *
 * @function destroyItem
 * @memberof System
 * @param {Object} obj The item to remove.
 */
System.destroyItem = function (obj) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i].id === obj.id) {
      records[i].el.style.visibility = 'hidden'; // hide item
      records[i].el.style.display = 'none';
      records[i].el.style.opacity = 0;
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      System._updateCacheLookup(obj, false);
      break;
    }
  }

  var cache = System._caches[obj.name];

  if (cache) {
    for (i = cache.list.length - 1; i >= 0; i--) {
      if (cache.list[i].id === obj.id) {
        cache.list.splice(i, 1);
        break;
      }
    }
  }
};

/**
 * Returns an array of items created from the same constructor.
 *
 * @function getAllItemsByName
 * @memberof System
 * @param {string} name The 'name' property.
 * @param {Array} [opt_list = this._records] An optional list of items.
 * @returns {Array} An array of items.
 */
System.getAllItemsByName = function(name, opt_list) {

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
 * Returns an array of items with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @function getAllItemsByAttribute
 * @memberof System
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' property must equal 'val'.
 * @returns {Array} An array of items.
 */
System.getAllItemsByAttribute = function(attr, opt_val) {

  var i, max, arr = [], records = this._records.list,
      val = typeof opt_val !== 'undefined' ? opt_val : null;

  for (i = 0, max = records.length; i < max; i++) {
    if (typeof records[i][attr] !== 'undefined') {
      if (val !== null && records[i][attr] !== val) {
        continue;
      }
      arr[arr.length] = records[i];
    }
  }
  return arr;
};

/**
 * Updates the properties of items created from the same constructor.
 *
 * @function updateItemPropsByName
 * @memberof System
 * @param {string} name The constructor name.
 * @param {Object} props A map of properties to update.
 * @returns {Array} An array of items.
 * @example
 * System.updateElementPropsByName('point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all points will turn black and double in size
 */
System.updateItemPropsByName = function(name, props) {

  var i, max, p, arr = this.getAllItemsByName(name);

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
 * Finds an item by its 'id' and returns it.
 *
 * @function getItem
 * @memberof System
 * @param {string|number} id The item's id.
 * @returns {Object} The item.
 */
System.getItem = function(id) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      return records[i];
    }
  }
  return null;
};

/**
 * Updates the properties of an item.
 *
 * @function updateItem
 * @memberof System
 * @param {Object} item The item.
 * @param {Object} props A map of properties to update.
 * @returns {Object} The item.
 * @example
 * System.updateItem(myItem, {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // item will turn black and double in size
 */
System.updateItem = function(item, props) {

  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      item[p] = props[p];
    }
  }
  return item;
};

/**
 * Repositions all items relative to the viewport size and resets the world bounds.
 *
 * @function _resize
 * @memberof System
 * @private
 */
System._resize = function() {

  var i, max, records = this._records.list, record,
      viewportSize = this.getWindowSize(),
      world, worlds = System.getAllWorlds();

  for (i = 0, max = records.length; i < max; i++) {
    record = records[i];
    if (record.name !== 'World' && record.world.boundToWindow && record.location) {
      record.location.x = viewportSize.width * (record.location.x / record.world.width);
      record.location.y = viewportSize.height * (record.location.y / record.world.height);
    }
  }

  for (i = 0, max = worlds.length; i < max; i++) {
    world = worlds[i];
    if (world.boundToWindow) {
      world.bounds = [0, viewportSize.width, viewportSize.height, 0];
      world.width = viewportSize.width;
      world.height = viewportSize.height;
      world.location = new exports.Vector((viewportSize.width / 2),
        (viewportSize.height / 2));
    }
  }
};

/**
 * Handles keyup events.
 *
 * @function _keyup
 * @memberof System
 * @private
 * @param {Object} e An event.
 */
System._keyup = function(e) {

  var i, max, world, worlds = this.getAllWorlds();

  switch(e.keyCode) {
    case 39:
      System._stepForward();
      break;
    case 80: // p; pause/play
      for (i = 0, max = worlds.length; i < max; i++) {
        world = worlds[i];
        world.pauseStep = !world.pauseStep;
      }
      break;
    case 82: // r; reset
      System._resetSystem();
      break;
    case 83: // s; reset
      System._toggleStats();
      break;
  }
};

/**
 * Increments idCount and returns the value.
 *
 * @function getNewId
 * @memberof System
 */
System.getNewId = function() {
  this._idCount++;
  return this._idCount;
};

/**
 * Adds an event listener to a DOM element.
 *
 * @function _addEvent
 * @memberof System
 * @private
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
System._addEvent = function(target, eventType, handler) {
  if (target.addEventListener) { // W3C
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) { // IE
    target.attachEvent("on" + eventType, handler);
  }
};

/**
 * Saves the mouse/touch location relative to the browser window.
 *
 * @function _recordMouseLoc
 * @memberof System
 * @private
 */
System._recordMouseLoc = function(e) {

  var touch, world = this.firstWorld();

  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  /**
   * Mapping window size to world size allows us to
   * lead an agent around a world that's not bound
   * to the window.
   */
  if (e.pageX && e.pageY) {
    this.mouse.location.x = this.map(e.pageX, 0, window.innerWidth, 0, world.width);
    this.mouse.location.y = this.map(e.pageY, 0, window.innerHeight, 0, world.height);
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = this.map(e.clientX, 0, window.innerWidth, 0, world.width);
    this.mouse.location.y = this.map(e.clientY, 0, window.innerHeight, 0, world.height);
  } else if (touch) {
    this.mouse.location.x = touch.pageX;
    this.mouse.location.y = touch.pageY;
  }

  this.mouse.velocity.x = this.mouse.lastLocation.x - this.mouse.location.x;
  this.mouse.velocity.y = this.mouse.lastLocation.y - this.mouse.location.y;
};

/**
 * Extends the properties and methods of a superClass onto a subClass.
 *
 * @function extend
 * @memberof System
 * @param {Object} subClass The subClass.
 * @param {Object} superClass The superClass.
 */
System.extend = function(subClass, superClass) {
  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
};

/**
 * Determines the size of the browser window.
 *
 * @function extend
 * @memberof System
 * @returns {Object} The current browser window width and height.
 */
System.getWindowSize = function() {

  var d = {
    'width' : false,
    'height' : false
  };

  if (typeof(window.innerWidth) !== 'undefined') {
    d.width = window.innerWidth;
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== 'undefined' &&
      typeof(document.documentElement.clientWidth) !== 'undefined') {
    d.width = document.documentElement.clientWidth;
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== 'undefined') {
    d.width = document.body.clientWidth;
    d.height = document.body.clientHeight;
  }
  return d;
};

/**
 * Handles orientation evenst and forces the world to update its bounds.
 *
 * @function updateOrientation
 * @memberof System
 */
System.updateOrientation = function() {
  setTimeout(function() {
   System._records.list[0]._setBounds();
  }, 500);
};

/**
 * Generates a psuedo-random number within a range.
 *
 * @function getRandomNumber
 * @memberof System
 * @param {number} low The low end of the range.
 * @param {number} high The high end of the range.
 * @param {boolean} [flt] Set to true to return a float.
 * @returns {number} A number.
 */
System.getRandomNumber = function(low, high, flt) {
  if (flt) {
    return Math.random()*(high-(low-1)) + low;
  }
  return Math.floor(Math.random()*(high-(low-1))) + low;
};

/**
 * Toggles stats display.
 *
 * @function _toggleStats
 * @memberof System
 * @private
 */
System._toggleStats = function() {
  if (!System._statsDisplay) {
    System._statsDisplay = new exports.StatsDisplay();
  } else if (System._statsDisplay && System._statsDisplay._active) {
    System._statsDisplay.destroy();
  } else if (System._statsDisplay && !System._statsDisplay._active) {
    System._statsDisplay = new exports.StatsDisplay();
  }
};

/**
 * Checks if the Modernizr object exists. If so, returns
 * supported transforms. If not, returns false for transforms support.
 *
 * @function _getSupportedFeatures
 * @memberof System
 * @private
 * @returns {Object} A map of supported features.
 */
System._getSupportedFeatures = function() {

  var features;

  if (window.Modernizr) {
    features = {
      csstransforms3d: Modernizr.csstransforms3d,
      csstransforms: Modernizr.csstransforms,
      touch: Modernizr.touch
    };
  } else {
    features = {
      csstransforms3d: exports.FeatureDetector.detect('csstransforms3d'),
      csstransforms: exports.FeatureDetector.detect('csstransforms'),
      touch: exports.FeatureDetector.detect('touch')
    };
  }
  return features;
};

/**
 * Re-maps a number from one range to another.
 *
 * @function map
 * @memberof System
 * @param {number} value The value to be converted.
 * @param {number} min1 Lower bound of the value's current range.
 * @param {number} max1 Upper bound of the value's current range.
 * @param {number} min2 Lower bound of the value's target range.
 * @param {number} max2 Upper bound of the value's target range.
 * @returns {number} A number.
 */
System.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @function map
 * @memberof System
 * @param {Object} obj An item.
 */
System._draw = function(obj) {

  var cssText = exports.System.getCSSText({
    x: obj.location.x - (obj.width / 2),
    y: obj.location.y - (obj.height / 2),
    angle: obj.angle,
    scale: obj.scale || 1,
    width: obj.autoWidth ? null : obj.width,
    height: obj.autoHeight ? null : obj.height,
    color0: obj.color[0],
    color1: obj.color[1],
    color2: obj.color[2],
    colorMode: obj.colorMode,
    visibility: obj.visibility,
    opacity: obj.opacity,
    zIndex: obj.zIndex,
    borderWidth: obj.borderWidth,
    borderStyle: obj.borderStyle,
    borderColor0: obj.borderColor[0],
    borderColor1: obj.borderColor[1],
    borderColor2: obj.borderColor[2],
    borderRadius: obj.borderRadius,
    boxShadowOffsetX: obj.boxShadowOffset.x,
    boxShadowOffsetY: obj.boxShadowOffset.y,
    boxShadowBlur: obj.boxShadowBlur,
    boxShadowSpread: obj.boxShadowSpread,
    boxShadowColor0: obj.boxShadowColor[0],
    boxShadowColor1: obj.boxShadowColor[1],
    boxShadowColor2: obj.boxShadowColor[2],
    position: obj.position,
    paddingTop: obj.paddingTop,
    paddingRight: obj.paddingRight,
    paddingBottom: obj.paddingBottom,
    paddingLeft: obj.paddingLeft,
    marginTop: obj.marginTop
  });
  obj.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof System
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
System.getCSSText = function(props) {
  return this._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' + props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' + props.opacity + '; z-index: ' + props.zIndex + '; position: ' +
      props.position + '; padding-top: ' + props.paddingTop + 'px; padding-right: ' + props.paddingRight + 'px; padding-bottom: ' + props.paddingBottom + 'px; padding-left: ' + props.paddingLeft + 'px; margin-top: ' + props.marginTop + 'px;';
};

exports.System = System;

function World(el, opt_options) {

  if (!el || typeof el !== 'object') {
    throw new Error('World: A valid DOM object is required for the new World "el" property.');
  }

  var options = opt_options || {},
      viewportSize = exports.System.getWindowSize();

  this.el = el;
  this.name = 'World';
  this.el.className = this.name.toLowerCase();
  this.id = this.name + exports.System.getNewId();
  this.width = options.width || 0;
  this.height = options.height || 0;
  this.autoWidth = !!options.autoWidth;
  this.autoHeight = !!options.autoHeight;
  this.angle = 0;
  this.color = options.color || 'transparent';
  this.colorMode = options.colorMode || 'rgb';
  this.visibility = options.visibility || 'visible';
  this.opacity = options.opacity || 1;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || 'transparent';
  this.gravity = options.gravity || new exports.Vector(0, 1);
  this.c = options.c || 0.1;
  this.boundToWindow = options.boundToWindow === false ? false : true;
  this.location = options.location || new exports.Vector(viewportSize.width / 2, viewportSize.height / 2);
  this.initLocation = new exports.Vector(this.location.x, this.location.y);
  this.position = options.position || 'absolute';
  this.paddingTop = options.paddingTop || 0;
  this.paddingRight = options.paddingRight || 0;
  this.paddingBottom = options.paddingBottom || 0;
  this.paddingLeft = options.paddingLeft || 0;
  this.marginTop = options.marginTop || 0;

  this.pauseStep = false;
  this.pauseDraw = false;

  this._setBounds();

  this._pool = []; // object pool

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};

  this.draw();

  /**
   * If world does not move, we only want to render it once, remove the inline styles and
   * block and further rendering.
   */
  this.isStatic = typeof options.isStatic !== 'undefined' ? options.isStatic : true;
  this.drawState = 0;
}

/**
 * A noop.
 */
World.prototype.step = function() {};

/**
 * Updates the corresponding DOM element's style property.
 * If world is static, we want to draw with passed properties first,
 * then clear the style, then do nothing. If world is not static, we
 * want to update it every frame.
 */
World.prototype.draw = function() {

  if (this.drawState === 2 && this.isStatic) {
    return;
  } else if (!this.drawState || !this.isStatic) {
    exports.System._draw(this);
  } else if (this.drawState === 1) {
    this.el.style.cssText = '';
  }
  this.drawState++;
};

/**
 * Sets the bounds of the world's visible area.
 * @private
 */
World.prototype._setBounds = function() {

  var screenDimensions = exports.System.getWindowSize();

  if (this.boundToWindow) {
    this.bounds = [0, screenDimensions.width, screenDimensions.height, 0];
    this.width = screenDimensions.width;
    this.height = screenDimensions.height;
  } else {
    this.bounds = [0, this.width, this.height, 0];
  }

  if (!this.location) {
    this.location = new exports.Vector((screenDimensions.width / 2),
        (screenDimensions.height / 2));
  }
};

exports.World = World;

function Box(opt_options) {

  var options = opt_options || {};
  options.name = 'Box';
  exports.Item.call(this, options);
}
System.extend(Box, Item);

/**
 * Initializes the ball.
 * @param {Object} options Initial options.
 */
Box.prototype.init = function(options) {
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || [100, 100, 100];
  this.borderRadius = options.borderRadius || 0;
};

exports.Box = Box;

function Ball(opt_options) {

  var options = opt_options || {};
  options.name = 'Ball';
  exports.Item.call(this, options);
}
System.extend(Ball, Item);

/**
 * Initializes the ball.
 * @param {Object} options Initial options.
 */
Ball.prototype.init = function(options) {
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || [0, 0, 0];
  this.colorMode = options.colorMode || 'rgb';
  this.borderRadius = options.borderRadius || 100;
  this.opacity = options.opacity || 1;
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || [0, 0, 0];
};

exports.Ball = Ball;

}(exports));