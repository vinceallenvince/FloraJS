var Burner = require('burner'),
    test = require('tape'),
    ParticleSystem, obj;

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

test('load ParticleSystem.', function(t) {
  ParticleSystem = require('../src/ParticleSystem');
  t.ok(ParticleSystem, 'object loaded');
  t.end();
});

test('new ParticleSystem() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new ParticleSystem();
    obj.init(world);
  });

  t.notEqual(obj.name, 'ParticleSystem', 'System.add() should pass name.');
  t.equal(obj.width, 0, 'default width.');
  t.equal(obj.height, 0, 'default height.');
  t.assert(obj.color[0] === 255 && obj.color[1] === 255 && obj.color[2] === 255, 'default color.');
  t.equal(obj.borderWidth, 0, 'default borderWidth.');
  t.equal(obj.borderStyle, 'none', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 255 && obj.borderColor[1] === 255 && obj.borderColor[2] === 255, 'default borderColor.');
  t.equal(obj.borderRadius, 0, 'default borderRadius.');
  t.equal(obj.isStatic, true, 'default isStatic.');
  t.equal(obj.lifespan, -1, 'default lifespan.');
  t.equal(obj.life, -1, 'default life.');
  t.equal(obj.burst, 1, 'default burst.');
  t.equal(obj.burstRate, 4, 'default burstRate.');
  t.equal(obj.emitRadius, 3, 'default emitRadius.');
  t.assert(obj.startColor[0] === 255 && obj.startColor[1] === 255 && obj.startColor[2] === 255, 'default startColor.');
  t.assert(obj.endColor[0] === 255 && obj.endColor[1] === 0 && obj.endColor[2] === 0, 'default endColor.');
  t.equal(typeof obj.particleOptions, 'object', 'default particleOptions.');
  t.equal(obj.particleOptions.width, 15, 'default particleOptions.width.');
  t.equal(obj.particleOptions.height, 15, 'default particleOptions.height.');
  t.equal(obj.particleOptions.lifespan, 50, 'default particleOptions.lifespan.');
  t.equal(obj.particleOptions.borderRadius, 100, 'default particleOptions.borderRadius.');
  t.equal(obj.particleOptions.checkWorldEdges, false, 'default particleOptions.checkWorldEdges.');
  t.equal(obj.particleOptions.acceleration, null, 'default particleOptions.acceleration.');
  t.equal(obj.particleOptions.velocity, null, 'default particleOptions.velocity.');
  t.equal(obj.particleOptions.location, null, 'default particleOptions.location.');
  t.equal(obj.particleOptions.maxSpeed, 3, 'default particleOptions.maxSpeed.');
  t.equal(obj.particleOptions.fade, true, 'default particleOptions.fade.');
  t.equal(obj.particleOptions.shrink, true, 'default particleOptions.shrink.');
  t.end();
});

test('new ParticleSystem() should accept custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('ParticleSystem', {
      width: 10,
      height: 10,
      color: [10, 20, 30],
      borderWidth: 3,
      borderStyle: 'dotted',
      borderColor: [40, 50, 60],
      borderRadius: 30,
      isStatic: false,
      lifespan: 100,
      life: 21,
      burst: 1,
      burstRate: 4,
      emitRadius: 3,
      startColor: [255, 255, 255],
      endColor: [255, 0, 0],
      particleOptions: {
        width : 30,
        height : 30,
        lifespan : 100,
        borderRadius : 200,
        checkWorldEdges : true,
        acceleration: new Burner.Vector(10, 10),
        velocity: new Burner.Vector(20, 20),
        location: new Burner.Vector(30, 30),
        maxSpeed: 6,
        fade: false,
        shrink: false
      }
    });
  });

  t.equal(obj.width, 10, 'custom width.');
  t.equal(obj.height, 10, 'custom height.');
  t.assert(obj.color[0] === 10 && obj.color[1] === 20 && obj.color[2] === 30, 'custom color.');
  t.equal(obj.borderWidth, 3, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.assert(obj.borderColor[0] ===40 && obj.borderColor[1] === 50 && obj.borderColor[2] === 60, 'custom borderColor.');
  t.equal(obj.borderRadius, 30, 'custom borderRadius.');
  t.equal(obj.isStatic, false, 'custom isStatic.');
  t.equal(obj.lifespan, 100, 'custom lifespan.');
  t.equal(obj.life, 21, 'custom life.');
  t.equal(obj.burst, 1, 'custom burst.');
  t.equal(obj.burstRate, 4, 'custom burstRate.');
  t.equal(obj.emitRadius, 3, 'custom emitRadius.');
  t.assert(obj.startColor[0] === 255 && obj.startColor[1] === 255 && obj.startColor[2] === 255, 'custom startColor.');
  t.assert(obj.endColor[0] === 255 && obj.endColor[1] === 0 && obj.endColor[2] === 0, 'custom endColor.');
  t.equal(typeof obj.particleOptions, 'object', 'custom particleOptions.');
  t.equal(obj.particleOptions.width, 30, 'custom particleOptions.width.');
  t.equal(obj.particleOptions.height, 30, 'custom particleOptions.height.');
  t.equal(obj.particleOptions.lifespan, 100, 'custom particleOptions.lifespan.');
  t.equal(obj.particleOptions.borderRadius, 200, 'custom particleOptions.borderRadius.');
  t.equal(obj.particleOptions.checkWorldEdges, true, 'custom particleOptions.checkWorldEdges.');
  t.equal(obj.particleOptions.acceleration.x, 10, 'custom particleOptions.acceleration.');
  t.equal(obj.particleOptions.acceleration.y, 10, 'custom particleOptions.acceleration.');
  t.equal(obj.particleOptions.velocity.x, 20, 'custom particleOptions.velocity.');
  t.equal(obj.particleOptions.velocity.y, 20, 'custom particleOptions.velocity.');
  t.equal(obj.particleOptions.location.x, 30, 'custom particleOptions.location.');
  t.equal(obj.particleOptions.location.y, 30, 'custom particleOptions.location.');
  t.equal(obj.particleOptions.maxSpeed, 6, 'custom particleOptions.maxSpeed.');
  t.equal(obj.particleOptions.fade, false, 'custom particleOptions.fade.');
  t.equal(obj.particleOptions.shrink, false, 'custom particleOptions.shrink.');
  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('ParticleSystem'); // add your new object to the system
  });

  obj.draw();
  t.equal(obj.el.style.width, '', 'el.style width.');
  t.equal(obj.el.style.height, '', 'el.style height.');

  t.end();
});

test('applyAdditionalForces() should update shrink and opacity properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('ParticleSystem', {
      burstRate: 1,
      life: 0,
      lifespan: 1,
      particleOptions: {
        acceleration: new Burner.Vector(50, 50)
      }
    });
  });

  t.equal(obj.initParticleAcceleration.x, 50, 'initParticleAcceleration.');
  t.equal(obj.initParticleAcceleration.y, 50, 'initParticleAcceleration.');
  t.equal(obj.clock, 0, 'clock.');
  t.equal(typeof obj.beforeStep, 'function', 'beforeStep.');

  Burner.System._stepForward();

  t.equal(Burner.System._records.length, 3, 'ParticleSystem should create a particle.');

  Burner.System._stepForward();

  t.equal(Burner.System.getAllItemsByName('ParticleSystem').length, 0, 'ParticleSystem should be removed.');

  t.end();
});

