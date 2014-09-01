var Burner = require('burner'),
    Vector = Burner.Vector,
    test = require('tape'),
    SimplexNoise = require('quietriot'),
    Oscillator, obj;

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

test('load Oscillator.', function(t) {
  Oscillator = require('../src/Oscillator');
  t.ok(Oscillator, 'object loaded');
  t.end();
});

test('new Oscillator() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Oscillator: Oscillator
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Oscillator();
    obj.init(world);
  });

  t.notEqual(obj.name, 'Oscillator', 'System.add() should pass name.');
  t.assert(obj.initialLocation.x === 200 && obj.initialLocation.y === 150, 'default initialLocation.');
  t.assert(obj.lastLocation.x === 0 && obj.lastLocation.y === 0, true, 'default lastLocation.');
  t.assert(obj.amplitude.x === 180 && obj.amplitude.y === 130, 'default amplitude.');
  t.equal(obj.acceleration instanceof Vector, true, 'default acceleration.');
  t.equal(obj.aVelocity instanceof Vector, true, 'default aVelocity.');
  t.equal(obj.isStatic, false, 'default isStatic.');
  t.equal(obj.perlin, false, 'default perlin.');
  t.equal(obj.perlinSpeed, 0.005, 'default perlinSpeed.');
  t.equal(obj.perlinTime, 0, 'default perlinTime.');
  t.equal(obj.perlinAccelLow, -2, 'default perlinAccelLow.');
  t.equal(obj.perlinAccelHigh, 2, 'default perlinAccelHigh.');
  t.equal(typeof obj.perlinOffsetX, 'number', 'default perlinOffsetX.');
  t.equal(typeof obj.perlinOffsetY, 'number', 'default perlinOffsetY.');
  t.equal(obj.width, 20, 'default width.');
  t.equal(obj.height, 20, 'default height.');
  t.assert(obj.color[0] === 200 && obj.color[1] === 100 && obj.color[2] === 0, 'default color.');
  t.equal(obj.borderWidth, 0, 'default borderWidth.');
  t.equal(obj.borderStyle, 'solid', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 255 && obj.borderColor[1] === 150 && obj.borderColor[2] === 50, 'default borderColor.');
  t.equal(obj.borderRadius, 100, 'default borderRadius.');
  t.equal(obj.boxShadowOffsetX, 0, 'default boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 0, 'default boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 0, 'default boxShadowBlur.');
  t.equal(obj.boxShadowSpread, 0, 'default boxShadowSpread.');
  t.assert(obj.boxShadowColor[0] === 200 && obj.boxShadowColor[1] === 100 && obj.boxShadowColor[2] === 0, 'default boxShadowColor.');

  t.end();
});

test('new Oscillator() should have custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Oscillator: Oscillator
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Oscillator', {
      acceleration: new Vector(),
      aVelocity: new Vector(),
      isStatic: true,
      perlin: true,
      perlinSpeed: 0.001,
      perlinTime: 100,
      perlinAccelLow: -3,
      perlinAccelHigh: 3,
      perlinOffsetX: 100,
      perlinOffsetY: 100,
      width: 10,
      height: 10,
      color: [100, 50, 10],
      borderWidth: 20,
      borderStyle: 'dotted',
      borderColor: [150, 10, 10],
      borderRadius: 30,
      boxShadowOffsetX: 10,
      boxShadowOffsetY: 10,
      boxShadowBlur: 4,
      boxShadowSpread: 10,
      boxShadowColor: [10, 30, 80],
      opacity: 0.5,
      zIndex: 200
    });
  });

  t.equal(obj.acceleration instanceof Vector, true, 'custom acceleration.');
  t.equal(obj.aVelocity instanceof Vector, true, 'custom aVelocity.');
  t.equal(obj.isStatic, true, 'custom isStatic.');
  t.equal(obj.perlin, true, 'custom perlin.');
  t.equal(obj.perlinSpeed, 0.001, 'custom perlinSpeed.');
  t.equal(obj.perlinTime, 100, 'custom perlinTime.');
  t.equal(obj.perlinAccelLow, -3, 'custom perlinAccelLow.');
  t.equal(obj.perlinAccelHigh, 3, 'custom perlinAccelHigh.');
  t.equal(obj.perlinOffsetX, 100, 'custom perlinOffsetX.');
  t.equal(obj.perlinOffsetY, 100, 'custom perlinOffsetY.');
  t.equal(obj.width, 10, 'custom width.');
  t.equal(obj.height, 10, 'custom height.');
  t.assert(obj.color[0] === 100 && obj.color[1] === 50 && obj.color[2] === 10, 'custom color.');
  t.equal(obj.borderWidth, 20, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 150 && obj.borderColor[1] === 10 && obj.borderColor[2] === 10, 'custom borderColor.');
  t.equal(obj.borderRadius, 30, 'custom borderRadius.');
  t.equal(obj.boxShadowOffsetX, 10, 'custom boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 10, 'custom boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 4, 'custom boxShadowBlur.');
  t.equal(obj.boxShadowSpread, 10, 'custom boxShadowSpread.');
  t.assert(obj.boxShadowColor[0] === 10 && obj.boxShadowColor[1] === 30 && obj.boxShadowColor[2] === 80, 'custom boxShadowColor.');
  t.equal(obj.opacity, 0.5, 'custom opacity.');
  t.equal(obj.zIndex, 200, 'custom zIndex.');

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Oscillator: Oscillator
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator'); // add your new object to the system
  });

  Burner.System._stepForward();

  t.equal(obj.el.style.width, '20px', 'el.style width.');
  t.equal(obj.el.style.height, '20px', 'el.style height.');
  t.equal(obj.el.style.backgroundColor, 'rgb(200, 100, 0)', 'el.style backgroundColor');
  t.equal(obj.el.style.borderTopWidth, '0px', 'el.style border top width');
  t.equal(obj.el.style.borderRightWidth, '0px', 'el.style border right width');
  t.equal(obj.el.style.borderBottomWidth, '0px', 'el.style border bottom width');
  t.equal(obj.el.style.borderLeftWidth, '0px', 'el.style border left width');
  t.equal(obj.el.style.borderTopStyle, 'solid', 'el.style border top style');
  t.equal(obj.el.style.borderRightStyle, 'solid', 'el.style border right style');
  t.equal(obj.el.style.borderBottomStyle, 'solid', 'el.style border bottom style');
  t.equal(obj.el.style.borderLeftStyle, 'solid', 'el.style border left style');
  t.equal(obj.el.style.borderTopColor, 'rgb(255, 150, 50)', 'el.style border top color');
  t.equal(obj.el.style.borderRightColor, 'rgb(255, 150, 50)', 'el.style border right color');
  t.equal(obj.el.style.borderBottomColor, 'rgb(255, 150, 50)', 'el.style border bottom color');
  t.equal(obj.el.style.borderLeftColor, 'rgb(255, 150, 50)', 'el.style border left color');
  t.notEqual(obj.el.style.borderTopLeftRadius.search('100%'), -1, 'el.style border top left radius');
  t.notEqual(obj.el.style.borderTopRightRadius.search('100%'), -1, 'el.style border top right radius');
  t.notEqual(obj.el.style.borderBottomRightRadius.search('100%'), -1, 'el.style border bottom right radius');
  t.notEqual(obj.el.style.borderBottomLeftRadius.search('100%'), -1, 'el.style border bottom left radius');
  t.notEqual(obj.el.style.boxShadow.search('0px 0px 0px 0px'), -1, 'el.style boxShadow');
  t.equal(obj.el.style.opacity, '0.75', 'el.style opacity');
  t.equal(obj.el.style.zIndex, '1', 'el.style zIndex');

  t.end();

});

test('step() should update oscillator location.', function(t) {

  beforeTest();

  var obj;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator', {
      isStatic: true,
      isPressed: false,
      initialLocation: new Burner.Vector(100, 100)
    });
  });

  Burner.System._stepForward();

  t.equal(parseFloat(obj.location.x.toFixed(2)), 100, 'obj.location.x equals initialLocation.x if isStatic = true.');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 100, 'obj.location.y equals initialLocation.y if isStatic = true.');

  //

  beforeTest();

  var obj;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator', {
      initialLocation: new Burner.Vector(100, 100),
      pointToDirection: true,
      life: 99,
      lifespan: 100
    });
  });

  Burner.System._stepForward();

  t.equal(parseFloat(obj.location.x.toFixed(2)), 101.8, 'obj.location.x updated.');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 100, 'obj.location.y updated.');
  t.equal(parseFloat(obj.aVelocity.x.toFixed(2)), 0.01, 'obj.aVelocity.x updated.');
  t.equal(parseFloat(obj.aVelocity.y.toFixed(2)), 0, 'obj.aVelocity.y updated.');
  t.equal(parseFloat(obj.angle.toFixed(2)), 44.49, 'obj.angle updated.');
  t.equal(obj.life, 100, 'obj.life should increment.');

  Burner.System._stepForward();

  t.equal(Burner.System._records.length, 1, 'If life > lifespan, step() should remove the object.');

  //

  beforeTest();

  var obj, parent;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    parent = this.add('Item', {
      location: new Burner.Vector(50, 50)
    });
    obj = this.add('Oscillator', {
      parent: parent
    });
  });

  Burner.System._stepForward();

  t.equal(parseFloat(obj.location.x.toFixed(2)), 51.8, 'obj.location.x is relative to parent location.x.');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 50, 'obj.location.y is relative to parent location.y.');

  //

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
    obj = this.add('Oscillator', {
      perlin: true,
      perlinOffsetX: 10000,
      perlinOffsetY: 10000
    });
  });

  Burner.System._stepForward();

  t.equal(parseFloat(obj.location.x.toFixed(2)), 194.54, 'obj.location.x updated via perlin noise.');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 153.94, 'obj.location.y updated via perlin noise.');

  t.end();

});

