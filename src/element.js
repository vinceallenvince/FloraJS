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
  this.getLocationVector = new exports.Vector(); // used in Agent.getLocation()
  this.getVelocityVector = new exports.Vector(); // used in Agent.getVelocity()
  this.cameraDiffVector = new exports.Vector(); // used in Agent.checkWorldEdges()

    // set sensors
  this.sensors = options.sensors || [];

  this.className = options.className || constructorName.toLowerCase();
  this.className += ' floraElement';

  elements.push(this); // push new instance of Element

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