var Burner = require('burner'),
    test = require('tape'),
    Attractor = require('../src/attractor'),
    Repeller = require('../src/repeller'),
    Dragger = require('../src/dragger'),
    Mover, obj;

var evts = {};

Burner.Utils.addEvent = function(el, type, handler) {
  evts[type] = handler;
};

function beforeTest() {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
}

test('load Mover.', function(t) {
  Mover = require('../src/mover');
  t.ok(Mover, 'object loaded');
  t.end();
});

test('new Mover() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Mover();
    obj.init(world);
  });

  t.notEqual(obj.name, 'Mover', 'System.add() should pass name.');
  t.assert(obj.color[0] === 255 && obj.color[1] === 255 && obj.color[2] === 255, 'color.');
  t.equal(obj.borderRadius, 0, 'borderRadius.');
  t.equal(obj.borderWidth, 0, 'borderWidth.');
  t.equal(obj.borderStyle, 'none', 'borderStyle.');
  t.assert(obj.borderColor[0] === 0 && obj.borderColor[1] === 0 && obj.borderColor[2] === 0, 'borderColor.');
  t.equal(obj.pointToDirection, true, 'pointToDirection.');
  t.equal(obj.draggable, false, 'draggable.');
  t.equal(obj.parent, null, 'parent.');
  t.equal(obj.pointToParentDirection, true, 'pointToParentDirection.');
  t.equal(obj.offsetAngle, 0, 'offsetAngle.');
  t.end();
});

test('new Mover() should accept custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Mover', {
      color: [10, 10, 10],
      borderRadius: 50,
      borderWidth: 10,
      borderStyle: 'dotted',
      borderColor: [20, 20, 20],
      pointToDirection: false,
      draggable: true,
      parent: {},
      pointToParentDirection: true,
      offsetDistance: 30,
      offsetAngle: 10,
      beforeStep: function() {},
      afterStep: function() {}
    });
  });

  t.assert(obj.color[0] === 10 && obj.color[1] === 10 && obj.color[2] === 10, 'color.');
  t.equal(obj.borderRadius, 50, 'borderRadius.');
  t.equal(obj.borderWidth, 10, 'borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'borderStyle.');
  t.assert(obj.borderColor[0] === 20 && obj.borderColor[1] === 20 && obj.borderColor[2] === 20, 'borderColor.');
  t.equal(obj.pointToDirection, false, 'pointToDirection.');
  t.equal(obj.draggable, true, 'draggable.');
  t.assert(typeof obj.parent, 'object', 'parent.');
  t.equal(obj.pointToParentDirection, true, 'pointToParentDirection.');
  t.equal(obj.offsetDistance, 30, 'offsetDistance.');
  t.equal(obj.offsetAngle, 10, 'offsetAngle.');
  t.assert(typeof obj.beforeStep, 'function', 'beforeStep.');
  t.assert(typeof obj.afterStep, 'function', 'afterStep.');

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover'); // add your new object to the system
    obj.draw();
  });

  t.equal(obj.el.style.width, '10px', 'el.style width.');
  t.equal(obj.el.style.height, '10px', 'el.style height.');
  t.equal(obj.el.style.backgroundColor, 'rgb(255, 255, 255)', 'el.style backgroundColor');
  t.equal(obj.el.style.borderTopWidth, '0px', 'el.style border top width');
  t.equal(obj.el.style.borderRightWidth, '0px', 'el.style border right width');
  t.equal(obj.el.style.borderBottomWidth, '0px', 'el.style border bottom width');
  t.equal(obj.el.style.borderLeftWidth, '0px', 'el.style border left width');
  t.equal(obj.el.style.borderTopStyle, 'none', 'el.style border top style');
  t.equal(obj.el.style.borderRightStyle, 'none', 'el.style border right style');
  t.equal(obj.el.style.borderBottomStyle, 'none', 'el.style border bottom style');
  t.equal(obj.el.style.borderLeftStyle, 'none', 'el.style border left style');
  t.equal(obj.el.style.borderTopColor, 'rgb(0, 0, 0)', 'el.style border top color');
  t.equal(obj.el.style.borderRightColor, 'rgb(0, 0, 0)', 'el.style border right color');
  t.equal(obj.el.style.borderBottomColor, 'rgb(0, 0, 0)', 'el.style border bottom color');
  t.equal(obj.el.style.borderLeftColor, 'rgb(0, 0, 0)', 'el.style border left color');
  t.notEqual(obj.el.style.borderTopLeftRadius.search('0%'), -1, 'el.style border top left radius');
  t.notEqual(obj.el.style.borderTopRightRadius.search('0%'), -1, 'el.style border top right radius');
  t.notEqual(obj.el.style.borderBottomRightRadius.search('0%'), -1, 'el.style border bottom right radius');
  t.notEqual(obj.el.style.borderBottomLeftRadius.search('0%'), -1, 'el.style border bottom left radius');
  t.equal(obj.isMouseOut, false, 'isMouseOut.');
  t.equal(obj.isPressed, false, 'isPressed.');
  t.equal(obj.mouseOutInterval, false, 'mouseOutInterval.');
  t.equal(obj._friction instanceof Burner.Vector, true, 'friction.');

  t.end();
});

test('mouseover() should update properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      draggable: true
    });

    evts.mouseover.call(obj, {});

    t.equal(obj.isMouseOut, false, 'mouseover sets isMouseOut to false.');
    t.equal(obj.mouseOutInterval, false, 'mouseover clears mouseOutInterval.');
  });

  t.end();
});

test('mousedown() should update properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      draggable: true
    });

    evts.mousedown.call(obj, {
      target: {
        offsetLeft: 100,
        offsetTop: 100,
        pageX: 10,
        pageY: 10
      }
    });

    t.equal(obj.isPressed, true, 'mouseover sets isPressed to true.');
    t.equal(obj.isMouseOut, false, 'mouseover sets isMouseOut to false.');
  });

  t.end();
});

test('mousemove() should update properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      draggable: true
    });
    obj.isPressed = true;
    obj.world.el.offsetLeft = 0;
    obj.world.el.offsetTop = 0;

    evts.mousemove.call(obj, {
      pageX: 200,
      pageY: 100
    });

    t.equal(obj.isMouseOut, false, 'mousemove sets isMouseOut to false.');

    t.equal(obj.location.x, 200, 'mousemove sets location.x');
    t.equal(obj.location.y, 100, 'mousemove sets location.y');

    evts.mousemove.call(obj, {
      clientX: 200,
      clientY: 100
    });

    t.equal(obj.location.x, 200, 'mousemove sets location.x');
    t.equal(obj.location.y, 100, 'mousemove sets location.y');
  });

  t.end();
});

test('mouseup() should update properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      draggable: true
    });

    evts.mouseup.call(obj, {});
    t.equal(obj.isPressed, false, 'mouseover sets isPressed to false.');
  });

  t.end();
});

test('mouseout() should update properties on an interval.', function(t) {
  t.plan(2);
  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      draggable: true
    });

    obj.isPressed = true;
    Burner.System.mouse.location.x = 500;
    Burner.System.mouse.location.y = 500;

    evts.mouseout.call(obj, {});

    setTimeout(function() {
      t.equal(obj.location.x, 500, 'mouseout updates location x.');
      t.equal(obj.location.x, 500, 'mouseout updates location y.');
    }, 100);

  });

});

test('step() should update location.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover');

    var y = obj.location.y;

    obj.step();
    t.equal(obj.location.y, y + 0.1, 'step() updates location.');
  });

  t.end();
});

test('step() should update location only if obj is not static.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      isStatic: true
    });

    var y = obj.location.y;

    obj.step();
    t.equal(obj.location.y, y, 'isStatic = true; location does not change.');
  });

  t.end();
});

test('step() should update location only if obj is not pressed.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover');

    var y = obj.location.y;

    obj.isPressed = true;
    obj.step();
    t.equal(obj.location.y, y, 'isPressed = true; location does not change.');
  });

  t.end();
});

test('step() should calculate new angle if pointToDirection = true.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300,
      gravity: new Burner.Vector(0.3, 1)
    });
    obj = this.add('Mover');

    obj.step();
    t.equal(parseInt(obj.angle.toPrecision(2)), 73, 'pointToDirection angle.');
  });

  t.end();
});

test('checkWorldEdges() should restrict obj location to world boundaries.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      checkWorldEdges: true,
      location: new Burner.Vector(-10, -10)
    });

    obj.step();
    t.equal(obj.location.x, obj.width / 2, 'checkWorldEdges should restrict obj x.location to world boundary.');
    t.equal(obj.location.y, obj.height / 2, 'checkWorldEdges should restrict obj y.location to world boundary.');

  });

  t.end();
});

test('wrapWorldEdges() should calculate a new location.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      checkWorldEdges: false,
      wrapWorldEdges: true,
      location: new Burner.Vector(-10, -10)
    });

    obj.step();
    t.equal(obj.location.x, obj.world.width + obj.width / 2, 'wrapWorldEdges should wrap obj x.location to opposite world boundary.');
    t.equal(obj.location.y, obj.world.height + obj.height / 2, 'wrapWorldEdges should wrap obj y.location to opposite world boundary.');

  });

  t.end();
});

test('if obj.controlCamera = true, obj world should move in the opposite direction.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      controlCamera: true
    });

    obj.step();
    obj.world.step();
    // TODO: fix
    //t.equal(obj.world.location.x, 200, 'checkCameraEdges should move world x pos in opposite direction from item.');
    //t.equal(obj.world.location.y, 149.9, 'checkCameraEdges should move world y pos in opposite direction from item.');

  });

  t.end();
});

test('if obj has a parent and offsetDistance = 0, obj location should match parent location.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var parent = this.add('Mover', {
      location: new Burner.Vector(100, 100)
    });
    obj = this.add('Mover', {
      parent: parent,
      location: new Burner.Vector(50, 50)
    });

    obj.step();

    t.equal(obj.location.x, 100, 'obj location.x should match parent location.x');
    t.equal(obj.location.y, 100, 'obj location.y should match parent location.y');

  });

  t.end();
});

test('if obj has a parent and offsetDistance/offsetAngle, obj location should match parent location minus offsetDistance/offsetAngle.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var parent = this.add('Mover', {
      location: new Burner.Vector(100, 100)
    });
    obj = this.add('Mover', {
      parent: parent,
      offsetDistance: -60,
      offsetAngle: 30,
      location: new Burner.Vector(50, 50)
    });

    obj.step();

    t.equal(parseInt(obj.location.x.toPrecision(2)), 48, 'obj location.x should match parent location.x minus offsetDistance/offsetAngle');
    t.equal(parseInt(obj.location.y.toPrecision(2)), 70, 'obj location.y should match parent location.y minus offsetDistance/offsetAngle');

  });

  t.end();
});

test('step() should decrement life.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      life: 97,
      lifespan: 100
    });

    obj.step();
    obj.step();
    obj.step();
    t.equal(obj.life, 100, 'obj.life should increment.');

    obj.step();
    t.equal(Burner.System._records.length, 1, 'If life > lifespan, step() should remove the object.');

  });

  t.end();
});

test('step() should call afterStep().', function(t) {

  beforeTest();

  var obj, val = 100;

  Burner.System.Classes = {
    Mover: Mover
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Mover', {
      afterStep: function() {val = 30;}
    });

  });

  obj.step();
  t.equal(val, 30, 'step() calls afterStep().');
  t.end();
});

test('should apply forces from Attractors, Repellers and Draggers.', function(t) {

  beforeTest();

  var obj, val = 100;

  Burner.System.Classes = {
    Mover: Mover,
    Attractor: Attractor,
    Repeller: Repeller,
    Dragger: Dragger
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Mover');
    this.add('Attractor');
    this.add('Attractor');
    this.add('Repeller');
    this.add('Repeller');
    this.add('Dragger');
    this.add('Dragger');
  });

  Burner.System._stepForward();

  var attractors = Burner.System.getAllItemsByName('Attractor');
  t.equal(attractors.length, 2, 'should apply forces from attractors.');

  var repellers = Burner.System.getAllItemsByName('Repeller');
  t.equal(repellers.length, 2, 'should apply forces from repellers.');

  var draggers = Burner.System.getAllItemsByName('Dragger');
  t.equal(draggers.length, 2, 'should apply forces from draggers.');

  // TODO: test force applied

  t.end();
});
