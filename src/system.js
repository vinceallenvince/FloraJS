/*global exports, window */
/**
 * Creates a new System.
 *
 * @constructor
 */
function System() {

  'use strict';
}

System.name = 'System';

/**
 * A list of instructions to execute before the system starts.
 */
System.setup = null;

/**
 * Starts the System.
 * @param {function} func A list of instructions to execute before the system starts.
 * @param {Object} opt_universe A map of options for the System's Universe.
 * @param {Array} opt_worlds An array of DOM elements to use as Worlds.
 */
System.start = function (func, opt_universe, opt_worlds) {

  'use strict';

  var i, max,
      defaultColorList = exports.config.defaultColorList;

  this.universeOptions = opt_universe || null;
  this.worlds = opt_worlds || null;

  this._featureDetector = new exports.FeatureDetector();

  this.supportedFeatures = {};
  this.supportedFeatures.csstransforms = this._featureDetector.detect('csstransforms');
  this.supportedFeatures.csstransforms3d = this._featureDetector.detect('csstransforms3d');
  this.supportedFeatures.touch = this._featureDetector.detect('touch');

  exports.liquids = [];
  exports.repellers = [];
  exports.attractors = [];
  exports.heats = [];
  exports.colds = [];
  exports.lights = [];
  exports.oxygen = [];
  exports.food = [];
  exports.predators = [];

  exports.mouse = {
    loc: new exports.Vector(),
    locLast: new exports.Vector()
  };

  // create elementList before universe
  exports.elementList = new exports.ElementList();

  exports.universe = new exports.Universe(this.universeOptions);
  if (exports.Interface.getDataType(this.worlds) === 'array') {
    for (i = 0, max = this.worlds.length; i < max; i += 1) {
      exports.universe.addWorld({
        el: this.worlds[i]
      });
    }
  } else {
    exports.universe.addWorld();
  }

  exports.camera = new exports.Camera();

  // add default colors
  exports.defaultColors = new exports.ColorTable();
  for (i = 0, max = defaultColorList.length; i < max; i++) {
    exports.defaultColors.addColor({
      name: defaultColorList[i].name,
      startColor: defaultColorList[i].startColor,
      endColor: defaultColorList[i].endColor
    });
  }

  exports.animLoop = function () {

    var i, max,
        universe = exports.universe,
        world = universe.first(),
        elements = exports.elementList.all();

    if (universe.isPlaying) {
      window.requestAnimFrame(exports.animLoop);

      if (universe.zSorted) {
        elements = elements.sort(function(a,b){return (b.zIndex - a.zIndex);});
      }

      for (i = elements.length - 1; i >= 0; i -= 1) {
        elements[i].step();
        if (elements[i]) {
          elements[i].draw();
        }
      }

      exports.universe.updateClocks();
    }
  };


  func = exports.Interface.getDataType(func) === "function" ? func : function () {};
  System.setup = func;

  func();
  exports.animLoop();
};

/**
 * Destroys a System.
 */
System.destroy = function () {
  'use strict';
  exports.elementList.destroyAll();
};

exports.System = System;