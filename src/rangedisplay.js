/*global Burner */
/**
 * Creates a new RangeDisplay.
 *
 * A RangeDisplay is parented to a sensor and displays the sensor's
 * sensitivity range.
 *
 * @constructor
 * @extends Burner.Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
function RangeDisplay(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'RangeDisplay';
  Burner.Item.call(this, options);
}
Utils.extend(RangeDisplay, Burner.Item);

/**
 * Initializes an instance.
 *
 * @param {Object} options A map of initial properties.
 * @param {Object} parentA The object that starts the connection.
 * @param {Object} parentB The object that ends the connection.
 * @param {number} [options.zIndex = 0] zIndex.
 * @param {string} [options.borderStyle = 'dotted'] Border style.
 * @param {Array} [options.borderColor = 150, 150, 150] Border color.
 */
RangeDisplay.prototype.init = function(options) {

  if (!options || !options.sensor) {
    throw new Error('RangeDisplay: a sensor is required.');
  }
  this.sensor = options.sensor;

  this.zIndex = options.zIndex || 10;

  this.borderStyle = typeof options.borderStyle === 'undefined' ? 'dashed' : options.borderStyle;
  this.borderColor = typeof options.borderColor === 'undefined' ? [150, 150, 150] : options.borderColor;

  /**
   * RangeDisplays have no height or color and rely on the associated DOM element's
   * CSS border to render their line.
   */
  this.borderWidth = 2;
  this.borderRadius = 100;
  this.width = this.sensor.sensitivity;
  this.height = this.sensor.sensitivity;
  this.opacity = 0.5;
  this.color = 'transparent';
};

/**
 * Called every frame, step() updates the instance's properties.
 */
RangeDisplay.prototype.step = function() {
  this.location = this.sensor.location;
};
