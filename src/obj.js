/*global $, console */
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

  this.el.style.cssText = this.getCSSText({
    x: this.location.x - this.width/2,
    y: this.location.y - this.height/2,
    s: this.scale,
    a: this.angle,
    o: this.opacity,
    w: this.width,
    h: this.height,
    cm: this.colorMode,
    c: this.color,
    z: this.zIndex,
    border: this.border,
    borderRadius: this.borderRadius,
    boxShadow: this.boxShadow
  });
};

/**
 * Builds a cssText string based on properties passed by draw().
 *
 * @param {Object} props Properties describing the object.
 */  
Obj.prototype.getCSSText = function(props) {

  'use strict';

  if (Modernizr.csstransforms3d) {
    return [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      'opacity: ' + props.o,
      'width: ' + props.w + 'px',
      'height: ' + props.h + 'px',
      'background: ' + props.cm + '(' + props.c.r + ', ' + props.c.g + ', ' + props.c.b + ')',
      'z-index: ' + props.z,
      'border: ' + props.border,
      'border-radius: ' + props.borderRadius,
      'box-shadow: ' + props.boxShadow
    ].join(';');
  } else if (Modernizr.csstransforms) {
    return [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      'opacity: ' + props.o,
      'width: ' + props.w + 'px',
      'height: ' + props.h + 'px',
      'background: ' + props.cm + '(' + props.c.r + ', ' + props.c.g + ', ' + props.c.b + ')',
      'z-index: ' + props.z,
      'border: ' + props.border,
      'border-radius: ' + props.borderRadius,
      'box-shadow: ' + props.boxShadow
    ].join(';');
  } else {
    return [
      'position: absolute',
      'left' + props.x + 'px',
      'top' + props.y + 'px',
      'width' + props.w + 'px',
      'height' + props.h + 'px'
    ].join(';');    
  }
};
exports.Obj = Obj;