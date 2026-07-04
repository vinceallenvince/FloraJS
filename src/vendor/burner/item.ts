import Vector from '../vector2d-lib';
import type World from './world';

export interface ItemOptions {
  [key: string]: any;
}

/**
 * Base class for anything that lives in a World: applies forces,
 * integrates velocity, checks world edges and draws itself to a
 * DOM element.
 */
export default class Item {
  /** Holds a count of item instances. */
  static _idCount = 0;

  /** Template for an item's transform style. */
  static _stylePosition =
      'transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>);';

  // Items are configured via a two-phase construct-then-init() protocol
  // and carry open-ended option properties, so allow dynamic access.
  [key: string]: any;

  world: any;
  name: string;
  id: string;
  el: HTMLElement;
  width: number;
  height: number;
  scale: number;
  angle: number;
  colorMode: string;
  color: number[];
  mass: number;
  acceleration: Vector;
  velocity: Vector;
  location: Vector;
  maxSpeed: number;
  minSpeed: number;
  bounciness: number;
  life: number;
  lifespan: number;
  checkWorldEdges: boolean;
  wrapWorldEdges: boolean;
  // beforeStep/afterStep are intentionally NOT declared here: subclasses
  // may define them as prototype methods (which survive System._cleanObj
  // recycling, unlike instance properties), and a property declaration
  // would conflict with those method overrides. The index signature
  // covers them.
  controlCamera: boolean;
  opacity: number;
  zIndex: number;
  visibility: string;
  _force: Vector;

  constructor() {
    Item._idCount++;
  }

  /**
   * Resets all properties. Properties already set on the instance
   * (typically by a subclass's init) win over options, which win over
   * defaults.
   *
   * @param world An instance of World.
   * @param opt_options A map of initial properties.
   */
  init(world: World, opt_options?: ItemOptions): void {
    if (!world || typeof world !== 'object') {
      throw new Error('Item requires an instance of World.');
    }

    this.world = world;

    var options = opt_options || {};

    this.name = typeof this.name !== 'undefined' ? this.name :
        options.name || 'Item';

    this.width = typeof this.width !== 'undefined' ? this.width :
        typeof options.width === 'undefined' ? 10 : options.width;

    this.height = typeof this.height !== 'undefined' ? this.height :
        typeof options.height === 'undefined' ? 10 : options.height;

    this.scale = typeof this.scale !== 'undefined' ? this.scale :
        typeof options.scale === 'undefined' ? 1 : options.scale;

    this.angle = typeof this.angle !== 'undefined' ? this.angle :
        options.angle || 0;

    this.colorMode = typeof this.colorMode !== 'undefined' ? this.colorMode :
        options.colorMode || 'rgb';

    this.color = typeof this.color !== 'undefined' ? this.color :
        options.color || [200, 200, 200];

    this.borderWidth = typeof this.borderWidth !== 'undefined' ? this.borderWidth :
        options.borderWidth || 0;

    this.borderStyle = typeof this.borderStyle !== 'undefined' ? this.borderStyle :
        options.borderStyle || 'none';

    this.borderColor = typeof this.borderColor !== 'undefined' ? this.borderColor :
        options.borderColor || [255, 255, 255];

    this.borderRadius = typeof this.borderRadius !== 'undefined' ? this.borderRadius :
        options.borderRadius || 0;

    this.boxShadowOffsetX = typeof this.boxShadowOffsetX !== 'undefined' ? this.boxShadowOffsetX :
        options.boxShadowOffsetX || 0;

    this.boxShadowOffsetY = typeof this.boxShadowOffsetY !== 'undefined' ? this.boxShadowOffsetY :
        options.boxShadowOffsetY || 0;

    this.boxShadowBlur = typeof this.boxShadowBlur !== 'undefined' ? this.boxShadowBlur :
        options.boxShadowBlur || 0;

    this.boxShadowSpread = typeof this.boxShadowSpread !== 'undefined' ? this.boxShadowSpread :
        options.boxShadowSpread || 0;

    this.boxShadowColor = typeof this.boxShadowColor !== 'undefined' ? this.boxShadowColor :
        options.boxShadowColor || [255, 255, 255];

    this.opacity = typeof this.opacity !== 'undefined' ? this.opacity :
        typeof options.opacity === 'undefined' ? 1 : options.opacity;

    this.zIndex = typeof this.zIndex !== 'undefined' ? this.zIndex :
        options.zIndex || 0;

    this.visibility = typeof this.visibility !== 'undefined' ? this.visibility :
        options.visibility || 'visible';

    this.mass = typeof this.mass !== 'undefined' ? this.mass :
        typeof options.mass === 'undefined' ? 10 : options.mass;

    this.acceleration = typeof this.acceleration !== 'undefined' ? this.acceleration :
        options.acceleration || new Vector();

    this.velocity = typeof this.velocity !== 'undefined' ? this.velocity :
        options.velocity || new Vector();

    this.location = typeof this.location !== 'undefined' ? this.location :
        options.location || new Vector(this.world.width / 2, this.world.height / 2);

    this.maxSpeed = typeof this.maxSpeed !== 'undefined' ? this.maxSpeed :
        typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;

    this.minSpeed = typeof this.minSpeed !== 'undefined' ? this.minSpeed :
        options.minSpeed || 0;

    this.bounciness = typeof this.bounciness !== 'undefined' ? this.bounciness :
        typeof options.bounciness === 'undefined' ? 0.5 : options.bounciness;

    this.life = typeof this.life !== 'undefined' ? this.life :
        options.life || 0;

    this.lifespan = typeof this.lifespan !== 'undefined' ? this.lifespan :
        typeof options.lifespan === 'undefined' ? -1 : options.lifespan;

    this.checkWorldEdges = typeof this.checkWorldEdges !== 'undefined' ? this.checkWorldEdges :
        typeof options.checkWorldEdges === 'undefined' ? true : options.checkWorldEdges;

    this.wrapWorldEdges = typeof this.wrapWorldEdges !== 'undefined' ? this.wrapWorldEdges :
        !!options.wrapWorldEdges;

    this.beforeStep = typeof this.beforeStep !== 'undefined' ? this.beforeStep :
        options.beforeStep || function() {};

    this.afterStep = typeof this.afterStep !== 'undefined' ? this.afterStep :
        options.afterStep || function() {};

    this.controlCamera = typeof this.controlCamera !== 'undefined' ? this.controlCamera :
        !!options.controlCamera;

    this._force = this._force || new Vector();

    this.id = this.name + Item._idCount;
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.id = this.id;
      this.el.className = 'item ' + this.name.toLowerCase();
      this.el.style.position = 'absolute';
      this.el.style.top = '-5000px';
      this.world.add(this.el);
    }
  }

  /**
   * Applies forces to item.
   */
  step(): void {
    var x = this.location.x,
        y = this.location.y;

    this.beforeStep.call(this);
    this.applyForce(this.world.gravity);
    this.applyForce(this.world.wind);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.minSpeed);
    this.location.add(this.velocity);
    if (this.checkWorldEdges) {
      this._checkWorldEdges();
    } else if (this.wrapWorldEdges) {
      this._wrapWorldEdges();
    }
    if (this.controlCamera) { // need the corrected velocity which is the difference bw old/new location
      this._checkCameraEdges(x, y, this.location.x, this.location.y);
    }
    this.acceleration.mult(0);
    this.afterStep.call(this);
  }

  /**
   * Adds a force to this object's acceleration.
   * @param force A Vector representing a force to apply.
   * @returns A Vector representing a new acceleration.
   */
  applyForce(force?: Vector): Vector | undefined {
    // calculated via F = m * a
    if (force) {
      this._force.x = force.x;
      this._force.y = force.y;
      this._force.div(this.mass);
      this.acceleration.add(this._force);
      return this.acceleration;
    }
  }

  /**
   * Prevents object from moving beyond world bounds.
   */
  _checkWorldEdges(): void {
    var worldRight = this.world.width,
        worldBottom = this.world.height,
        location = this.location,
        velocity = this.velocity,
        width = this.width * this.scale,
        height = this.height * this.scale,
        bounciness = this.bounciness;

    if (location.x + width / 2 > worldRight) {
      location.x = worldRight - width / 2;
      velocity.x *= -1 * bounciness;
    } else if (location.x < width / 2) {
      location.x = width / 2;
      velocity.x *= -1 * bounciness;
    }

    if (location.y + height / 2 > worldBottom) {
      location.y = worldBottom - height / 2;
      velocity.y *= -1 * bounciness;
    } else if (location.y < height / 2) {
      location.y = height / 2;
      velocity.y *= -1 * bounciness;
    }
  }

  /**
   * If item moves beyond world bounds, position's object at the
   * opposite boundary.
   */
  _wrapWorldEdges(): void {
    var worldRight = this.world.width,
        worldBottom = this.world.height,
        location = this.location,
        width = this.width * this.scale,
        height = this.height * this.scale;

    if (location.x - width / 2 > worldRight) {
      location.x = -width / 2;
    } else if (location.x < -width / 2) {
      location.x = worldRight + width / 2;
    }

    if (location.y - height / 2 > worldBottom) {
      location.y = -height / 2;
    } else if (location.y < -height / 2) {
      location.y = worldBottom + height / 2;
    }
  }

  /**
   * Moves the world in the opposite direction of the Camera's controlObj.
   */
  _checkCameraEdges(lastX: number, lastY: number, x: number, y: number): void {
    this.world._camera.x = lastX - x;
    this.world._camera.y = lastY - y;
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
      visibility: this.visibility
    });
    this.el.style.cssText = cssText;
  }

  /**
   * Concatenates a new cssText string.
   * @param props A map of object properties.
   */
  getCSSText(props: { [key: string]: any }): string {
    return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' + props.width + 'px; height: ' + props.height + 'px; background-color: ' + props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') + '); opacity: ' + props.opacity + '; z-index: ' + props.zIndex + '; visibility: ' + props.visibility + ';';
  }
}
