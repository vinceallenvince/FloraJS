import { Item } from './vendor/burner/main';
import type { StyleProps } from './renderer/dom-renderer';

/**
 * Creates a new Point.
 *
 * Points are the most basic Flora item. They represent a fixed point in
 * 2D space and are just an extension of Burner Item with isStatic set to true.
 *
 * @constructor
 * @extends Item
 */
export default class Point extends Item {
  constructor() {
    super();
  }

  /**
   * Initializes an instance of Point.
   *
   * @param {Object} [opt_options=] A map of initial properties.
   * @param {Array} [opt_options.color = 200, 200, 200] Color.
   * @param {number} [opt_options.borderRadius = 100] Border radius.
   * @param {number} [opt_options.borderWidth = 2] Border width.
   * @param {string} [opt_options.borderStyle = 'solid'] Border style.
   * @param {Array} [opt_options.borderColor = 60, 60, 60] Border color.
   */
  init(world: any, opt_options?: any): void {
    super.init(world, opt_options);

    var options = opt_options || {};

    this.color = options.color || [200, 200, 200];
    this.borderRadius = typeof options.borderRadius === 'undefined' ? 100 : options.borderRadius;
    this.borderWidth = typeof options.borderWidth === 'undefined' ? 2 : options.borderWidth;
    this.borderStyle = options.borderStyle || 'solid';
    this.borderColor = options.borderColor || [60, 60, 60];

    // Points are static
    this.isStatic = true;
  }

  step(): void {}

  /**
   * Updates the corresponding DOM element's style property.
   * @function draw
   * @memberof Point
   */
  getStyle(): StyleProps {
    return {
      x: this.location.x - (this.width / 2),
      y: this.location.y - (this.height / 2),
      angle: this.angle,
      scale: this.scale || 1,
      width: this.width,
      height: this.height,
      color0: this.color[0],
      color1: this.color[1],
      color2: this.color[2],
      colorMode: this.colorMode,
      borderRadius: this.borderRadius,
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor0: this.borderColor[0],
      borderColor1: this.borderColor[1],
      borderColor2: this.borderColor[2]
    };
  }

}
