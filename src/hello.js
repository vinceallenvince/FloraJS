/*global exports*/
(function(exports) {

  var inherit = function(cls, superclass) {
    function F() {}
    F.prototype = superclass.prototype;
    cls.prototype = new F;
    cls.prototype.constructor = cls;
  }



  function Hello() {
    
  }
  inherit(Hello, exports.Obj);

  Hello.prototype.say = function () {
    console.log("hello");
  };

  exports.Hello = Hello;
}(exports));