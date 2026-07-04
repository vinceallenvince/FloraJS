import { Item, System, Utils, Vector } from './vendor/burner/main';

/**
 * Creates a new Mover.
 *
 * Movers are the root object for any item that moves. They are not
 * aware of other Movers or stimuli. They have no means of locomotion
 * and change only due to external forces. You will never directly
 * implement Mover.
 */
export default class Mover extends Item {
  constructor(opt_options?: any) {
    super();
  }

  /**
   * Initializes an instance of Mover.
   * @param world An instance of World.
   * @param opt_options A map of initial properties.
   * @param {string|Array} [opt_options.color = 255, 255, 255] Color.
   * @param {number} [opt_options.borderRadius = 100] Border radius.
   * @param {number} [opt_options.borderWidth = 2] Border width.
   * @param {string} [opt_options.borderStyle = 'solid'] Border style.
   * @param {Array} [opt_options.borderColor = 60, 60, 60] Border color.
   * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
   * @param {boolean} [opt_options.draggable = false] If true, object can move via drag and drop.
   * @param {Object} [opt_options.parent = null] A parent object. If set, object will be fixed to the parent relative to an offset distance.
   * @param {boolean} [opt_options.pointToParentDirection = true] If true, object points in the direction of the parent's velocity.
   * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the object's parent.
   * @param {number} [opt_options.offsetAngle = 0] The rotation around the center of the object's parent.
   * @param {function} [opt_options.afterStep = null] A function to run after the step() function.
   * @param {function} [opt_options.isStatic = false] Set to true to prevent object from moving.
   * @param {Object} [opt_options.parent = null] Attach to another Flora object.
   */
  init(world: any, opt_options?: any): void {
    super.init(world, opt_options);

    var options = opt_options || {};

    this.color = options.color || [255, 255, 255];
    this.borderRadius = options.borderRadius || 0;
    this.borderWidth = options.borderWidth || 0;
    this.borderStyle = options.borderStyle || 'none';
    this.borderColor = options.borderColor || [0, 0, 0];
    this.pointToDirection = typeof options.pointToDirection === 'undefined' ? true : options.pointToDirection;
    this.draggable = !!options.draggable;
    this.parent = options.parent || null;
    this.pointToParentDirection = typeof options.pointToParentDirection === 'undefined' ? true : options.pointToParentDirection;
    this.offsetDistance = typeof options.offsetDistance === 'undefined' ? 0 : options.offsetDistance;
    this.offsetAngle = options.offsetAngle || 0;
    this.isStatic = !!options.isStatic;

    var me = this;

    this.isMouseOut = false;
    this.isPressed = false;
    this.mouseOutInterval = false;
    this._friction = new Vector();

    if (this.draggable) {

      Utils.addEvent(this.el, 'mouseover', (function() {
        return function(e: any) {
          Mover.mouseover.call(me, e);
        };
      }()));

      Utils.addEvent(this.el, 'mousedown', (function() {
        return function(e: any) {
          Mover.mousedown.call(me, e);
        };
      }()));

      Utils.addEvent(this.el, 'mousemove', (function() {
        return function(e: any) {
          Mover.mousemove.call(me, e);
        };
      }()));

      Utils.addEvent(this.el, 'mouseup', (function() {
        return function(e: any) {
          Mover.mouseup.call(me, e);
        };
      }()));

      Utils.addEvent(this.el, 'mouseout', (function() {
        return function(e: any) {
          Mover.mouseout.call(me, e);
        };
      }()));
    }
  }

  /**
   * Handles mouseup events.
   */
  static mouseover(this: any) {
    this.isMouseOut = false;
    clearInterval(this.mouseOutInterval);
  }

  /**
   * Handles mousedown events.
   */
  static mousedown(this: any) {
    this.isPressed = true;
    this.isMouseOut = false;
  }

  /**
   * Handles mousemove events.
   * @param e An event object.
   */
  static mousemove(this: any, e: any) {

    var x, y;

    if (this.isPressed) {

      this.isMouseOut = false;

      if (e.pageX && e.pageY) {
        x = e.pageX - this.world.el.offsetLeft;
        y = e.pageY - this.world.el.offsetTop;
      } else if (e.clientX && e.clientY) {
        x = e.clientX - this.world.el.offsetLeft;
        y = e.clientY - this.world.el.offsetTop;
      }

      if (x & y) {
        this.location = new Vector(x, y);
      }

      this._checkWorldEdges();
    }

  }

  /**
   * Handles mouseup events.
   */
  static mouseup(this: any) {
    this.isPressed = false;
    // TODO: add mouse to obj acceleration
  }

  /**
   * Handles mouse out events.
   */
  static mouseout(this: any) {

    var x: number, y: number, me = this, mouse = System.mouse;

    if (this.isPressed) {

      this.isMouseOut = true;

      this.mouseOutInterval = setInterval(function () { // if mouse is too fast for block update, update via an interval until it catches up

        if (me.isPressed && me.isMouseOut) {

          x = mouse.location.x - me.world.el.offsetLeft;
          y = mouse.location.y - me.world.el.offsetTop;

          me.location = new Vector(x, y);
        }
      }, 16);
    }
  }

  step(): void {

    var i, max, r, theta, x = this.location.x,
        y = this.location.y;

    this.beforeStep.call(this);

    if (this.isStatic || this.isPressed) {
      return;
    }

    // start apply forces

    if (this.world.c) { // friction
      this._friction.x = this.velocity.x;
      this._friction.y = this.velocity.y;
      this._friction.mult(-1);
      this._friction.normalize();
      this._friction.mult(this.world.c);
      this.applyForce(this._friction);
    }
    this.applyForce(this.world.gravity); // gravity

    // attractors
    var attractors = System.getAllItemsByName('Attractor');
    for (i = 0, max = attractors.length; i < max; i += 1) {
      if (this.id !== attractors[i].id) {
        this.applyForce(attractors[i].attract(this));
      }
    }

    // repellers
    var repellers = System.getAllItemsByName('Repeller');
    for (i = 0, max = repellers.length; i < max; i += 1) {
      if (this.id !== repellers[i].id) {
        this.applyForce(repellers[i].attract(this));
      }
    }

    // draggers
    var draggers = System.getAllItemsByName('Dragger');
    for (i = 0, max = draggers.length; i < max; i += 1) {
      if (this.id !== draggers[i].id && Utils.isInside(this, draggers[i])) {
        this.applyForce(draggers[i].drag(this));
      }
    }

    if (this.applyAdditionalForces) {
      this.applyAdditionalForces.call(this);
    }

    this.velocity.add(this.acceleration); // add acceleration

    this.velocity.limit(this.maxSpeed, this.minSpeed);

    this.location.add(this.velocity); // add velocity

    if (this.pointToDirection) { // object rotates toward direction
      if (this.velocity.mag() > 0.1) {
        this.angle = Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
    }

    if (this.wrapWorldEdges) {
      this._wrapWorldEdges();
    } else if (this.checkWorldEdges) {
      this._checkWorldEdges();
    }

    if (this.controlCamera) {
      this._checkCameraEdges(x, y, this.location.x, this.location.y);
    }

    if (this.parent) { // parenting

      if (this.offsetDistance) {

        r = this.offsetDistance; // use angle to calculate x, y
        theta = Utils.degreesToRadians(this.parent.angle + this.offsetAngle);
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);

        this.location.x = this.parent.location.x;
        this.location.y = this.parent.location.y;
        this.location.add(new Vector(x, y)); // position the child

        if (this.pointToParentDirection) {
          this.angle = Utils.radiansToDegrees(Math.atan2(this.parent.velocity.y, this.parent.velocity.x));
        }

      } else {
        this.location.x = this.parent.location.x;
        this.location.y = this.parent.location.y;
      }
    }

    this.acceleration.mult(0);

    if (this.life < this.lifespan) {
      this.life += 1;
    } else if (this.lifespan !== -1) {
      System.remove(this);
      return;
    }

    this.afterStep.call(this);
  }

  /**
   * Updates the corresponding DOM element's style property.
   */
  draw(): void {
    var cssText = this.getCSSText({
      x: this.location.x - (this.width / 2),
      y: this.location.y - (this.height / 2),
      angle: this.angle,
      scale: this.scale || 1,
      width: this.width,
      height: this.height,
      colorMode: this.colorMode,
      color0: this.color[0],
      color1: this.color[1],
      color2: this.color[2],
      opacity: this.opacity,
      zIndex: this.zIndex,
      visibility: this.visibility,
      borderRadius: this.borderRadius,
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor0: this.borderColor[0],
      borderColor1: this.borderColor[1],
      borderColor2: this.borderColor[2]
    });
    this.el.style.cssText = cssText;
  }

  /**
   * Concatenates a new cssText string.
   *
   * @param props A map of object properties.
   * @returns A string representing cssText.
   */
  getCSSText(props: { [key: string]: any }): string {
    return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
        props.width + 'px; height: ' + props.height + 'px; background-color: ' +
        props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +');  opacity: ' + props.opacity + '; z-index: ' + props.zIndex + '; visibility: ' + props.visibility + '; border: ' +
        props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
        props.borderRadius + '%;';
  }
}
