/*global exports */
/**
 * Creates a new FeatureDetector.
 *
 * @constructor
 */
function FeatureDetector(options) {
  'use strict';
}

/**
 * Define a name property.
 */
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

  //
// The Modernizr.touch test only indicates if the browser supports
//    touch events, which does not necessarily reflect a touchscreen
//    device, as evidenced by tablets running Windows 7 or, alas,
//    the Palm Pre / WebOS (touch) phones.
//
// Additionally, Chrome (desktop) used to lie about its support on this,
//    but that has since been rectified: crbug.com/36415
//
// We also test for Firefox 4 Multitouch Support.
//
// For more info, see: modernizr.github.com/Modernizr/touch.html
//
/*
Modernizr.addTest('touch', function() {
    var bool;

    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        bool = true;
    } else {
        var query = ['@media (',Modernizr._prefixes.join('touch-enabled),('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
        Modernizr.testStyles(query, function( node ) {
            bool = node.offsetTop === 9;
        });
    }

    return bool;
});*/


  var el = document.createElement('div');
  el.setAttribute('ongesturestart', 'return;');
  if (typeof el.ongesturestart === "function") {
    return true;
  }
  return false;
};

exports.FeatureDetector = FeatureDetector;
