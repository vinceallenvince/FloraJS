import Utils from './drawing-utils-lib';

/**
 * Creates a new BorderPalette object.
 *
 * Use this class to create a palette of border styles.
 */
export default class BorderPalette {
  /**
   * Increments as each BorderPalette is created.
   * @type number
   * @default 0
   * @private
   */
  static _idCount = 0;

  name = 'BorderPalette';

  /**
   * Holds a list of border styles.
   * @private
   */
  _borders: string[];

  id: string | number;

  /**
   * @param opt_id An optional id. If an id is not passed, a default id is created.
   */
  constructor(opt_id?: string | number) {
    this._borders = [];

    this.id = opt_id || BorderPalette._idCount;
    BorderPalette._idCount++; // increment id
  }

  /**
   * Adds a random number of the passed border style to the 'borders' array.
   *
   * @param options A set of required options
   *    that includes:
   *    options.min {number} The minimum number of styles to add.
   *    options.max {number} The maximum number of styles to add.
   *    options.style {string} The border style.
   */
  addBorder(options: { min: number, max: number, style: string }): this {
    if (!options.min || !options.max || !options.style) {
      throw new Error('BorderPalette.addBorder requires min, max and style paramaters.');
    }

    for (var i = 0, ln = Utils.getRandomNumber(options.min, options.max); i < ln; i++) {
      this._borders.push(options.style);
    }

    return this;
  }

  /**
   * @returns A style randomly selected from the 'borders' property.
   * @throws {Error} If the 'borders' property is empty.
   */
  getBorder(): string {
    if (this._borders.length > 0) {
      return this._borders[Utils.getRandomNumber(0, this._borders.length - 1)];
    }

    throw new Error('BorderPalette.getBorder: You must add borders via addBorder() before using getBorder().');
  }
}
