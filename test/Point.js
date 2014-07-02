var Burner = require('Burner'),
    test = require('tape'),
    Point, obj;

test('load Point.', function(t) {
  Point = require('../src/Point').Point;
  t.ok(Point, 'object loaded');
  t.end();
});

test('new Item() should have default properties.', function(t) {
  obj = new Point();
  t.equal(obj.name, 'Point', 'name.');
  t.equal(obj.colorMode, 'rgb', 'name.');
  t.assert(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200, 'color.');
  t.equal(obj.borderRadius, 100, 'borderRadius.');
  t.equal(obj.borderWidth, 2, 'borderWidth.');
  t.equal(obj.borderStyle, 'solid', 'borderStyle.');
  t.assert(obj.borderColor[0] === 60 && obj.borderColor[1] === 60 && obj.borderColor[2] === 60, 'borderColor.');
  t.equal(obj.isStatic, true, 'isStatic.');
  t.end();
});

test('new Item() should accept custom properties.', function(t) {
  obj = new Point({
    name: 'hello',
    colorMode: 'hsb',
    color: [10, 10, 10],
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: [30, 30, 30],
    isStatic: false
  });
  t.equal(obj.name, 'hello', 'name.');
  t.equal(obj.colorMode, 'hsb', 'name.');
  t.assert(obj.color[0] === 10 && obj.color[1] === 10 && obj.color[2] === 10, 'color.');
  t.equal(obj.borderRadius, 10, 'borderRadius.');
  t.equal(obj.borderWidth, 1, 'borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'borderStyle.');
  t.assert(obj.borderColor[0] === 30 && obj.borderColor[1] === 30 && obj.borderColor[2] === 30, 'borderColor.');
  t.equal(obj.isStatic, true, 'isStatic.');
  t.end();
});

test('draw should assign a css test string to the style property.', function(t) {

  var obj;

  Burner.System.Classes = {
    Point: Point
  };

  Burner.System.setup(function() {
    obj = this.add('Point'); // add your new object to the system
    obj.draw();
    t.equal(obj.el.style.width, '10px', 'width.');
    t.equal(obj.el.style.height, '10px', 'height.');
    t.equal(obj.el.style.backgroundColor, 'rgb(200, 200, 200)', 'backgroundColor');
    t.equal(obj.el.style.border, '2px solid rgb(60, 60, 60)', 'border style');
  });

  t.end();
});

/*test('init() should require an instance of World.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  t.throws(function () {
    obj.init();
  }, 'should throw exception when not passed an instance of World.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world);
  t.equal(obj.name, 'Item');
  t.equal(obj.width, 10, 'default width.');
  t.equal(obj.height, 10, 'default height.');
  t.equal(obj.scale, 1, 'default scale.');
  t.equal(obj.angle, 0, 'default angle.');
  t.equal(obj.color[0], 0, 'default color red.');
  t.equal(obj.color[1], 0, 'default color green.');
  t.equal(obj.color[2], 0, 'default color blue.');
  t.equal(obj.mass, 10, 'default mass.');
  t.equal(obj.acceleration.x, 0, 'default acceleration x');
  t.equal(obj.acceleration.y, 0, 'default acceleration y');
  t.equal(obj.velocity.x, 0, 'default velocity x');
  t.equal(obj.velocity.y, 0, 'default velocity y');
  t.equal(typeof obj.location.x, 'number', 'default location x');
  t.equal(typeof obj.location.y, 'number', 'default location y');
  t.equal(obj.maxSpeed, 10, 'default maxSpeed.');
  t.equal(obj.minSpeed, 0, 'default minSpeed.');
  t.equal(obj.bounciness, 0.5, 'default bounciness.');
  t.equal(obj.checkWorldEdges, true, 'default checkWorldEdges.');
  t.equal(obj.wrapWorldEdges, false, 'default checkWorldEdges.');
  t.equal(typeof obj.beforeStep, 'function', 'default beforeStep');
  t.equal(obj._force.x, 0, 'force cache x.');
  t.equal(obj._force.y, 0, 'force cache y.');
  t.equal(obj.id, 'Item3', 'should have an id.');
  t.equal(typeof obj.el, 'object', 'should have a DOM element as a view.');
  t.equal(obj.el.style.position, 'absolute', 'should have absolute positioning.');
  t.equal(obj.el.style.top, '-5000px', 'should be positioned off screen.');
  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');
  t.end();
});
*/
