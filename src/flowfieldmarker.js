/*global console, exports, Modernizr */
/**
    A module representing a FlowFieldMarker.
    @module FlowFieldMarker
 */

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
    el.className = "flowFieldMarker";
    nose.className = "nose";
    el.appendChild(nose);

    el.style.cssText = this.getCSSText({
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

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
FlowFieldMarker.name = 'flowfieldmarker';

/**
 * Builds a cssText string based on properties passed by the constructor.
 *
 * @param {Object} props Properties describing the marker.
 */
FlowFieldMarker.prototype.getCSSText = function(props) {

  'use strict';

  if (!props.color) {
    props.color = [];
    props.background = null;
  } else {
    props.background = props.cm + '(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';
  }

  if (!props.borderColor) {
    props.borderColor = [];
  }

  if (Modernizr.csstransforms3d) {
    return [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) translateZ(0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      'opacity: ' + props.o,
      'width: ' + props.w + 'px',
      'height: ' + props.h + 'px',
      'background: ' + props.background,
      'z-index: ' + props.z,
      'border-width: ' + props.borderWidth + 'px',
      'border-style: ' + props.borderStyle,
      'border-color: ' + props.cm + '(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')',
      'border-radius: ' + props.borderRadius,
      'box-shadow: ' + props.boxShadow
    ].join(';');
  } else if (Modernizr.csstransforms) {
    return [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      'opacity: ' + props.o,
      'width: ' + props.w + 'px',
      'height: ' + props.h + 'px',
      'background: ' + props.background,
      'z-index: ' + props.z,
      'border-width: ' + props.borderWidth + 'px',
      'border-style: ' + props.borderStyle,
      'border-color: ' + props.cm + '(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')',
      'border-radius: ' + props.borderRadius,
      'box-shadow: ' + props.boxShadow
    ].join(';');
  } else {
    return [
      'position: absolute',
      'left' + props.x + 'px',
      'top' + props.y + 'px',
      'width' + props.w + 'px',
      'height' + props.h + 'px',
      'background: ' + props.background,
      'opacity' + props.o,
      'z-index'+ props.z,
      'border-width: ' + props.borderWidth + 'px',
      'border-style: ' + props.borderStyle,
      'border-color: ' + props.cm + '(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')',
      'border-radius: ' + props.borderRadius,
      'box-shadow: ' + props.boxShadow
    ].join(';');
  }
};

exports.FlowFieldMarker = FlowFieldMarker;