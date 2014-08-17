var Burner = require('Burner'),
    test = require('tape'),
    Connector, obj;

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

test('load Connector.', function(t) {
  Connector = require('../src/Connector').Connector;
  t.ok(Connector, 'object loaded');
  t.end();
});

test('new Connector() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Connector', {
      parentA: {},
      parentB: {}
    });
  });

  t.equal(obj.name, 'Connector', 'name.');
  t.equal(obj.zIndex, 0, 'zIndex.');
  t.equal(obj.borderStyle, 'dotted', 'borderStyle.');
  t.assert(obj.borderColor[0] === 150 && obj.borderColor[1] === 150 && obj.borderColor[2] === 150, 'borderColor.');
  t.equal(obj.borderWidth, 1, 'borderWidth.');
  t.equal(obj.borderRadius, 0, 'borderRadius.');
  t.equal(obj.height, 0, 'height.');
  t.equal(obj.color, 'transparent', 'color.');
  t.end();
});

test('new Connector() should require options.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    t.throws(function () {
      this.add('Connector');
    }, 'should throw exception when not passed parentA and parentB.');
  });

  t.end();
});

test('new Connector() should require parentB.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    t.throws(function () {
      this.add('Connector', {
        parentA: {}
      });
    }, 'should throw exception when not passed parentB.');
  });

  t.end();
});

test('new Connector() should require parentA.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    t.throws(function () {
      this.add('Connector', {
        parentB: {}
      });
    }, 'should throw exception when not passed parentB.');
  });

  t.end();
});

test('step() should update properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Connector', {
      parentA: {
        location: new Burner.Vector()
      },
      parentB: {
        location: new Burner.Vector(100, 100)
      }
    });
    obj.step();
    t.equal(obj.angle, 45, 'should update angle.');
    t.equal(obj.width, 141, 'should update width.');
    t.equal(obj.location.x, 50, 'should update location x.');
    t.equal(obj.location.y, 50, 'should update location y.');
  });

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Connector', {
      parentA: {},
      parentB: {}
    });
    obj.draw();
    t.equal(obj.el.style.width, '10px', 'el.style width.');
    t.equal(obj.el.style.height, '0px', 'el.style height.');
    t.equal(obj.el.style.borderTopWidth, '1px', 'el.style border top width');
    t.equal(obj.el.style.borderRightWidth, '1px', 'el.style border right width');
    t.equal(obj.el.style.borderBottomWidth, '1px', 'el.style border bottom width');
    t.equal(obj.el.style.borderLeftWidth, '1px', 'el.style border left width');
    t.equal(obj.el.style.borderTopStyle, 'dotted', 'el.style border top style');
    t.equal(obj.el.style.borderRightStyle, 'dotted', 'el.style border right style');
    t.equal(obj.el.style.borderBottomStyle, 'dotted', 'el.style border bottom style');
    t.equal(obj.el.style.borderLeftStyle, 'dotted', 'el.style border left style');
    t.equal(obj.el.style.borderTopColor, 'rgb(150, 150, 150)', 'el.style border top color');
    t.equal(obj.el.style.borderRightColor, 'rgb(150, 150, 150)', 'el.style border right color');
    t.equal(obj.el.style.borderBottomColor, 'rgb(150, 150, 150)', 'el.style border bottom color');
    t.equal(obj.el.style.borderLeftColor, 'rgb(150, 150, 150)', 'el.style border left color');
    t.equal(obj.el.style.borderTopLeftRadius, '0% 0%', 'el.style border top left radius');
    t.equal(obj.el.style.borderTopRightRadius, '0% 0%', 'el.style border top right radius');
    t.equal(obj.el.style.borderBottomRightRadius, '0% 0%', 'el.style border bottom right radius');
    t.equal(obj.el.style.borderBottomLeftRadius, '0% 0%', 'el.style border bottom left radius');
  });

  t.end();
});
