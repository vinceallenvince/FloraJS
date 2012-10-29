/*global exports */
/**
 * Creates a new FlowFieldMarker.
 *
 * @constructor
 * @param {Object} options Options.
 * @param {Object} options.location Location.
 * @param {number} options.scale Scale.
 * @param {number} options.opacity Opacity
 * @param {number} options.width Width.
 * @param {number} options.height Height.
 * @param {number} options.angle Angle.
 * @param {string} options.colorMode Color mode.
 * @param {Object} options.color Color.
 */
function FlowFieldMarker(options) {

  'use strict';

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

  if (exports.Interface.checkRequiredParams(options, requiredOptions)) {

    el = document.createElement("div");
    nose = document.createElement("div");
    el.className = "flowFieldMarker floraElement";
    nose.className = "nose";
    el.appendChild(nose);

    el.style.cssText = exports.Utils.getCSSText({
      x: options.location.x - options.width/2,
      y: options.location.y - options.height/2,
      s: options.scale,
      a: options.angle,
      o: options.opacity,
      w: options.width,
      h: options.height,
      cm: options.colorMode,
      color: options.color,
      z: options.zIndex,
      borderWidth: options.borderWidth,
      borderStyle: options.borderStyle,
      borderColor: options.borderColor,
      borderRadius: options.borderRadius,
      boxShadow: options.boxShadow
    });

    return el;
  }
}

FlowFieldMarker.prototype.name = 'FlowFieldMarker';

exports.FlowFieldMarker = FlowFieldMarker;