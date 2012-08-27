/*global exports, $, console */
/**
    A module representing an Obj.
    @module Obj
 */

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
Obj.name = 'obj';

/**
 * Called by a mouseenter event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Obj.mouseenter = function(e) {

  'use strict';

  this.isMouseOut = false;
  //clearInterval(this.myInterval);
};

/**
 * Called by a mousedown event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Obj.mousedown = function(e) {

  'use strict';

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

  'use strict';

  var x, y,
    worldOffset = $(".world").offset();

  if (this.isPressed) {

    this.isMouseOut = false;

    x = e.pageX - worldOffset.left;
    y = e.pageY - worldOffset.top;

    this.item.location = exports.PVector.create(x, y);

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

  'use strict';

  this.isPressed = false;
  //this.item.trigger("saveCurrentPosition");
};

/**
 * Called by a mouseleave event listener.
 *
 * @param {Object} e The event object passed by the listener.
 */
Obj.mouseleave = function(e) {

  'use strict';

  var me = this,
    item = this.item,
    x, y,
    worldOffset = $(".world").offset();

  if (this.isPressed) {
    this.isMouseOut = true;
    this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up


      if (me.isPressed && me.isMouseOut) {

        x = exports.Flora.World.mouseX - worldOffset.left;
        y = exports.Flora.World.mouseY - worldOffset.top;

        item.location = exports.PVector.create(x, y);

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