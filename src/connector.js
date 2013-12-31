/*global Burner */
/**
 * Creates a new Connector.
 *
 * Connectors render a straight line between two Flora items. The Connector carries
 * a reference to the two items as parentA and parentB. If the parent items move,
 * the Connector moves with them.
 *
 * @constructor
 * @extends Burner.Item
 * @param {Object} [opt_options=] A map of initial properties.
 */
function Connector(opt_options) {
  var options = opt_options || {};
  options.name = options.name || 'Connector';
  Burner.Item.call(this, options);
}
Utils.extend(Connector, Burner.Item);

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
Connector.prototype.init = function(options) {

  if (!options || !options.parentA || !options.parentB) {
    throw new Error('Connector: both parentA and parentB are required.');
  }
  this.parentA = options.parentA;
  this.parentB = options.parentB;

  this.zIndex = options.zIndex || 0;

  this.borderStyle = typeof options.borderStyle === 'undefined' ? 'dotted' : options.borderStyle;
  this.borderColor = typeof options.borderColor === 'undefined' ? [150, 150, 150] : options.borderColor;

  /**
   * Connectors have no height or color and rely on the associated DOM element's
   * CSS border to render their line.
   */
  this.borderWidth = 1;
  this.borderRadius = 0;
  this.height = 0;
  this.color = 'transparent';
};

/**
 * Called every frame, step() updates the instance's properties.
 */
Connector.prototype.step = function() {

  var a = this.parentA.location,
      b = this.parentB.location;

  this.width = Math.floor(Burner.Vector.VectorSub(this.parentA.location,
      this.parentB.location).mag());

  this.location = Burner.Vector.VectorAdd(this.parentA.location,
      this.parentB.location).div(2); // midpoint = (v1 + v2)/2

  this.angle = Utils.radiansToDegrees(Math.atan2(b.y - a.y, b.x - a.x) );
};
