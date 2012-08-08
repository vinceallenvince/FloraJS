/*global window */
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

  exports.world = new exports.World();
  exports.world.configure(); // call configure after DOM has loaded
  exports.elements.push(exports.world);

  exports.Camera = new exports.Camera();

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

    var i, max;

    exports.requestAnimFrame(exports.animLoop);

    for (i = exports.elements.length - 1; i >= 0; i -= 1) {
      exports.elements[i].step();
      if (exports.elements[i]) {
        exports.elements[i].draw();
      }
      if (exports.world.clock) {
        exports.world.clock += 1;
      }
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