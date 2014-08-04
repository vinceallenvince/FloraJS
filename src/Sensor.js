var Item = require('Burner').Item,
    Mover = require('./Mover').Mover,
    Utils = require('Burner').Utils,
    Vector = require('Burner').Vector;

/**
 * Creates a new Sensor object.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {string} [opt_options.type = ''] The type of stimulator that can activate this sensor. eg. 'cold', 'heat', 'light', 'oxygen', 'food', 'predator'
 * @param {string} [opt_options.behavior = ''] The vehicle carrying the sensor will invoke this behavior when the sensor is activated.
 * @param {number} [opt_options.sensitivity = 200] The higher the sensitivity, the farther away the sensor will activate when approaching a stimulus.
 * @param {number} [opt_options.width = 7] Width.
 * @param {number} [opt_options.height = 7] Height.
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the sensor's parent.
 * @param {number} [opt_options.offsetAngle = 0] The angle of rotation around the vehicle carrying the sensor.
 * @param {number} [opt_options.opacity = 0.75] Opacity.
 * @param {Object} [opt_options.target = null] A stimulator.
 * @param {boolean} [opt_options.activated = false] True if sensor is close enough to detect a stimulator.
 * @param {Array} [opt_options.activatedColor = [255, 255, 255]] The color the sensor will display when activated.
 * @param {number} [opt_options.borderRadius = 100] Border radius.
 * @param {number} [opt_options.borderWidth = 2] Border width.
 * @param {string} [opt_options.borderStyle = 'solid'] Border style.
 * @param {Array} [opt_options.borderColor = [255, 255, 255]] Border color.
 * @param {Function} [opt_options.onConsume = null] If sensor.behavior == 'CONSUME', sensor calls this function when consumption is complete.
 */
function Sensor(opt_options) {
  Mover.call(this);
  var options = opt_options || {};

  this.name = options.name || 'Sensor';
  this.type = options.type || '';
  this.behavior = options.behavior || function() {};
  this.sensitivity = typeof options.sensitivity !== 'undefined' ? options.sensitivity : 200;
  this.width = typeof options.width !== 'undefined' ? options.width : 7;
  this.height = typeof options.height !== 'undefined' ? options.height : 7;
  this.offsetDistance = typeof options.offsetDistance !== 'undefined' ? options.offsetDistance : 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.opacity = typeof options.opacity !== 'undefined' ? options.opacity : 0.75;
  this.target = options.target || null;
  this.activated = !!options.activated;
  this.activatedColor = options.activatedColor || [255, 255, 255];
  this.borderRadius = typeof options.borderRadius !== 'undefined' ? options.borderRadius : 100;
  this.borderWidth = typeof options.borderWidth !== 'undefined' ? options.borderWidth : 2;
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [255, 255, 255];
  this.onConsume = options.onConsume || null;
}
Utils.extend(Sensor, Mover);

/**
 * Initializes Sensor.
 * @param  {Object} world       An instance of World.
 * @param  {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.borderWidth = this.width / 4] Border width.
 * @param {number} [opt_options.boxShadowSpread = this.width / 4] Box-shadow spread.
 */
Sensor.prototype.init = function(world, opt_options) {
  Sensor._superClass.init.call(this, world, opt_options);
  var options = opt_options || {};

  this.displayRange = !!options.displayRange;
  /*if (this.displayRange) {
    this.rangeDisplay = this.createRangeDisplay();
  }*/
  this.displayConnector = !!options.displayConnector;

  this.activationLocation = new Vector();
  this._force = new Vector(); // used as a cache Vector



};

module.exports.Sensor = Sensor;
