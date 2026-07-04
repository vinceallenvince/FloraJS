import { Item } from './vendor/burner/main';
import type { StyleProps } from './renderer/dom-renderer';

/**
 * Creates a new RangeDisplay.
 *
 * A RangeDisplay is parented to a sensor and displays the sensor's
 * sensitivity range.
 *
 * @constructor
 * @extends Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
export default class RangeDisplay extends Item {
  constructor(opt_options?: any) {
    super();
  }

  /**
   * Initializes RangeDisplay.
   * @param  {Object} world       An instance of World.
   * @param  {Object} [opt_options=] A map of initial properties.
   */
  init(world: any, opt_options?: any): void {
    super.init(world, opt_options);

    var options = opt_options || {};

    if (!options || !options.sensor) {
      throw new Error('RangeDisplay: a sensor is required.');
    }
    this.sensor = options.sensor;

    this.zIndex = 10;
    this.borderStyle = this.sensor.rangeDisplayBorderStyle || 'dashed';
    this.borderDefaultColor = this.sensor.rangeDisplayBorderDefaultColor || [150, 150, 150];
    this.borderColor = this.borderDefaultColor;

    /**
     * RangeDisplays have no height or color and rely on the associated DOM element's
     * CSS border to render their line.
     */
    this.borderWidth = 2;
    this.borderRadius = 100;
    this.width = this.sensor.sensitivity;
    this.height = this.sensor.sensitivity;
    this.minOpacity = 0.3;
    this.maxOpacity = 0.6;
    this.opacity = this.minOpacity;
    this.maxAngularVelocity = 1;
    this.minAngularVelocity = 0;
  }

  /**
   * Called every frame, step() updates the instance's properties.
   */
  step(): void {

    this.location.x = this.sensor.location.x;
    this.location.y = this.sensor.location.y;

    // TODO: do we need angularVelocity?
    /*var angularVelocity = Utils.map(this.sensor.parent.velocity.mag(),
        this.sensor.parent.minSpeed, this.sensor.parent.maxSpeed,
        this.maxAngularVelocity, this.minAngularVelocity);*/

    if (this.sensor.activated) {
      this.opacity = this.maxOpacity;
      this.borderColor = this.sensor.target.color;
    } else {
      this.opacity = this.minOpacity;
      this.borderColor = this.borderDefaultColor;
    }
  }

  /**
   * Updates the corresponding DOM element's style property.
   * @function draw
   * @memberof RangeDisplay
   */
  getStyle(): StyleProps {
    return {
      x: this.location.x - (this.width / 2),
      y: this.location.y - (this.height / 2),
      angle: this.angle,
      scale: this.scale || 1,
      width: this.width,
      height: this.height,
      colorMode: this.colorMode,
      borderRadius: this.borderRadius,
      borderWidth: this.borderWidth,
      borderStyle: this.borderStyle,
      borderColor0: this.borderColor[0],
      borderColor1: this.borderColor[1],
      borderColor2: this.borderColor[2],
      visibility: this.visibility
    };
  }

}
