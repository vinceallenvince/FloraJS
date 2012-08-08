/** 
    A module representing a FlowField.
    @module FlowField
 */

/**
 * Creates a new FlowField.
 *
 * @constructor
 * @param {Object} [opt_options] Options.
 * @param {number} [opt_options.resolution = 50] The lower the value, the more vectors are created to define the flow field. Low values increase processing time to create the field.
 * @param {number} [opt_options.perlinSpeed = 0.01] The speed to move through the Perlin Noise space.
 * @param {number} [opt_options.perlinTime = 100] Sets the Perlin Noise time.
 * @param {Object} [opt_options.field = null] A list of vectors that define the flow field.
 * @param {Object} [opt_options.createMarkers = false] Set to true to visualize the flow field.
 */   
function FlowField(opt_options) {

  'use strict';

  var options = opt_options || {};

  this.resolution = options.resolution || 50;
  this.perlinSpeed = options.perlinSpeed || 0.01;
  this.perlinTime = options.perlinTime || 100;
  this.field = options.field || null;
  this.createMarkers = options.createMarkers || false;
}

/**
 * Builds a FlowField. 
 */ 
FlowField.prototype.build = function() {

  'use strict';

  var i, max, col, colMax, row, rowMax, x, y, theta, fieldX, fieldY, field, angle,
      vectorList = {},
      world = exports.world,
      cols = Math.ceil(world.width/parseFloat(this.resolution)),
      rows = Math.ceil(world.height/parseFloat(this.resolution)),
      xoff = this.perlinTime, // create markers and vectors
      yoff;
  
  for (col = 0, colMax = cols; col < colMax ; col += 1) {
    yoff = this.perlinTime;
    vectorList[col] = {};
    for (row = 0, rowMax = rows; row < rowMax ; row += 1) {

      x = col * this.resolution + this.resolution / 2; // get location on the grid
      y = row * this.resolution + this.resolution / 2;

      theta = exports.Utils.map(exports.SimplexNoise.noise(xoff, yoff, 0.1), 0, 1, 0, Math.PI * 2); // get the vector based on Perlin noise
      fieldX = Math.cos(theta);
      fieldY = Math.sin(theta);
      field = exports.PVector.create(fieldX, fieldY);
      vectorList[col][row] = field;
      angle = exports.Utils.radiansToDegrees(Math.atan2(fieldY, fieldX)); // get the angle of the vector
      
      if (this.createMarkers) {

        var ffm = new exports.FlowFieldMarker({ // create the marker
          location: exports.PVector.create(x, y),
          scale: 1,
          opacity: exports.Utils.map(angle, -360, 360, 0.1, 1),
          width: this.resolution,
          height: this.resolution/2,
          field: field,
          angle: angle,
          colorMode: "rgb",
          color: {
            r: 200,
            g: 100,
            b: 50
          }
        });
        exports.world.el.appendChild(ffm);
      }
      yoff += parseFloat(this.perlinSpeed);
    }
    xoff += parseFloat(this.perlinSpeed);
  }
  this.field = vectorList;
};

exports.FlowField = FlowField;