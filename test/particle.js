var Burner = require('burner'),
    test = require('tape'),
    Particle, obj;

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

test('load Particle.', function(t) {
  Particle = require('../src/Particle');
  t.ok(Particle, 'object loaded');
  t.end();
});

test('new Particle() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Particle();
    obj.init(world);
  });

  t.notEqual(obj.name, 'Particle', 'System.add() should pass name.');
  t.equal(obj.width, 20, 'default width.');
  t.equal(obj.height, 20, 'default height.');
  t.equal(obj.lifespan, 50, 'default lifespan.');
  t.equal(obj.life, 0, 'default life.');
  t.equal(obj.fade, true, 'default fade.');
  t.equal(obj.shrink, true, 'default shrink.');
  t.equal(obj.checkWorldEdges, false, 'default checkWorldEdges.');
  t.equal(obj.maxSpeed, 4, 'default maxSpeed.');
  t.equal(obj.zIndex, 1, 'default zIndex.');
  t.assert(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200, 'default color.');
  t.equal(obj.borderWidth, obj.width / 4, 'default borderWidth.');
  t.equal(obj.boxShadowSpread, obj.width / 4, 'default boxShadowSpread.');
  t.equal(obj.borderRadius, 100, 'default borderRadius.');

  t.end();
});

test('new Particle() should accept custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Particle', {
      width: 10,
      height: 10,
      lifespan: 10,
      life: 3,
      fade: false,
      shrink: false,
      checkWorldEdges: true,
      maxSpeed: 8,
      zIndex: 10,
      color: [100, 100, 100],
      borderWidth: 8,
      boxShadowSpread: 16,
      borderRadius: 30
    });
  });

  t.equal(obj.width, 10, 'custom width.');
  t.equal(obj.height, 10, 'custom height.');
  t.equal(obj.lifespan, 10, 'custom lifespan.');
  t.equal(obj.life, 3, 'custom life.');
  t.equal(obj.fade, false, 'custom fade.');
  t.equal(obj.shrink, false, 'custom shrink.');
  t.equal(obj.checkWorldEdges, true, 'custom checkWorldEdges.');
  t.equal(obj.maxSpeed, 8, 'custom maxSpeed.');
  t.equal(obj.zIndex, 10, 'custom zIndex.');
  t.assert(obj.color[0] === 100 && obj.color[1] === 100 && obj.color[2] === 100, 'custom color.');
  t.equal(obj.borderWidth, 8, 'custom borderWidth.');
  t.equal(obj.boxShadowSpread, 16, 'custom boxShadowSpread.');
  t.equal(obj.borderRadius, 30, 'custom borderRadius.');

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Particle', {
      borderWidth: 8,
      boxShadowSpread: 16
    }); // add your new object to the system
    obj.draw();
  });

  t.equal(obj.el.style.width, '20px', 'el.style width.');
  t.equal(obj.el.style.height, '20px', 'el.style height.');
  t.equal(obj.el.style.backgroundColor, 'rgb(200, 200, 200)', 'el.style backgroundColor');
  t.equal(obj.el.style.borderTopWidth, '8px', 'el.style border top width');
  t.equal(obj.el.style.borderRightWidth, '8px', 'el.style border right width');
  t.equal(obj.el.style.borderBottomWidth, '8px', 'el.style border bottom width');
  t.equal(obj.el.style.borderLeftWidth, '8px', 'el.style border left width');
  t.equal(obj.el.style.borderTopStyle, 'none', 'el.style border top style');
  t.equal(obj.el.style.borderRightStyle, 'none', 'el.style border right style');
  t.equal(obj.el.style.borderBottomStyle, 'none', 'el.style border bottom style');
  t.equal(obj.el.style.borderLeftStyle, 'none', 'el.style border left style');
  t.equal(obj.el.style.borderTopColor, 'rgb(0, 0, 0)', 'el.style border top color');
  t.equal(obj.el.style.borderRightColor, 'rgb(0, 0, 0)', 'el.style border right color');
  t.equal(obj.el.style.borderBottomColor, 'rgb(0, 0, 0)', 'el.style border bottom color');
  t.equal(obj.el.style.borderLeftColor, 'rgb(0, 0, 0)', 'el.style border left color');
  t.notEqual(obj.el.style.borderTopLeftRadius.search('100%'), -1, 'el.style border top left radius');
  t.notEqual(obj.el.style.borderTopRightRadius.search('100%'), -1, 'el.style border top right radius');
  t.notEqual(obj.el.style.borderBottomRightRadius.search('100%'), -1, 'el.style border bottom right radius');
  t.notEqual(obj.el.style.borderBottomLeftRadius.search('100%'), -1, 'el.style border bottom left radius');
  t.notEqual(obj.el.style.boxShadow.search('0px 0px 0px 16px'), -1, 'el.style boxShadow');
  t.equal(obj.el.style.opacity, '1', 'el.style opacity');
  t.equal(obj.el.style.zIndex, '1', 'el.style zIndex');

  t.end();
});

test('applyAdditionalForces() should update shrink and opacity properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Particle', {
      life: 5,
      lifespan: 10
    }); // add your new object to the system
  });

  obj.afterStep();

  t.equal(obj.opacity, 0.5, 'updates opacity');
  t.equal(obj.width, 10, 'updates width');
  t.equal(obj.height, 10, 'updates height');

  t.end();
});


