import Vector from '../vector2d-lib';
import Item, { ItemOptions } from './item';
import type { StyleProps } from '../../renderer/dom-renderer';

/**
 * A World contains Items and applies global forces (gravity, wind)
 * to them. By default a World's DOM element is the document body.
 */
export default class World extends Item {
  el: HTMLElement;
  gravity: Vector;
  c: number;
  pauseStep: boolean;
  pauseDraw: boolean;
  _camera: Vector;
  _autoWidth: boolean;
  _autoHeight: boolean;
  _resizeObserver: ResizeObserver | null;

  constructor(opt_options?: ItemOptions) {
    super();

    var options = opt_options || {};

    this.el = options.el || document.body;
    this.name = 'World';

    /**
     * Worlds do not have worlds. However, assigning an
     * object literal makes for less conditions in the
     * update loop.
     */
    this.world = {};
  }

  /**
   * Measures an element's usable size. The body is measured via the
   * viewport (documentElement.clientWidth/Height): since browsers aligned
   * body.scrollHeight with the CSSOM spec, it reports the body's own
   * content height, which is 0 for a body whose children are all
   * absolutely positioned.
   *
   * @param el A DOM element.
   * @returns A map with width and height properties.
   */
  static measureSize(el: HTMLElement): { width: number, height: number } {
    if (el === document.body) {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      };
    }
    return {
      width: el.scrollWidth,
      height: el.scrollHeight
    };
  }

  /**
   * Resets all properties.
   * @param world Ignored; a World is its own world (passed as {}).
   * @param opt_options A map of initial properties.
   */
  init(world: World, opt_options?: ItemOptions): void {
    super.init(this.world, opt_options);

    var options = opt_options || {};

    var size = World.measureSize(this.el);
    var bodySize = World.measureSize(document.body);

    this.color = options.color || [0, 0, 0];
    this.width = options.width || size.width;
    this.height = options.height || size.height;
    this.location = options.location || new Vector(bodySize.width / 2, bodySize.height / 2);
    this.borderWidth = options.borderWidth || 0;
    this.borderStyle = options.borderStyle || 'none';
    this.borderColor = options.borderColor || [0, 0, 0];
    this.gravity = options.gravity || new Vector(0, 1);
    this.c = typeof options.c !== 'undefined' ? options.c : 0.1;
    this.pauseStep = !!options.pauseStep;
    this.pauseDraw = !!options.pauseDraw;
    this.el.className = this.name.toLowerCase();
    this._camera = this._camera || new Vector();

    // Track the element's size so the world's bounds follow container
    // resizes — but never stomp explicitly configured dimensions.
    this._autoWidth = typeof options.width === 'undefined';
    this._autoHeight = typeof options.height === 'undefined';
    this._observeResize();
  }

  /**
   * Watches this world's element for size changes and updates the
   * world's bounds. For body-sized worlds the documentElement is
   * observed, since it tracks the viewport.
   */
  _observeResize(): void {
    if (this._resizeObserver || typeof ResizeObserver === 'undefined') {
      return;
    }
    var target = this.el === document.body ? document.documentElement : this.el;
    this._resizeObserver = new ResizeObserver(() => {
      var size = World.measureSize(this.el);
      if (this._autoWidth) {
        this.width = size.width;
      }
      if (this._autoHeight) {
        this.height = size.height;
      }
    });
    this._resizeObserver.observe(target);
  }

  /**
   * Adds an item to the world's view.
   * @param item An Item's DOM element.
   */
  add(item: HTMLElement): void {
    this.el.appendChild(item);
  }

  /**
   * Applies the camera offset to the world.
   */
  step(): void {
    this.location.add(this._camera);
  }

  /**
   * Describes this world's visual state for the renderer.
   */
  getStyle(): StyleProps {
    return {
      x: this.location.x - (this.width / 2),
      y: this.location.y - (this.height / 2),
      angle: this.angle,
      scale: this.scale || 1,
      width: this.width,
      height: this.height,
      colorMode: 'rgb',
      color0: this.color[0],
      color1: this.color[1],
      color2: this.color[2],
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor0: this.borderColor[0],
      borderColor1: this.borderColor[1],
      borderColor2: this.borderColor[2]
    };
  }
}
