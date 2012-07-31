/*global exports*/
/** @module Obj */
(function(exports) { 
    
  /**
   * Creates a new Obj. All Flora elements extend Obj.
   * @constructor
   * @alias module:Obj
   */ 
  function Obj() {
    var i, max, key, prop;
    for (i = 0, max = arguments.length; i < max; i += 1) {
      prop = arguments[i];
      for (key in prop) {
        if (prop.hasOwnProperty(key)) {
          this[key] = prop[key];
        }
      }
    }
  };

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
    this.isMouseOut = false;
    //clearInterval(this.myInterval);
  };

  /**
   * Called by a mousedown event listener.
   *
   * @param {Object} e The event object passed by the listener.
   */ 
  Obj.mousedown = function(e) {

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

    var x, y,
      worldOffset = $(".world").offset();

    if (this.isPressed) {

      this.isMouseOut = false;

      x = e.pageX - worldOffset.left;
      y = e.pageY - worldOffset.top;

      this.item.location = PVector.create(x, y);

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
    this.isPressed = false;
    //this.item.trigger("saveCurrentPosition");
  };

  /**
   * Called by a mouseleave event listener.
   *
   * @param {Object} e The event object passed by the listener.
   */     
  Obj.mouseleave = function(e) {

    var me = this,
      item = this.item,
      x, y,
      worldOffset = $(".world").offset();

    if (this.isPressed) {
      this.isMouseOut = true;
      this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up


        if (me.isPressed && me.isMouseOut) {

          x = Flora.World.mouseX - worldOffset.left;
          y = Flora.World.mouseY - worldOffset.top;

          item.location = PVector.create(x, y);

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
    
    var v = this.velocity,
      x = this.location.x - this.width/2,
      y = this.location.y - this.height/2,
      s = this.scale,
      a = this.angle,
      o = this.opacity,
      w = this.width,
      h = this.height,
      cm = this.colorMode,
      c = this.color, 
      z = this.zIndex,
      border = this.border,
      borderRadius = this.borderRadius,
      boxShadow = this.boxShadow,
      style = this.el.style,
      nose = this.el.firstChild,
      i, max;

    if (v && nose) { // if this object has a velocity; fade in nose relative to velocity
      nose.style.opacity = Utils.map(v.mag(), 0, this.maxSpeed, 0.25, 1);
    }

    if (Modernizr.csstransforms3d) { //  && Modernizr.touch 
      style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
      style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
      style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
      style.opacity = o;
      style.width = w + "px";
      style.height = h + "px";
      if (c) {
        style.background = cm + "(" + c.r + ", " + c.g + ", " + c.b + ")";
      }
      style.zIndex = z;
      style.border = border;
      style.borderRadius = borderRadius;
      style.boxShadow = boxShadow;
    } else if (Modernizr.csstransforms) {
      style.webkitTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';
      style.MozTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';  
      style.OTransform = 'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + a + 'deg) scaleX(' + s + ') scaleY(' + s + ')';        
      style.opacity = o;
      style.width = w + 'px';
      style.height = h + 'px';
      style.background = cm + '(' + c.r + ', ' + c.g + ', ' + c.b + ')';
      style.zIndex = z;
    } else {
      $(this.el).css({
        'position': 'absolute',
        'left': x + 'px',
        'top': y + 'px',
        'width': w + 'px',
        'height': h + 'px'
      });
    }
  }
  exports.Obj = Obj;
}(exports));