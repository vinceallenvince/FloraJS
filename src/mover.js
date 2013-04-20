/*global exports, document, clearInterval, setInterval */
/**
 * Creates a new Mover. All Flora elements extend Mover.
 *
 * @constructor
 * @extends Mantle.Element
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
 * @param {number} [opt_options.lifespan = -1] Life span. Set to -1 to live forever.
 * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 */
function Mover(opt_options) {

  var myDiv, options, utils = exports.Mantle.Utils;

  opt_options.name = this.name;
  exports.Mantle.Element.call(this, opt_options);

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

  this.parent = options.parent || null;
  this.offsetDistance = options.offsetDistance || 30;

  this.beforeStep = options.beforeStep || null;
  this.afterStep = options.afterStep || null;

  //if (this.controlCamera) {
    //this.location.x = this.location.x + ((exports.Utils.getWindowSize().width - this.world.bounds[1]) / 2) - this.width / 2;
    //this.location.y = this.location.y + ((exports.Utils.getWindowSize().height - this.world.bounds[2]) / 2) - this.height / 2;
  //}

  this._forceVector = new exports.Vector(); // used to cache Vector properties in applyForce()
  this.checkCameraEdgesVector = new exports.Vector(); // used in Mover._checkCameraEdges()
  this.cameraDiffVector = new exports.Vector(); // used in Mover._checkWorldEdges()

  // increments in step()
  this.clock = 0;

  // view
  this.viewArgs = options.viewArgs || [];

  myDiv = document.createElement("div");

  if (options.view && exports.Interface.getDataType(options.view) === 'function') { // if view is supplied and is a function
    this._el = options.view.apply(this, this.viewArgs);
  } else if (exports.Interface.getDataType(options.view) === 'object') { // if view is supplied and is an object
    this._el = options.view;
  } else {
    this._el = myDiv;
  }

  this._el.id = this.id;
  if (!this.options.sensors) {
    this._el.className = 'element ' + this.name.toLowerCase();
  } else {
    this._el.className = 'element ' + this.name.toLowerCase() + ' ' + 'hasSensor';
  }
  this._el.style.visibility = 'hidden';

  this.options.world.el.appendChild(this._el);

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
    exports.Utils.addEvent(this._el, 'mouseover', mouseover);
    exports.Utils.addEvent(this._el, 'mousedown', mousedown);
    exports.Utils.addEvent(this._el, 'mousemove', mousemove);
    exports.Utils.addEvent(this._el, 'mouseup', mouseup);
    exports.Utils.addEvent(this._el, 'mouseout', mouseout);
  }
}
exports.Mantle.Utils.extend(Mover, exports.Mantle.Element);

Mover.prototype.name = 'Mover';

Mover.prototype.mouseover = function(e) {
  this.isMouseOut = false;
  clearInterval(this.mouseOutInterval);
};

Mover.prototype.mousedown = function(e) {

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
Mover.prototype.mousemove = function(e) {

  var x, y;

  if (this.isPressed) {

    this.isMouseOut = false;

    x = e.pageX - this.world.el.offsetLeft;
    y = e.pageY - this.world.el.offsetTop;

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

  'use strict';

  var me = obj, mouse = exports.Mantle.System.mouse,
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

  if (this.lifespan > 0) {
    this.lifespan -= 1;
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

  var cssText, el = this._el;

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
      system = exports.Mantle.System, utils = exports.Mantle.Utils;

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