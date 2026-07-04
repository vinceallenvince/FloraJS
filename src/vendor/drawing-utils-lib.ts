/**
 * Assorted drawing and math helpers.
 */
const Utils = {
  name: 'Utils',

  /**
   * Generates a pseudo-random number within an inclusive range.
   * @param low The low end of the range.
   * @param high The high end of the range.
   * @param flt Set to true to return a float or when passing floats as a range.
   */
  getRandomNumber(low: number, high: number, flt?: boolean): number {
    if (flt) {
      return (Math.random() * (high - low)) + low;
    }
    high++;
    return Math.floor((Math.random() * (high - low))) + low;
  },

  /**
   * Determines the size of the browser window.
   */
  getWindowSize(): { width: number, height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },

  /**
   * Re-maps a number from one range to another.
   * @param value The value to be converted.
   * @param min1 Lower bound of the value's current range.
   * @param max1 Upper bound of the value's current range.
   * @param min2 Lower bound of the value's target range.
   * @param max2 Upper bound of the value's target range.
   */
  map(value: number, min1: number, max1: number, min2: number, max2: number): number {
    var unitratio = (value - min1) / (max1 - min1);
    return (unitratio * (max2 - min2)) + min2;
  },

  /**
   * Adds an event listener to a DOM element.
   * @param target The element to receive the event listener.
   * @param eventType The event type.
   * @param handler The function to run when the event is triggered.
   */
  addEvent(target: EventTarget, eventType: string, handler: EventListener): void {
    target.addEventListener(eventType, handler, false);
  },

  /**
   * Converts degrees to radians.
   */
  degreesToRadians(degrees: number): number {
    if (typeof degrees !== 'undefined') {
      return 2 * Math.PI * (degrees / 360);
    }
    throw new Error('Error: Utils.degreesToRadians is missing degrees param.');
  },

  /**
   * Converts radians to degrees.
   */
  radiansToDegrees(radians: number): number {
    if (typeof radians !== 'undefined') {
      return radians * (180 / Math.PI);
    }
    throw new Error('Error: Utils.radiansToDegrees is missing radians param.');
  },

  /**
   * Constrain a value within a range.
   */
  constrain(val: number, low: number, high: number): number {
    if (val > high) {
      return high;
    } else if (val < low) {
      return low;
    }
    return val;
  },

  /**
   * Determines if one object is inside another.
   * @param obj The object.
   * @param container The containing object.
   */
  isInside(obj: any, container: any): boolean {
    if (!obj || !container) {
      throw new Error('isInside() requires both an object and a container.');
    }

    obj.width = obj.width || 0;
    obj.height = obj.height || 0;
    container.width = container.width || 0;
    container.height = container.height || 0;

    return obj.location.x + obj.width / 2 > container.location.x - container.width / 2 &&
      obj.location.x - obj.width / 2 < container.location.x + container.width / 2 &&
      obj.location.y + obj.height / 2 > container.location.y - container.height / 2 &&
      obj.location.y - obj.height / 2 < container.location.y + container.height / 2;
  },

  /**
   * Capitalizes the first character in a string.
   */
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};

export default Utils;
