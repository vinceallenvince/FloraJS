/*global exports, window */
/**
 * Creates a new System.
 *
 * @constructor
 */
function System(opt_options) {

  'use strict';

  var i, max,
      options = opt_options || {},
      defaultColorList = exports.config.defaultColorList;

  this.el = options.world || null;
  this.universeOptions = options.universeOptions || null;

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
  if (exports.Interface.getDataType(this.el) === 'array') {
    for (i = 0, max = this.el.length; i < max; i += 1) {
      exports.universe.addWorld({
        el: this.el[i]
      });
    }
  } else {
    exports.universe.addWorld({
      el: this.el
    });
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
}

/**
 * Define a name property.
 */
System.prototype.name = 'florasystem';

/**
 * A list of instructions to execute before the system starts.
 */
System.setup = null;

/**
 * Starts a System.
 * @param {function} func A list of instructions to execute before the system starts.
 */
System.prototype.start = function (func) {

  'use strict';

  func = exports.Interface.getDataType(func) === "function" ? func : function () {};
  System.setup = func;

  func();
  exports.animLoop();
};

System.prototype.destroy = function () {
  'use strict';
  exports.elementList.destroyAll();
};

exports.System = System;