import Utils from './drawing-utils-lib';

/**
 * Creates a new ColorPalette object.
 *
 * Use this class to create a palette of colors randomly selected
 * from a range created with initial start and end colors. You
 * can also generate gradients that smoothly interpolate from
 * start and end colors.
 */
export default class ColorPalette {
  /**
   * Increments as each ColorPalette is created.
   * @type number
   * @default 0
   * @private
   */
  static _idCount = 0;

  name = 'ColorPalette';

  /**
   * Holds a list of arrays representing 3-digit color values
   * smoothly interpolated between start and end colors.
   * @private
   */
  _gradients: number[][][];

  /**
   * Holds a list of arrays representing 3-digit color values
   * randomly selected from start and end colors.
   * @private
   */
  _colors: number[][];

  id: string | number;

  /**
   * @param opt_id An optional id. If an id is not passed, a default id is created.
   */
  constructor(opt_id?: string | number) {
    this._gradients = [];
    this._colors = [];

    this.id = opt_id || ColorPalette._idCount;
    ColorPalette._idCount++; // increment id
  }

  /**
   * Creates a color range of 255 colors from the passed start and end colors.
   * Adds a random selection of these colors to the color property of
   * the color palette.
   *
   * @param options A set of required options
   *    that includes:
   *    options.min {number} The minimum number of colors to add.
   *    options.max {number} The maximum number of color to add.
   *    options.startColor {Array} The beginning color of the color range.
   *    options.endColor {Array} The end color of the color range.
   */
  addColor(options: { min: number, max: number, startColor: number[], endColor: number[] }): this {
    if (!options.min || !options.max || !options.startColor || !options.endColor) {
      throw new Error('ColorPalette.addColor must pass min, max, startColor and endColor options.');
    }

    var i, ln, colors;

    ln = Utils.getRandomNumber(options.min, options.max);
    colors = ColorPalette._createColorRange(options.startColor, options.endColor, 255);

    for (i = 0; i < ln; i++) {
      this._colors.push(colors[Utils.getRandomNumber(0, colors.length - 1)]);
    }

    return this;
  }

  /**
   * Creates an array of RGB color values interpolated between
   * a passed startColor and endColor.
   *
   * @param startColor The beginning of the color array.
   * @param endColor The end of the color array.
   * @param totalColors The total numnber of colors to create.
   * @returns An array of color values.
   */
  static _createColorRange(startColor: number[], endColor: number[], totalColors: number): number[][] {
    var i, colors: number[][] = [],
        startRed = startColor[0],
        startGreen = startColor[1],
        startBlue = startColor[2],
        endRed = endColor[0],
        endGreen = endColor[1],
        endBlue = endColor[2],
        diffRed, diffGreen, diffBlue,
        newRed, newGreen, newBlue;

    diffRed = endRed - startRed;
    diffGreen = endGreen - startGreen;
    diffBlue = endBlue - startBlue;

    for (i = 0; i < totalColors; i++) {
      newRed = parseInt(String(diffRed * i / totalColors), 10) + startRed;
      newGreen = parseInt(String(diffGreen * i / totalColors), 10) + startGreen;
      newBlue = parseInt(String(diffBlue * i / totalColors), 10) + startBlue;
      colors.push([newRed, newGreen, newBlue]);
    }
    return colors;
  }

  /**
   * @returns An array representing a randomly selected color
   *    from the colors property.
   * @throws {Error} If the colors property is empty.
   */
  getColor(): number[] {
    if (this._colors.length > 0) {
      return this._colors[Utils.getRandomNumber(0, this._colors.length - 1)];
    } else {
      throw new Error('ColorPalette.getColor: You must add colors via addColor() before using getColor().');
    }
  }

  // TODO: add the following

  /**
   * Adds color arrays representing a color range to the gradients property.
   *
   * @param {Object} options A set of required options
   *    that includes:
   *    options.startColor {Array} The beginning color of the color range.
   *    options.endColor {Array} The end color of the color range.
   *    options.totalColors {number} The total number of colors in the gradient.
   * @private
   */
  /*createGradient(options) {

    if (!options.startColor || !options.endColor || !options.totalColors) {
      throw new Error('ColorPalette.addColor must pass startColor, endColor and totalColors options.');
    }
    this.startColor = options.startColor;
    this.endColor = options.endColor;
    this.totalColors = options.totalColors || 255;
    this._gradients.push(ColorPalette._createColorRange(this.startColor, this.endColor, this.totalColors));
  }*/

  /**
   * Renders a strip of colors representing the color range
   * in the colors property.
   *
   * @param {Object} parent A DOM object to contain the color strip.
   */
  /*createSampleStrip(parent) {

    var i, max, div;

    for (i = 0, max = this._colors.length; i < max; i++) {
      div = document.createElement('div');
      div.className = 'color-sample-strip';
      div.style.background = 'rgb(' + this._colors[i].toString() + ')';
      parent.appendChild(div);
    }
  }*/
}
