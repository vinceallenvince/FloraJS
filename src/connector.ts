import { Item, Utils, Vector } from './vendor/burner/main';

/**
 * Creates a new Connector.
 *
 * Connectors render a straight line between two Flora items. The Connector carries
 * a reference to the two items as parentA and parentB. If the parent items move,
 * the Connector moves with them.
 *
 * @constructor
 * @extends Item
 */
export default class Connector extends Item {
  constructor() {
    super();
  }

  /**
   * @param {Object} options A map of initial properties.
   * @param {Object} parentA The object that starts the connection.
   * @param {Object} parentB The object that ends the connection.
   * @param {number} [options.zIndex = 0] zIndex.
   * @param {string} [options.borderStyle = 'dotted'] Border style.
   * @param {Array} [options.borderColor = 150, 150, 150] Border color.
   */
  init(world: any, options?: any): void {
    super.init(world, options);

    if (!options || !options.parentA || !options.parentB) {
      throw new Error('Connector: both parentA and parentB are required.');
    }
    this.parentA = options.parentA;
    this.parentB = options.parentB;

    this.zIndex = options.zIndex || 0;
    this.borderStyle = options.borderStyle || 'dotted';
    this.borderColor = options.borderColor || [150, 150, 150];

    /**
     * Connectors have no height or color and rely on the associated DOM element's
     * CSS border to render their line.
     */
    this.borderWidth = 1;
    this.borderRadius = 0;
    this.height = 0;
    this.color = 'transparent' as any;

  }

  /**
   * Called every frame, step() updates the instance's properties.
   */
  step(): void {

    var a = this.parentA.location,
        b = this.parentB.location;

    this.width = Math.floor(Vector.VectorSub(this.parentA.location,
        this.parentB.location).mag());

    this.location = Vector.VectorAdd(this.parentA.location,
        this.parentB.location).div(2); // midpoint = (v1 + v2)/2

    this.angle = Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
  }

  /**
   * Updates the corresponding DOM element's style property.
   * @function draw
   * @memberof Connector
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
      colorMode: this.colorMode,
      borderRadius: this.borderRadius,
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor0: this.borderColor[0],
      borderColor1: this.borderColor[1],
      borderColor2: this.borderColor[2],
      visibility: this.visibility
    });
    this.el.style.cssText = cssText;
  }

  /**
   * Concatenates a new cssText string.
   *
   * @function getCSSText
   * @memberof Connector
   * @param {Object} props A map of object properties.
   * @returns {string} A string representing cssText.
   */
  getCSSText(props: { [key: string]: any }): string {
    return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
        props.width + 'px; height: ' + props.height + 'px; background-color: ' +
        props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
        props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
        props.borderRadius + '%; visibility: ' + props.visibility + ';';
  }
}
