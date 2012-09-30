/*global exports, $, Modernizr */

/**
    A module representing World.
    @module World
 */

/**
 * Creates a new World.
 *
 * @constructor
 *
 * @param {boolean} [opt_options.isStatic = true] Set to false if transforming the world every frame.
 * @param {boolean} [opt_options.showStats = false] Set to true to render mr doob stats on startup.
 * @param {number} [opt_options.statsInterval = 0] Holds a reference to the interval used by mr doob's stats monitor.
 * @param {number} [opt_options.clock = 0] Increments each frame.
 * @param {number} [opt_options.c = 0.01] Coefficient of friction.
 * @param {Object} [opt_options.gravity = {x: 0, y: 1}] Gravity
 * @param {Object} [opt_options.wind = {x: 0, y: 0}] Wind
 * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location
 * @param {boolean} [opt_options.zSorted = false] Set to true to sort all elements by their zIndex before rendering.
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
 * @param {number} [opt_options.mouseX = window.width/2] The x coordinate of the mouse location.
 * @param {number} [opt_options.mouseY = window.height/2] The y coordinate of the mouse location.
 * @param {boolean} [opt_options.isTopDown = true] Set to true to orient the gravity vector when listening to the devicemotion event.
 * @param {number} [opt_options.compassHeading = 0] The compass heading. Value is set via the deviceorientation event.
 * @param {number} [opt_options.compassAccuracy = 0] The compass accuracy. Value is set via the deviceorientation event.
 * @param {boolean} [opt_options.isDeviceMotion = false] Set to true add the devicemotion event listener. Typically use with accelerometer equipped devices.
 * @param {boolean} [opt_options.isPlaying = true] Set to false to suspend the render loop.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 */
function World(opt_options) {

  'use strict';

  var me = this, options = opt_options || {},
      winSize = exports.Utils.getWindowSize();

  this.isStatic = options.isStatic || true;
  this.showStats = !!options.showStats;
  this.statsInterval = options.statsInterval || 0;
  this.clock = options.clock || 0;
  this.c = options.c || 0.01;
  this.gravity = options.gravity || new exports.Vector(0, 1);
  this.wind =  options.wind || new exports.Vector();
  this.location = options.location || new exports.Vector();
  this.zSorted = !!options.zSorted;

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
  this.mouseX = this.width/2;
  this.mouseY = this.height/2;
  this.isTopDown = true;
  this.compassHeading = 0;
  this.compassAccuracy = 0;
  this.isDeviceMotion = !options.isDeviceMotion;
  this.isPlaying = true;

  this.beforeStep = options.beforeStep || undefined;
  this.afterStep = options.afterStep || undefined;

  /**
   * If no DOM element is passed for the world,
   * use document.body. Because the body initially has
   * no height, we use the window height.
   */
  if (!options.el) {
    this.width = winSize.width;
    this.height = winSize.height;
  } else {
    this.width = $(this.el).width();
    this.height = $(this.el).height();
  }
  this.el = options.el || document.body; // if no world element is passed, use document.body
  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  if (this.showStats) {
    this.createStats();
  }

  // events
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

  /*$(window).bind("resize", function (e) { // listens for window resize
    me.resize.call(me);
  });*/
  exports.Utils.addEvent(window, 'resize', function(e) {
    me.resize.call(me);
  });

  // save the current and last mouse position
  exports.Utils.addEvent(document.body, 'mousemove', function(e) {
    exports.mouse.locLast = exports.mouse.loc.clone();
    exports.mouse.loc = new exports.Vector(e.pageX, e.pageY);
  });

  // toggle the world playstate
  exports.Utils.addEvent(document, 'keyup', function(e) {
    if (e.keyCode === exports.config.keyMap.toggleWorldPlaystate) {
      me.isPlaying = !me.isPlaying;
      if (me.isPlaying) {
        window.requestAnimFrame(exports.animLoop);
      }
    }
  });

  exports.Utils.addEvent(document.body, 'keydown', function(e) {
    var i, max, elements = exports.elementList.records,
        obj, desired, steer, target,
        r, theta, x, y;

    switch(e.keyCode) {
      case exports.config.keyMap.thrustLeft:
        for(i = 0, max = elements.length; i < max; i++) {
          if (elements[i].keyControl) {

            obj = elements[i];

            r = exports.world.width/2; // use angle to calculate x, y
            theta = exports.Utils.degreesToRadians(obj.angle - obj.turningRadius);
            x = r * Math.cos(theta);
            y = r * Math.sin(theta);

            target = exports.Vector.VectorAdd(new exports.Vector(x, y), obj.location);

            desired = exports.Vector.VectorSub(target, obj.location);
            desired.normalize();
            desired.mult(obj.velocity.mag() * 2);

            steer = desired.VectorSub(desired, obj.velocity);

            elements[i].applyForce(steer);
          }
        }
      break;
      case exports.config.keyMap.thrustUp:
        for(i = 0, max = elements.length; i < max; i++) {
          if (elements[i].keyControl) {

            obj = elements[i];

            r = exports.world.width/2;
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

            r = exports.world.width/2; // use angle to calculate x, y
            theta = exports.Utils.degreesToRadians(obj.angle + obj.turningRadius);
            x = r * Math.cos(theta);
            y = r * Math.sin(theta);

            target = exports.Vector.VectorAdd(new exports.Vector(x, y), obj.location);

            desired = exports.Vector.VectorSub(target, obj.location);
            desired.normalize();
            desired.mult(obj.velocity.mag() * 2);

            steer = desired.VectorSub(desired, obj.velocity);

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

}

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
World.name = 'world';

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

  if (props.el) { // if updating the element; update the width and height
    this.width = parseInt(this.el.style.width.replace('px', ''), 10);
    this.height = parseInt(this.el.style.height.replace('px', ''), 10);
  }

  /*if (!this.el.style.setAttribute) { // WC3
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
  }*/

  if (props.showStats && window.addEventListener) {
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

  var i, max, elementLoc, controlCamera, winSize = exports.Utils.getWindowSize(),
    windowWidth = winSize.width,
    windowHeight = winSize.height,
    elements = exports.elementList.records;

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
      this.gravity = new exports.Vector(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y * -1); // portrait
    } else {
      this.gravity = new exports.Vector(e.accelerationIncludingGravity.x, (e.accelerationIncludingGravity.z + 7.5) * 2); // portrait 45 degree angle
    }
  } else if (window.orientation === -90) {
    this.gravity = new exports.Vector(e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.x );
  } else {
    this.gravity = new exports.Vector(e.accelerationIncludingGravity.y * -1, e.accelerationIncludingGravity.x * -1);
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