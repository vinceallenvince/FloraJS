/** @namespace */
var Flora = {},
    exports = Flora;

(function(exports){
  
  /**
   * Creates a new FloraSystem.
   * @namespace
   * @constructor
   */
  function FloraSystem (el) {

    this.el = el || null;
    
    Flora.elements = [];
    Flora.liquids = [];
    Flora.repellers = [];
    Flora.attractors = [];
    Flora.heats = [];
    Flora.colds = [];
    Flora.lights = [];
    Flora.oxygen = [];
    Flora.food = [];
    Flora.predators = [];

    Flora.World = new Flora.World();
    Flora.World.configure(); // call configure after DOM has loaded
    Flora.elements.push(Flora.World);

    Flora.Camera = new Flora.Camera();

    Flora.destroyElement = function (id) {

      var i, max;

      for (i = 0, max = this.elements.length; i < max; i += 1) {
        if (this.elements[i].id === id) {
          Flora.World.el.removeChild(this.elements[i].el);
          this.elements.splice(i, 1);
          break;
        }
      }
    }
    
    Flora.interval = setInterval(function () {
      
      var i, max;

      for (i = Flora.elements.length - 1; i >= 0; i -= 1) {
        Flora.elements[i].step();
        if (Flora.elements[i]) {
          Flora.elements[i].draw();
        }
        if (Flora.World.clock) {
          Flora.World.clock += 1;
        }
      }
    }, 16);

  };

  /**
   * Starts a FloraSystem.
   * @param {function} func A list of instructions to execute when the system starts.
   */
  FloraSystem.prototype.start = function (func) {
    var func = Flora.Interface.getDataType(func) === "function" ? func : function () {}; 
    func.call();
  };

  exports.FloraSystem = FloraSystem;
}(exports));
