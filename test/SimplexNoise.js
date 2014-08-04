var Burner = require('Burner'),
    Vector = Burner.Vector,
    test = require('tape'),
    SimplexNoise, obj;

function beforeTest() {
  SimplexNoise.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  SimplexNoise.p = [];
  SimplexNoise.perm = [];
}

test('load SimplexNoise.', function(t) {
  SimplexNoise = require('../src/SimplexNoise').SimplexNoise;
  t.ok(SimplexNoise, 'object loaded');
  t.end();
});

test('SimplexNoise noise() should return a number bw -1 and 1.', function(t) {

  beforeTest();

  t.assert(SimplexNoise.noise(100, 100) >= -1 && SimplexNoise.noise(100, 100) <= 1, 'returns number bw -1 and 1.');

  SimplexNoise.config({
    random: function() {
      return 0.5;
    }
  });

  t.equal(parseFloat(SimplexNoise.noise(100, 100).toFixed(2)), 0.41, 'fixed random function returns a consistent number.');

  t.end();

});

test('SimplexNoise config() should populate SimplexNoise.p.', function(t) {

  beforeTest();

  SimplexNoise.config();

  t.assert(SimplexNoise.p[0] >= 0 && SimplexNoise.p[0] <= 256, 'should use Math.random.');

  SimplexNoise.config({
    random: function() {
      return 0.1;
    }
  });

  t.equal(SimplexNoise.p[0], 25, 'should use custom random function.');

  t.end();

});

test('SimplexNoise noise() should return a number bw -1 and 1.', function(t) {

  var perlinTime, mult = 10;

  for (var i = 0; i < 10; i++) {
    perlinTime = i * 10;
    t.assert(SimplexNoise.noise(-perlinTime, perlinTime) >= -1 && SimplexNoise.noise(perlinTime, -perlinTime) <= 1, 'returns number bw -1 and 1.');
    t.assert(SimplexNoise.noise(perlinTime, 0) >= -1 && SimplexNoise.noise(-perlinTime, 0) <= 1, 'returns number bw -1 and 1.');
    t.assert(SimplexNoise.noise(0, perlinTime) >= -1 && SimplexNoise.noise(0, -perlinTime) <= 1, 'returns number bw -1 and 1.');
  }

  t.end();
});
