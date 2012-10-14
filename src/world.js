/*global exports */
/**
 * Creates a new World.
 *
 * @constructor
 *
 * @param {Object} [opt_options] World options.
 * @param {string} [opt_options.id = "m-" + World._idCount] An id. If an id is not provided, one is created.
 * @param {boolean} [opt_options.isStatic = true] Set to false if transforming the world every frame.
 * @param {number} [opt_options.clock = 0] Increments each frame.
 * @param {number} [opt_options.c = 0.01] Coefficient of friction.
 * @param {Object} [opt_options.gravity = {x: 0, y: 1}] Gravity
 * @param {Object} [opt_options.wind = {x: 0, y: 0}] Wind
 * @param {Object} [opt_options.location = {x: 0, y: 0}] Initial location
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
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 */
function World(opt_options) {

  'use strict';

  var me = this, options = opt_options || {},
      winSize = exports.Utils.getWindowSize();

  this.isStatic = options.isStatic || true;
  this.clock = options.clock || 0;
  this.c = options.c || 0.01;
  this.gravity = options.gravity || new exports.Vector(0, 1);
  this.wind =  options.wind || new exports.Vector();
  this.location = options.location || new exports.Vector();

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

  this.beforeStep = options.beforeStep || undefined;
  this.afterStep = options.afterStep || undefined;

  /**
   * If no DOM element is passed for the world,
   * use document.body. Because the body initially has
   * no height, we use the window height.
   */
  if (!options.el) {
    this.el = document.body; // if no world element is passed, use document.body
    this.width = winSize.width;
    this.height = winSize.height;
    this.id = World.name + "-" + World._idCount; // if no id, create one
  } else {
    this.el = options.el;
    this.id = this.el.id; // use the element's id as the record id
    this.width = this.el.offsetWidth;
    this.height = this.el.offsetHeight;
  }

  this.el.className = 'world floraElement';
  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  World._idCount += 1; // increment id

  // events

  exports.Utils.addEvent(window, 'resize', function(e) { // listens for window resize
    me.resize.call(me);
  });
}

/**
 * Define a name property.
 */
World.prototype.name = 'world';

/**
 * Increments as each World is created.
 * @type number
 * @default 0
 */
World._idCount = 0;

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
 *    Optional properties:
 *    opt_props.style A map of css styles to apply.
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

  if (props.el) { // if updating the world's DOM element; update the width and height
    this.width = parseInt(this.el.style.width.replace('px', ''), 10);
    this.height = parseInt(this.el.style.height.replace('px', ''), 10);
  }

  if (!this.el.style.setAttribute) { // WC3
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
    elements = exports.elementList.all();

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
      this.el.style.width = this.width + 'px';
      this.el.style.height = this.height + 'px';
    }
  }
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