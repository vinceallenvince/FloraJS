var Burner = require('Burner'),
    test = require('tape'),
    ColorPalette, obj;

function beforeTest() {
  ColorPalette._idCount = 0;
}

test('load ColorPalette.', function(t) {
  ColorPalette = require('../src/ColorPalette').ColorPalette;
  t.ok(ColorPalette, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  beforeTest();
  t.equal(ColorPalette._idCount, 0, '_idCount.');
  t.end();
});

test('new ColorPalette() should have default properties.', function(t) {
  beforeTest();
  var idCount = ColorPalette._idCount;

  obj = new ColorPalette();
  t.equal(obj.name, 'ColorPalette', 'name.');
  t.equal(obj._gradients.length, 0, '_gradients.');
  t.equal(obj._colors.length, 0, '_colors.');
  t.equal(obj.id, 0, 'id.');
  t.equal(ColorPalette._idCount, 1, '_idCount should increment.');

  t.end();
});

test('addColor() should push color arrays on to a colors property.', function(t) {
  beforeTest();
  obj = new ColorPalette();

  t.throws(function () {
    obj.getColor();
  }, 'should throw exception when trying to getColors before colors have been added via addColor().');

  t.throws(function () {
    obj.addColor();
  }, 'should throw exception when not passed options.');
  t.throws(function () {
    obj.addColor({
    max: 8,
    startColor: [255, 0, 0],
    endColor: [0, 0, 0]
  });
  }, 'should throw exception when not passed min option.');
  t.throws(function () {
    obj.addColor({
    min: 3,
    startColor: [255, 0, 0],
    endColor: [0, 0, 0]
  });
  }, 'should throw exception when not passed max option.');
  t.throws(function () {
    obj.addColor({
    min: 3,
    max: 8,
    endColor: [0, 0, 0]
  });
  }, 'should throw exception when not passed startColor option.');
  t.throws(function () {
    obj.addColor({
    min: 3,
    max: 8,
    startColor: [255, 0, 0]
  });
  }, 'should throw exception when not passed endColor option.');

  obj.addColor({
    min: 3,
    max: 8,
    startColor: [100, 0, 0],
    endColor: [0, 0, 0]
  });

  t.assert(obj._colors.length >= 2, 'should add greater than minimum colors.');
  t.assert(obj._colors.length <= 9, 'should add less than maximum colors.');
  t.assert(obj.getColor()[1] >= 0 && obj.getColor()[1] <= 100), 'color value is within passed range.';

  t.end();
});




