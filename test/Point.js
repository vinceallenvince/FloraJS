var test = require('tape'),
    Point, obj;

test('load Point.', function(t) {
  Point = require('../src/Point').Point;
  t.ok(Point, 'object loaded');
  t.end();
});