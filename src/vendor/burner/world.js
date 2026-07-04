var Vector = require('../vector2d-lib'),
    Item = require('./item'),
    Utils = require('../drawing-utils-lib');

/**
 * Creates a new World.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function World(opt_options) {

  Item.call(this);

  var options = opt_options || {};

  this.el = options.el || document.body;
  this.name = 'World';

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};
}
Utils.extend(World, Item);

/**
 * Measures an element's usable size. The body is measured via the
 * viewport (documentElement.clientWidth/Height): since browsers aligned
 * body.scrollHeight with the CSSOM spec, it reports the body's own
 * content height, which is 0 for a body whose children are all
 * absolutely positioned.
 *
 * @function measureSize
 * @memberof World
 * @param {Object} el A DOM element.
 * @returns {Object} A map with width and height properties.
 */
World.measureSize = function(el) {
  if (el === document.body) {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  }
  return {
    width: el.scrollWidth,
    height: el.scrollHeight
  };
};

/**
 * Resets all properties.
 * @function init
 * @memberof World
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = measured width] Width.
 * @param {number} [opt_options.height = measured height] Height.
 *
 */
World.prototype.init = function(world, opt_options) {

  World._superClass.init.call(this, this.world, opt_options);

  var options = opt_options || {};

  var size = World.measureSize(this.el);
  var bodySize = World.measureSize(document.body);

  this.color = options.color || [0, 0, 0];
  this.width = options.width || size.width;
  this.height = options.height || size.height;
  this.location = options.location || new Vector(bodySize.width / 2, bodySize.height / 2);
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [0, 0, 0];
  this.gravity = options.gravity || new Vector(0, 1);
  this.c = typeof options.c !== 'undefined' ? options.c : 0.1;
  this.pauseStep = !!options.pauseStep;
  this.pauseDraw = !!options.pauseDraw;
  this.el.className = this.name.toLowerCase();
  this._camera = this._camera || new Vector();
};

/**
 * Adds an item to the world's view.
 * @param {Object} item An instance of item.
 */
World.prototype.add = function(item) {
  this.el.appendChild(item);
};

/**
 * Applies forces to world.
 * @function step
 * @memberof World
 */
World.prototype.step = function() {
  this.location.add(this._camera);
};

/**
 * Updates the corresponding DOM element's style property.
 * @function draw
 * @memberof World
 */
World.prototype.draw = function() {
  var cssText = this.getCSSText({
    x: this.location.x - (this.width / 2),
    y: this.location.y - (this.height / 2),
    angle: this.angle,
    scale: this.scale || 1,
    width: this.width,
    height: this.height,
    color0: this.color[0],
    color1: this.color[1],
    color2: this.color[2],
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor1: this.borderColor[0],
    borderColor2: this.borderColor[1],
    borderColor3: this.borderColor[2]
  });
  this.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof World
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
World.prototype.getCSSText = function(props) {
  return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' + props.width + 'px; height: ' + props.height + 'px; background-color: rgb(' + props.color0 + ', ' + props.color1 + ', ' + props.color2 + '); border: ' + props.borderWidth + 'px ' + props.borderStyle + ' rgb(' + props.borderColor1 + ', ' + props.borderColor2 + ', ' + props.borderColor3 + ')';
};

module.exports = World;
