/*global Burner */
/**
 * Creates a new FlowField.
 *
 * @constructor
 */
function FlowField(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'FlowField';
  Burner.Item.call(this, options);
}
Utils.extend(FlowField, Burner.Item);

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
 */
FlowField.prototype.init = function(opt_options) {

  var options = opt_options || {};

  this.resolution = typeof options.resolution === 'undefined' ? 50 : options.resolution;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.01 : options.perlinSpeed;
  this.perlinTime = typeof options.perlinTime === 'undefined' ? 100 : options.perlinTime;
  this.field = options.field || null;
  this.createMarkers = !!options.createMarkers;
  // if a world is not passed, use the first world in the system
  this.world = options.world || Burner.System.firstWorld();
};

/**
 * Builds a FlowField.
 */
FlowField.prototype.build = function() {

  var col, colMax, row, rowMax, x, y, theta, fieldX, fieldY, field, angle,
      vectorList = {},
      world = this.world,
      cols = Math.ceil(world.bounds[1] / parseFloat(this.resolution)),
      rows = Math.ceil(world.bounds[2] / parseFloat(this.resolution)),
      xoff = this.perlinTime, // create markers and vectors
      yoff;

  for (col = 0, colMax = cols; col < colMax ; col += 1) {
    yoff = this.perlinTime;
    vectorList[col] = {};
    for (row = 0, rowMax = rows; row < rowMax ; row += 1) {

      x = col * this.resolution + this.resolution / 2; // get location on the grid
      y = row * this.resolution + this.resolution / 2;

      theta = Utils.map(SimplexNoise.noise(xoff, yoff, 0.1), 0, 1, 0, Math.PI * 2); // get the vector based on Perlin noise
      fieldX = Math.cos(theta);
      fieldY = Math.sin(theta);
      field = new Burner.Vector(fieldX, fieldY);
      vectorList[col][row] = field;
      angle = Utils.radiansToDegrees(Math.atan2(fieldY, fieldX)); // get the angle of the vector

      if (this.createMarkers) {

        var ffm = new FlowFieldMarker({ // create the marker
          location: new Burner.Vector(x, y),
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
        });
        world.el.appendChild(ffm);
      }
      yoff += parseFloat(this.perlinSpeed);
    }
    xoff += parseFloat(this.perlinSpeed);
  }
  this.field = vectorList;
};
