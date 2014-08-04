var Burner = require('Burner'),
    test = require('tape'),
    Sensor, obj;

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

test('load Sensor.', function(t) {
  Sensor = require('../src/Sensor').Sensor;
  t.ok(Sensor, 'object loaded');
  t.end();
});

test('new Sensor() should have default properties.', function(t) {

  beforeTest();

  obj = new Sensor();
  t.equal(obj.name, 'Sensor', 'default name.');
  t.equal(obj.type, '', 'default type.');
  t.equal(typeof obj.behavior, 'function', 'default behavior.');
  t.equal(obj.sensitivity, 200, 'default sensitivity.');
  t.equal(obj.width, 7, 'default width.');
  t.equal(obj.height, 7, 'default height.');
  t.assert(obj.offsetDistance === 30, 'default offsetDistance.');
  t.equal(obj.offsetAngle, 0, 'default offsetAngle.');
  t.assert(obj.opacity === 0.75, 'default opacity.');
  t.equal(obj.target, null, 'default target.');
  t.assert(obj.activatedColor[0] === 255 && obj.activatedColor[1] === 255 && obj.activatedColor[2] === 255, 'default activatedColor.');
  t.equal(obj.borderRadius, 100, 'default borderRadius.');
  t.equal(obj.borderWidth, 2, 'default borderWidth.');
  t.equal(obj.borderStyle, 'solid', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 255 && obj.borderColor[1] === 255 && obj.borderColor[2] === 255, 'default borderColor.');
  t.equal(obj.onConsume, null, 'default onConsume.');

  t.end();
});

test('new Sensor() should have custom properties.', function(t) {

  beforeTest();

  obj = new Sensor({
    name: 'hello',
    type: 'heat',
    behavior: function() {return 100;},
    sensitivity: 100,
    width: 17,
    height: 17,
    offsetDistance: 10,
    offsetAngle: 30,
    opacity: 0.5,
    target: {x: 100},
    activatedColor: [100, 110, 120],
    borderRadius: 30,
    borderWidth: 4,
    borderStyle: 'double',
    borderColor: [100, 110, 120],
    onConsume: function() {return 100;}

  });
  t.equal(obj.name, 'hello', 'custom name.');
  t.equal(obj.type, 'heat', 'custom type');
  t.equal(obj.behavior(), 100, 'custom behavior.');
  t.equal(obj.width, 17, 'custom width.');
  t.equal(obj.height, 17, 'custom height.');
  t.assert(obj.offsetDistance, 10, 'custom offsetDistance.');
  t.equal(obj.offsetAngle, 30, 'custom offsetAngle.');
  t.assert(obj.opacity, 0.5, 'custom opacity.');
  t.equal(obj.target.x, 100, 'custom target.');
  t.assert(obj.activatedColor[0] === 100 && obj.activatedColor[1] === 110 && obj.activatedColor[2] === 120, 'custom activatedColor.');
  t.equal(obj.borderRadius, 30, 'custom borderRadius.');
  t.equal(obj.borderWidth, 4, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'double', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 100 && obj.borderColor[1] === 110 && obj.borderColor[2] === 120, 'custom borderColor.');
  t.equal(obj.borderWidth, 4, 'custom borderWidth.');
  t.equal(obj.onConsume(), 100, 'custom onConsume.');

  t.end();
});

test('init() should set additional properties.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Sensor: Sensor
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Sensor', {
      displayRange: true,
      displayConnector: true
    });
  });

  t.equal(obj.displayRange, true, 'custom displayRange.');
  t.equal(obj.displayConnector, true, 'custom displayConnector.');

  //

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Sensor: Sensor
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Sensor'); // add your new object to the system
  });

  t.equal(obj.displayRange, false, 'default displayRange.');
  t.equal(obj.displayConnector, false, 'default displayConnector.');
  t.equal(obj.activationLocation instanceof Burner.Vector, true, 'default activationLocation');
  t.equal(obj._force instanceof Burner.Vector, true, 'default _force');
  //

  t.end();
});
