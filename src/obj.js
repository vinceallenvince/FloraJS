/*global exports, console */
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
 * Define a name property.
 */
Obj.prototype.name = 'obj';

/**
 * Called by a mouseover event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Obj.mouseover = function(e) {

  'use strict';

  this.isMouseOut = false;
  clearInterval(this.mouseOutInterval);
};

/**
 * Called by a mousedown event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Obj.mousedown = function(e) {

  'use strict';

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
Obj.mousemove = function(e) {

  'use strict';

  var x, y;

  if (this.isPressed) {

    this.isMouseOut = false;

    x = e.pageX - this.world.el.offsetLeft;
    y = e.pageY - this.world.el.offsetTop;

    if (Obj.mouseIsInsideWorld(this.world)) {
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
Obj.mouseup = function(e) {

  'use strict';

  this.isPressed = false;
};

/**
 * Called by a mouseout event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Obj.mouseout = function(e) {

  'use strict';

  var me = this,
    x, y;

  if (this.isPressed) {

    this.isMouseOut = true;

    this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

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
Obj.mouseIsInsideWorld = function(world) {

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
 * Renders the element to the DOM. Called every frame.
 */
Obj.prototype.draw = function() {

  'use strict';

  this.el.style.cssText = exports.Utils.getCSSText({
    x: this.location.x - this.width/2,
    y: this.location.y - this.height/2,
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

exports.Obj = Obj;