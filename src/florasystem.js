/*global exports, window */
/**
    A module representing a FloraSystem.
    @module florasystem
 */

/**
 * Creates a new FloraSystem.
 *
 * @constructor
 */
function FloraSystem(el) {

  'use strict';

  var i, max,
      defaultColorList = exports.config.defaultColorList;

  this.el = el || null;

  exports.elements = [];
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
    loc: exports.PVector.create(0, 0),
    locLast: exports.PVector.create(0, 0)
  };

  exports.world = new exports.World();
  exports.world.configure(); // call configure after DOM has loaded
  exports.elements.push(exports.world);

  exports.Camera = new exports.Camera();

  // save the current and last mouse position
  exports.Utils.addEvent(document.body, 'mousemove', function(e) {
    exports.mouse.locLast = exports.mouse.loc.clone();
    exports.mouse.loc = exports.PVector.create(e.pageX, e.pageY);
  });

  // toggle the world playstate
  exports.Utils.addEvent(document, 'keyup', function(e) {
    if (e.keyCode === exports.config.keyMap.toggleWorldPlaystate) {
      exports.world.isPlaying = !exports.world.isPlaying;
      if (exports.world.isPlaying) {
        window.requestAnimFrame(exports.animLoop);
      }
    }
  });

  // add default colors
  exports.defaultColors = new exports.ColorTable();
  for (i = 0, max = defaultColorList.length; i < max; i++) {
    exports.defaultColors.addColor({
      name: defaultColorList[i].name,
      startColor: defaultColorList[i].startColor,
      endColor: defaultColorList[i].endColor
    });
  }

  exports.destroyElement = function (id) {

    var i, max;

    for (i = 0, max = this.elements.length; i < max; i += 1) {
      if (this.elements[i].id === id) {
        exports.world.el.removeChild(this.elements[i].el);
        this.elements.splice(i, 1);
        break;
      }
    }
  };

  exports.animLoop = function () {

    var i, max,
        world = exports.world,
        elements = exports.elements;

    if (exports.world.isPlaying) {
      window.requestAnimFrame(exports.animLoop);

      if (world.zSorted) {
        elements = elements.sort(function(a,b){return (b.zIndex - a.zIndex);});
      }

      for (i = elements.length - 1; i >= 0; i -= 1) {
        elements[i].step();
        if (elements[i]) {
          elements[i].draw();
        }
      }
      world.clock += 1;
    }
  };
}

/**
 * Starts a FloraSystem.
 * @param {function} func A list of instructions to execute when the system starts.
 */
FloraSystem.prototype.start = function (func) {

  'use strict';

  func = exports.Interface.getDataType(func) === "function" ? func : function () {};

  func.call();
  exports.animLoop();
};

exports.FloraSystem = FloraSystem;