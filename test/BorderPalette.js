var Burner = require('Burner'),
    test = require('tape'),
    BorderPalette, obj;

test('load BorderPalette.', function(t) {
  BorderPalette = require('../src/BorderPalette').BorderPalette;
  t.ok(BorderPalette, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  t.equal(BorderPalette._idCount, 0, '_idCount.');
  t.end();
});

test('new BorderPalette() should have default properties.', function(t) {

  var idCount = BorderPalette._idCount;

  obj = new BorderPalette();
  t.equal(obj.name, 'BorderPalette', 'name.');
  t.equal(obj._borders.length, 0, '_gradients.');
  t.equal(obj.id, 0, 'id.');
  t.equal(BorderPalette._idCount, 1, '_idCount should increment.');

  t.end();
});

test('addColor() should push color arrays on to a colors property.', function(t) {

  obj = new BorderPalette();

  t.throws(function () {
    obj.getBorder();
  }, 'should throw exception when trying to getColors before colors have been added via addBorder().');

  t.throws(function () {
    obj.addBorder();
  }, 'should throw exception when not passed options.');

  t.throws(function () {
    obj.addBorder({
    max: 8,
    style: 'dotted'
  });
  }, 'should throw exception when not passed min option.');

  t.throws(function () {
    obj.addBorder({
    min: 3,
    style: 'dotted'
  });
  }, 'should throw exception when not passed max option.');

  t.throws(function () {
    obj.addBorder({
    min: 3,
    max: 8
  });
  }, 'should throw exception when not passed style option.');

  obj.addBorder({
    min: 3,
    max: 8,
    style: 'dotted'
  });

  t.assert(obj._borders.length >= 3, 'should add greater than minimum borders.');
  t.assert(obj._borders.length <= 8, 'should add less than maximum borders.');
  t.assert(obj.getBorder() === 'dotted', 'getBorder() returns an added border style.');

  t.end();
});
