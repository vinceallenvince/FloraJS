var FlowFieldMarker = require('./FlowFieldMarker').FlowFieldMarker,
    Item = require('burner').Item,
    SimplexNoise = require('./SimplexNoise').SimplexNoise,
    System = require('burner').System,
    Utils = require('burner').Utils,
    Vector = require('burner').Vector;

/**
 * Creates a new FlowField.
 *
 * @constructor
 */
function FlowField() {
  Item.call(this);
}
Utils.extend(FlowField, Item);


/**
 * Initializes an instance.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.resolution = 50] The lower the value, the more vectors are created
 *    to define the flow field. Low values increase processing time to create the field.
 * @param {number} [opt_options.perlinSpeed = 0.01] The speed to move through the Perlin Noise space.
 * @param {number} [opt_options.perlinTime = 100] Sets the Perlin Noise time.
 * @param {Object} [opt_options.field = null] A list of vectors that define the flow field.
 * @param {Object} [opt_options.createMarkers = false] Set to true to visualize the flow field.
 * @param {Object} [opt_options.world = System.firstWorld()] The flowField's world.
 */
FlowField.prototype.init = function(world, opt_options) {
  FlowField._superClass.init.call(this, world, opt_options);

  var options = opt_options || {};

  this.resolution = typeof options.resolution !== 'undefined' ? options.resolution : 50;
  this.perlinSpeed = typeof options.perlinSpeed !== 'undefined' ? options.perlinSpeed : 0.01;
  this.perlinTime = typeof options.perlinTime !== 'undefined' ? options.perlinTime : 100;
  this.field = options.field || null;
  this.createMarkers = !!options.createMarkers;
  this.world = world;
  this.lifespan = -1;
};

/**
 * Builds a FlowField.
 */
FlowField.prototype.build = function() {

  var col, colMax, row, rowMax, x, y, theta, fieldX, fieldY, field, angle,
      vectorList = {},
      world = this.world,
      cols = Math.ceil(world.width / parseFloat(this.resolution)),
      rows = Math.ceil(world.height / parseFloat(this.resolution)),
      xoff = this.perlinTime, // create markers and vectors
      yoff;

  for (col = 0, colMax = cols; col < colMax ; col += 1) {

    yoff = this.perlinTime;
    vectorList[col] = {};
    for (row = 0, rowMax = rows; row < rowMax ; row += 1) {

      x = col * this.resolution + this.resolution / 2; // get location on the grid
      y = row * this.resolution + this.resolution / 2;

      theta = Utils.map(SimplexNoise.noise(xoff, yoff), 0, 1, 0, Math.PI * 2); // get the vector based on Perlin noise
      fieldX = Math.cos(theta);
      fieldY = Math.sin(theta);
      field = new Vector(fieldX, fieldY);
      vectorList[col][row] = field;
      angle = Utils.radiansToDegrees(Math.atan2(fieldY, fieldX)); // get the angle of the vector

      if (this.createMarkers) {

        var ffm = new FlowFieldMarker();
        world.el.appendChild(ffm.init({ // create the marker
          location: new Vector(x, y),
          scale: 1,
          opacity: Utils.map(angle, -360, 360, 0.1, 0.75),
          width: this.resolution,
          height: this.resolution/2,
          field: field,
          angle: angle,
          colorMode: 'rgb',
          color: [200, 100, 50],
          borderRadius: 0,
          zIndex: 0
        }));
      }
      yoff += parseFloat(this.perlinSpeed);
    }
    xoff += parseFloat(this.perlinSpeed);
  }
  this.field = vectorList;
};

FlowField.prototype.step = function() {};

FlowField.prototype.draw = function() {};

module.exports.FlowField = FlowField;
