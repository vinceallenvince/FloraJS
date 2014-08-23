var Burner = require('burner'),
    test = require('tape'),
    SimplexNoise = require('quietriot'),
    Walker, obj;

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

test('load Walker.', function(t) {
  Walker = require('../src/Walker').Walker;
  t.ok(Walker, 'object loaded');
  t.end();
});

test('new Walker() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Walker: Walker
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Walker();
    obj.init(world);
  });

  t.notEqual(obj.name, 'Walker', 'System.add() shoud pass name.');
  t.equal(obj.width, 10, 'default width.');
  t.equal(obj.height, 10, 'default height.');
  t.equal(obj.remainsOnScreen, false, 'default remainsOnScreen.');
  t.equal(obj.maxSpeed, 1, 'default maxSpeed.');
  t.equal(obj.perlin, true, 'default perlin noise.');
  t.equal(obj.perlinSpeed, 0.005, 'default perlinSpeed.');
  t.equal(obj.perlinTime, 0, 'default perlinTime.');
  t.equal(obj.perlinAccelLow, -0.075, 'default perlinAccelLow.');
  t.equal(obj.perlinAccelHigh, 0.075, 'default perlinAccelHigh.');
  t.equal(typeof obj.perlinOffsetX, 'number', 'default perlinOffsetX.');
  t.equal(typeof obj.perlinOffsetY, 'number', 'default perlinOffsetY.');
  t.equal(obj.color[0], 255, 'default color r.');
  t.equal(obj.color[1], 150, 'default color g.');
  t.equal(obj.color[2], 50, 'default color b.');
  t.equal(obj.borderWidth, 0, 'default borderWidth.');
  t.equal(obj.borderStyle, 'none', 'default borderStyle.');
  t.equal(obj.borderColor[0], 255, 'default borderColor r.');
  t.equal(obj.borderColor[1], 255, 'default borderColor g.');
  t.equal(obj.borderColor[2], 255, 'default borderColor b.');
  t.equal(obj.opacity, 1, 'default opacity.');
  t.equal(obj.zIndex, 0, 'default zIndex.');
  t.equal(obj.borderRadius, 100, 'default borderRadius.');
  t.equal(obj._randomVector.x, 0, 'default _randomVector x.');
  t.equal(obj._randomVector.y, 0, 'default _randomVector y.');

  t.end();
});

test('new Walker() should have custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Walker: Walker
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Walker', {
      width: 100,
      height: 200,
      remainsOnScreen: true,
      maxSpeed: 10,
      perlin: false,
      perlinSpeed: 0.1,
      perlinTime: 2000,
      perlinAccelLow: -1,
      perlinAccelHigh: 1,
      perlinOffsetX: 200,
      perlinOffsetY: 100,
      color: [5, 10, 200],
      borderWidth: 3,
      borderStyle: 'dotted',
      borderColor: [100, 110, 120],
      borderRadius: 30,
      opacity: 1,
      zIndex: 0
    });
  });

  t.equal(obj.width, 100, 'custom width.');
  t.equal(obj.height, 200, 'custom height.');
  t.equal(obj.remainsOnScreen, true, 'custom remainsOnScreen.');
  t.equal(obj.maxSpeed, 10, 'custom maxSpeed.');
  t.equal(obj.perlin, false, 'custom perlin noise.');
  t.equal(obj.perlinSpeed, 0.1, 'custom perlinSpeed.');
  t.equal(obj.perlinTime, 2000, 'custom perlinTime.');
  t.equal(obj.perlinAccelLow, -1, 'custom perlinAccelLow.');
  t.equal(obj.perlinAccelHigh, 1, 'custom perlinAccelHigh.');
  t.equal(obj.perlinOffsetX, 200, 'custom perlinOffsetX.');
  t.equal(obj.perlinOffsetY, 100, 'custom perlinOffsetY.');
  t.equal(obj.color[0], 5, 'custom color r.');
  t.equal(obj.color[1], 10, 'custom color g.');
  t.equal(obj.color[2], 200, 'custom color b.');
  t.equal(obj.borderWidth, 3, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.equal(obj.borderColor[0], 100, 'custom borderColor r.');
  t.equal(obj.borderColor[1], 110, 'custom borderColor g.');
  t.equal(obj.borderColor[2], 120, 'custom borderColor b.');
  t.equal(obj.borderRadius, 30, 'custom borderRadius.');
  t.equal(obj.opacity, 1, 'default opacity.');
  t.equal(obj.zIndex, 0, 'default zIndex.');

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Walker: Walker
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker'); // add your new object to the system
  });

  Burner.System._stepForward();

  t.equal(obj.el.style.width, '10px', 'el.style width.');
  t.equal(obj.el.style.height, '10px', 'el.style height.');
  t.equal(obj.el.style.backgroundColor, 'rgb(255, 150, 50)', 'el.style backgroundColor');
  t.equal(obj.el.style.borderTopWidth, '0px', 'el.style border top width');
  t.equal(obj.el.style.borderRightWidth, '0px', 'el.style border right width');
  t.equal(obj.el.style.borderBottomWidth, '0px', 'el.style border bottom width');
  t.equal(obj.el.style.borderLeftWidth, '0px', 'el.style border left width');
  t.equal(obj.el.style.borderTopStyle, 'none', 'el.style border top style');
  t.equal(obj.el.style.borderRightStyle, 'none', 'el.style border right style');
  t.equal(obj.el.style.borderBottomStyle, 'none', 'el.style border bottom style');
  t.equal(obj.el.style.borderLeftStyle, 'none', 'el.style border left style');
  t.equal(obj.el.style.borderTopColor, 'rgb(255, 255, 255)', 'el.style border top color');
  t.equal(obj.el.style.borderRightColor, 'rgb(255, 255, 255)', 'el.style border right color');
  t.equal(obj.el.style.borderBottomColor, 'rgb(255, 255, 255)', 'el.style border bottom color');
  t.equal(obj.el.style.borderLeftColor, 'rgb(255, 255, 255)', 'el.style border left color');
  t.notEqual(obj.el.style.borderTopLeftRadius.search('100%'), -1, 'el.style border top left radius');
  t.notEqual(obj.el.style.borderTopRightRadius.search('100%'), -1, 'el.style border top right radius');
  t.notEqual(obj.el.style.borderBottomRightRadius.search('100%'), -1, 'el.style border bottom right radius');
  t.notEqual(obj.el.style.borderBottomLeftRadius.search('100%'), -1, 'el.style border bottom left radius');
  t.equal(obj.el.style.opacity, '1', 'el.style opacity');
  t.equal(obj.el.style.zIndex, '0', 'el.style zIndex');

  t.end();

});

test('step() should update oscillator location.', function(t) {

  beforeTest();

  SimplexNoise.config({
    random: function() {
      return 0.1;
    }
  });

  var obj;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker', {
      perlin: true,
      perlinOffsetX: 1000,
      perlinOffsetY: 1000,
      remainsOnScreen: false
    });
  });

  Burner.System._stepForward();

  t.equal(parseFloat(obj.location.x.toFixed(2)), 200.00, 'obj.location.x updated via perlin noise.');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 150.00, 'obj.location.y updated via perlin noise.');

  //

  beforeTest();

  var obj;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker', {
      perlin: true,
      perlinOffsetX: 1000,
      perlinOffsetY: 1000,
      remainsOnScreen: true
    });
  });

  Burner.System._stepForward();

  t.equal(parseFloat(obj.location.x.toFixed(2)), 195.65, 'obj.location.x restricted to screen width; updated via perlin noise.');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 153.27, 'obj.location.y restricted to screen height; updated via perlin noise.');

  //

  beforeTest();

  var obj, x, y;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker', {
      perlin: false
    });
  });

  x = obj.location.x;
  y = obj.location.y;

  Burner.System._stepForward();

  t.assert(obj.location.x !== x, 'obj.location.x is updated by a random amount.');
  t.assert(obj.location.y !== y, 'obj.location.y is updated by a random amount.');

  t.end();

});


