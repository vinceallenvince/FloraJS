/*global Burner, document */
/**
 * Creates a new FlowFieldMarker.
 *
 * @constructor
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
function FlowFieldMarker(options) {

  var requiredOptions = {
        location: 'object',
        scale: 'number',
        angle: 'number',
        opacity: 'number',
        width: 'number',
        height: 'number',
        colorMode: 'string',
        color: 'array'
      }, el, nose;

  if (Interface.checkRequiredParams(options, requiredOptions)) {

    el = document.createElement('div');
    nose = document.createElement('div');
    el.className = 'flowFieldMarker item';
    nose.className = 'nose';
    el.appendChild(nose);

    el.style.cssText = Burner.System.getCSSText({
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
  }
}

FlowFieldMarker.prototype.name = 'FlowFieldMarker';
