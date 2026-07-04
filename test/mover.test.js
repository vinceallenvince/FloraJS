import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Attractor from '../src/attractor';
import Repeller from '../src/repeller';
import Dragger from '../src/dragger';
import Mover from '../src/mover';

var evts = {};

Burner.Utils.addEvent = function(el, type, handler) {
  evts[type] = handler;
};

let obj;

beforeEach(() => {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
});

test('load Mover.', () => {
  expect(Mover).toBeTruthy();
});

test('new Mover() should have default properties.', () => {
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

  expect(obj.name).not.toBe('Mover');
  expect(obj.color[0] === 255 && obj.color[1] === 255 && obj.color[2] === 255).toBeTruthy();
  expect(obj.borderRadius).toBe(0);
  expect(obj.borderWidth).toBe(0);
  expect(obj.borderStyle).toBe('none');
  expect(obj.borderColor[0] === 0 && obj.borderColor[1] === 0 && obj.borderColor[2] === 0).toBeTruthy();
  expect(obj.pointToDirection).toBe(true);
  expect(obj.draggable).toBe(false);
  expect(obj.parent).toBe(null);
  expect(obj.pointToParentDirection).toBe(true);
  expect(obj.offsetAngle).toBe(0);
});

test('new Mover() should accept custom properties.', () => {
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

  expect(obj.color[0] === 10 && obj.color[1] === 10 && obj.color[2] === 10).toBeTruthy();
  expect(obj.borderRadius).toBe(50);
  expect(obj.borderWidth).toBe(10);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 20 && obj.borderColor[1] === 20 && obj.borderColor[2] === 20).toBeTruthy();
  expect(obj.pointToDirection).toBe(false);
  expect(obj.draggable).toBe(true);
  expect(typeof obj.parent).toBe('object');
  expect(obj.pointToParentDirection).toBe(true);
  expect(obj.offsetDistance).toBe(30);
  expect(obj.offsetAngle).toBe(10);
  expect(typeof obj.beforeStep).toBe('function');
  expect(typeof obj.afterStep).toBe('function');
});

test('draw() should assign a css test string to the style property.', () => {
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

  expect(obj.el.style.width).toBe('10px');
  expect(obj.el.style.height).toBe('10px');
  expect(obj.el.style.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(obj.el.style.borderTopWidth).toBe('0px');
  expect(obj.el.style.borderRightWidth).toBe('0px');
  expect(obj.el.style.borderBottomWidth).toBe('0px');
  expect(obj.el.style.borderLeftWidth).toBe('0px');
  expect(obj.el.style.borderTopStyle).toBe('none');
  expect(obj.el.style.borderRightStyle).toBe('none');
  expect(obj.el.style.borderBottomStyle).toBe('none');
  expect(obj.el.style.borderLeftStyle).toBe('none');
  expect(obj.el.style.borderTopColor).toBe('rgb(0, 0, 0)');
  expect(obj.el.style.borderRightColor).toBe('rgb(0, 0, 0)');
  expect(obj.el.style.borderBottomColor).toBe('rgb(0, 0, 0)');
  expect(obj.el.style.borderLeftColor).toBe('rgb(0, 0, 0)');
  // jsdom does not expand the border-radius shorthand into longhand
  // properties, so assert on the shorthand.
  expect(obj.el.style.borderRadius.search('0%')).not.toBe(-1);
  expect(obj.isMouseOut).toBe(false);
  expect(obj.isPressed).toBe(false);
  expect(obj.mouseOutInterval).toBe(false);
  expect(obj._friction instanceof Burner.Vector).toBe(true);
});

test('mouseover() should update properties.', () => {
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

    expect(obj.isMouseOut).toBe(false);
    expect(obj.mouseOutInterval).toBe(false);
  });
});

test('mousedown() should update properties.', () => {
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

    expect(obj.isPressed).toBe(true);
    expect(obj.isMouseOut).toBe(false);
  });
});

test('mousemove() should update properties.', () => {
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
    // jsdom exposes offsetLeft/offsetTop as getters only; the original test
    // assigned them directly. defineProperty preserves the intent (offset = 0).
    Object.defineProperty(obj.world.el, 'offsetLeft', { value: 0 });
    Object.defineProperty(obj.world.el, 'offsetTop', { value: 0 });

    evts.mousemove.call(obj, {
      pageX: 200,
      pageY: 100
    });

    expect(obj.isMouseOut).toBe(false);

    expect(obj.location.x).toBe(200);
    expect(obj.location.y).toBe(100);

    evts.mousemove.call(obj, {
      clientX: 200,
      clientY: 100
    });

    expect(obj.location.x).toBe(200);
    expect(obj.location.y).toBe(100);
  });
});

test('mouseup() should update properties.', () => {
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
    expect(obj.isPressed).toBe(false);
  });
});

test('mouseout() should update properties on an interval.', async () => {
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
  });

  await new Promise(function(resolve) {
    setTimeout(resolve, 100);
  });

  expect(obj.location.x).toBe(500);
  expect(obj.location.y).toBe(500);
});

test('step() should update location.', () => {
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
    expect(obj.location.y).toBe(y + 0.1);
  });
});

test('step() should update location only if obj is not static.', () => {
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
    expect(obj.location.y).toBe(y);
  });
});

test('step() should update location only if obj is not pressed.', () => {
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
    expect(obj.location.y).toBe(y);
  });
});

test('step() should calculate new angle if pointToDirection = true.', () => {
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
    expect(parseInt(obj.angle.toPrecision(2))).toBe(73);
  });
});

test('checkWorldEdges() should restrict obj location to world boundaries.', () => {
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
    expect(obj.location.x).toBe(obj.width / 2);
    expect(obj.location.y).toBe(obj.height / 2);
  });
});

test('wrapWorldEdges() should calculate a new location.', () => {
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
    expect(obj.location.x).toBe(obj.world.width + obj.width / 2);
    expect(obj.location.y).toBe(obj.world.height + obj.height / 2);
  });
});

test('if obj.controlCamera = true, obj world should move in the opposite direction.', () => {
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
    //expect(obj.world.location.x).toBe(200);
    //expect(obj.world.location.y).toBe(149.9);
  });
});

test('if obj has a parent and offsetDistance = 0, obj location should match parent location.', () => {
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

    expect(obj.location.x).toBe(100);
    expect(obj.location.y).toBe(100);
  });
});

test('if obj has a parent and offsetDistance/offsetAngle, obj location should match parent location minus offsetDistance/offsetAngle.', () => {
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

    expect(parseInt(obj.location.x.toPrecision(2))).toBe(48);
    expect(parseInt(obj.location.y.toPrecision(2))).toBe(70);
  });
});

test('step() should decrement life.', () => {
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
    expect(obj.life).toBe(100);

    obj.step();
    expect(Burner.System._records.length).toBe(1);
  });
});

test('step() should call afterStep().', () => {
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
  expect(val).toBe(30);
});

test('should apply forces from Attractors, Repellers and Draggers.', () => {
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
  expect(attractors.length).toBe(2);

  var repellers = Burner.System.getAllItemsByName('Repeller');
  expect(repellers.length).toBe(2);

  var draggers = Burner.System.getAllItemsByName('Dragger');
  expect(draggers.length).toBe(2);

  // TODO: test force applied
});
