var Burner = require('Burner'),
    test = require('tape'),
    Point, obj;

function beforeTest() {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
}

test('load Point.', function(t) {
  Point = require('../src/Point').Point;
  t.ok(Point, 'object loaded');
  t.end();
});

test('new Point() should have default properties.', function(t) {

  beforeTest();

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

test('new Point() should accept custom properties.', function(t) {

  beforeTest();

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

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Point: Point
  };

  Burner.System.setup(function() {
    this.add('World');
    obj = this.add('Point'); // add your new object to the system
    obj.draw();
    t.equal(obj.el.style.width, '10px', 'el.style width.');
    t.equal(obj.el.style.height, '10px', 'el.style height.');
    t.equal(obj.el.style.backgroundColor, 'rgb(200, 200, 200)', 'el.style backgroundColor');
    t.equal(obj.el.style.borderTopWidth, '2px', 'el.style border top width');
    t.equal(obj.el.style.borderRightWidth, '2px', 'el.style border right width');
    t.equal(obj.el.style.borderBottomWidth, '2px', 'el.style border bottom width');
    t.equal(obj.el.style.borderLeftWidth, '2px', 'el.style border left width');
    t.equal(obj.el.style.borderTopStyle, 'solid', 'el.style border top style');
    t.equal(obj.el.style.borderRightStyle, 'solid', 'el.style border right style');
    t.equal(obj.el.style.borderBottomStyle, 'solid', 'el.style border bottom style');
    t.equal(obj.el.style.borderLeftStyle, 'solid', 'el.style border left style');
    t.equal(obj.el.style.borderTopColor, 'rgb(60, 60, 60)', 'el.style border top color');
    t.equal(obj.el.style.borderRightColor, 'rgb(60, 60, 60)', 'el.style border right color');
    t.equal(obj.el.style.borderBottomColor, 'rgb(60, 60, 60)', 'el.style border bottom color');
    t.equal(obj.el.style.borderLeftColor, 'rgb(60, 60, 60)', 'el.style border left color');
    t.equal(obj.el.style.borderTopLeftRadius, '100% 100%', 'el.style border top left radius');
    t.equal(obj.el.style.borderTopRightRadius, '100% 100%', 'el.style border top right radius');
    t.equal(obj.el.style.borderBottomRightRadius, '100% 100%', 'el.style border bottom right radius');
    t.equal(obj.el.style.borderBottomLeftRadius, '100% 100%', 'el.style border bottom left radius');
  });

  t.end();
});
