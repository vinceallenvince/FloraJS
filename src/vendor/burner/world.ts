import Vector from '../vector2d-lib';
import Item, { ItemOptions } from './item';

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
      color0: this.color[0],
      color1: this.color[1],
      color2: this.color[2],
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor1: this.borderColor[0],
      borderColor2: this.borderColor[1],
      borderColor3: this.borderColor[2]
    });
    this.el.style.cssText = cssText;
  }

  /**
   * Concatenates a new cssText string.
   * @param props A map of object properties.
   */
  getCSSText(props: { [key: string]: any }): string {
    return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' + props.width + 'px; height: ' + props.height + 'px; background-color: rgb(' + props.color0 + ', ' + props.color1 + ', ' + props.color2 + '); border: ' + props.borderWidth + 'px ' + props.borderStyle + ' rgb(' + props.borderColor1 + ', ' + props.borderColor2 + ', ' + props.borderColor3 + ')';
  }
}
