var Item = require('burner').Item,
    System = require('burner').System,
    Utils = require('burner').Utils,
    Vector = require('burner').Vector;

/**
 * Creates a new FlowFieldMarker.
 *
 * @constructor
 */
function FlowFieldMarker() {
  Item.call(this);
}
Utils.extend(FlowFieldMarker, Item);

/**
 * Initializes an instance of FlowFieldMarker.
 *
 * @param {Object} options Options.
 * @param {Object} [options.location] Location.
 * @param {number} [options.scale] Scale.
 * @param {number} [options.opacity] Opacity
 * @param {number} [options.width] Width.
 * @param {number} [options.height] Height.
 * @param {number} [options.angle] Angle.
 * @param {string} [options.colorMode] Color mode.
 * @param {Object} [options.color] Color.
 */
FlowFieldMarker.prototype.init = function(options) {

  if (!options) {
    throw new Error('FlowFieldMarker requires location, scale, angle, opacity, width, height, colorMode, and color.');
  }

  var el = document.createElement('div');
  var nose = document.createElement('div');
  el.className = 'flowFieldMarker item';
  nose.className = 'nose';
  el.appendChild(nose);

  el.style.cssText = this.getCSSText({
    x: options.location.x - options.width / 2,
    y: options.location.y - options.height / 2,
    width: options.width,
    height: options.height,
    opacity: options.opacity,
    angle: options.angle,
    scale: 1,
    colorMode: options.colorMode,
    color0: options.color[0],
    color1: options.color[1],
    color2: options.color[2],
    zIndex: options.zIndex,
    borderRadius: options.borderRadius
  });

  return el;
};

FlowFieldMarker.prototype.getCSSText = function(props) {
  return Item._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' + props.width + 'px; height: ' + props.height + 'px; background-color: ' + props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') + '); opacity: ' + props.opacity + '; z-index: ' + props.zIndex + ';';
};

module.exports.FlowFieldMarker = FlowFieldMarker;
