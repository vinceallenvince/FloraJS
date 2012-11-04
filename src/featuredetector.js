/*global exports */
/**
 * Creates a new FeatureDetector.
 *
 * @constructor
 */
function FeatureDetector(options) {
  'use strict';
}

FeatureDetector.prototype.name = 'FeatureDetector';

/**
 * Checks if the class has a method to detect the passed feature.
 * If so, it calls the method.
 *
 * @param {string} feature The feature to check.
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.prototype.detect = function(feature) {

  'use strict';

  if (!this[feature]) {
    return false;
  }

  return this[feature].call(this);
};

/**
 * Checks if CSS Transforms are supported.
 *
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.prototype.csstransforms = function() {

  'use strict';

  var transforms = [
    '-webkit-transform: translateX(1px) translateY(1px)',
    '-moz-transform: translateX(1px) translateY(1px)',
    '-o-transform: translateX(1px) translateY(1px)',
    '-ms-transform: translateX(1px) translateY(1px)'
  ].join(';');

  var docFrag = document.createDocumentFragment();
  var div = document.createElement('div');
  docFrag.appendChild(div);
  div.style.cssText = transforms;

  var styles = [
    div.style.transform,
    div.style.webkitTransform,
    div.style.MozTransform,
    div.style.OTransform,
    div.style.msTransform
  ];
  var check = false;

  for (var i = 0; i < styles.length; i += 1) {
    if (styles[i]) {
      check = true;
      break;
    }
  }

  return check;
};

/**
 * Checks if CSS 3D transforms are supported.
 *
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.prototype.csstransforms3d = function() {

  'use strict';

  var transforms = [
    '-webkit-transform: translateX(1px) translateY(1px) translateZ(0)',
    '-moz-transform: translateX(1px) translateY(1px) translateZ(0)',
    '-o-transform: translateX(1px) translateY(1px) translateZ(0)',
    '-ms-transform: translateX(1px) translateY(1px) translateZ(0)'
  ].join(';');

  var docFrag = document.createDocumentFragment();
  var div = document.createElement('div');
  docFrag.appendChild(div);
  div.style.cssText = transforms;

  var styles = [
    div.style.transform,
    div.style.webkitTransform,
    div.style.MozTransform,
    div.style.OTransform,
    div.style.msTransform
  ];
  var check = false;

  for (var i = 0; i < styles.length; i += 1) {
    if (styles[i]) {
      check = true;
      break;
    }
  }

  return check;
};

/**
 * Checks if touch events are supported.
 *
 * @returns True if the feature is supported, false if not.
 */
FeatureDetector.prototype.touch = function() {

  'use strict';

  var el = document.createElement('div');
  el.setAttribute('ongesturestart', 'return;');
  if (typeof el.ongesturestart === "function") {
    return true;
  }
  return false;
};

exports.FeatureDetector = FeatureDetector;
